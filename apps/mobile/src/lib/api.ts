import * as SecureStore from "expo-secure-store"
import { router } from "expo-router"

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://creditview.vercel.app"
const TOKEN_KEY = "auth_token"

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/api/mobile${path}`, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    await removeToken()
    router.replace("/login")
    throw new ApiError(401, "Unauthorized")
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Request failed" }))
    throw new ApiError(response.status, body.error ?? "Request failed")
  }

  return response.json()
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: { id: string; email: string; name: string } }>(
        "/auth/login", { method: "POST", body: JSON.stringify(data) }
      ),
    register: (data: { name: string; email: string; password: string }) =>
      request<{ token: string; user: { id: string; email: string; name: string } }>(
        "/auth/register", { method: "POST", body: JSON.stringify(data) }
      ),
    me: () => request<{ id: string; email: string; name: string }>("/auth/me"),
  },
  cards: {
    list: () =>
      request<Array<{
        id: string; name: string; bank: string; totalLimit: number
        usedBalance: number; availableBalance: number; cutoffDay: number
        paymentDay: number; interestRate: number; currencyCode: string
        isActive: boolean; createdAt: string; updatedAt: string
      }>>("/cards"),
    get: (id: string) =>
      request<{
        card: {
          id: string; name: string; bank: string; totalLimit: number
          usedBalance: number; availableBalance: number; cutoffDay: number
          paymentDay: number; interestRate: number; currencyCode: string
          isActive: boolean
        }
        transactions: Array<{
          id: string; type: string; amount: number; currency: string
          description: string; date: string; isInstallment: boolean
          budgetId?: string
        }>
      }>(`/cards/${id}`),
    create: (data: {
      name: string; bank: string; totalLimit: number
      cutoffDay: number; paymentDay: number; interestRate: number
      currencyCode: string
    }) => request("/cards", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: {
      name: string; bank: string; totalLimit: number
      cutoffDay: number; paymentDay: number; interestRate: number
      currencyCode: string
    }) => request(`/cards/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/cards/${id}`, { method: "DELETE" }),
  },
  transactions: {
    list: (params?: {
      page?: number; pageSize?: number; cardId?: string
      dateFrom?: string; dateTo?: string; search?: string
    }) => {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set("page", String(params.page))
      if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize))
      if (params?.cardId) searchParams.set("cardId", params.cardId)
      if (params?.dateFrom) searchParams.set("dateFrom", params.dateFrom)
      if (params?.dateTo) searchParams.set("dateTo", params.dateTo)
      if (params?.search) searchParams.set("search", params.search)
      const qs = searchParams.toString()
      return request<{
        transactions: Array<{
          id: string; description: string; amount: number; currency: string
          type: string; date: string; cardName: string; cardId: string
          category: string; status: string
        }>
        total: number; page: number; pageSize: number; totalPages: number
      }>(`/transactions${qs ? `?${qs}` : ""}`)
    },
    create: (data: {
      cardId: string; type: "PURCHASE" | "PAYMENT" | "ADVANCE"
      amount: number; description: string; date: string
      installments?: number; budgetId?: string
    }) => request<{ success: boolean; transaction: Record<string, unknown>; warning?: string }>(
      "/transactions", { method: "POST", body: JSON.stringify(data) }
    ),
  },
  statements: {
    list: () =>
      request<Array<{
        cardId: string; cardName: string; bank: string; currencyCode: string
        year: number; month: number; openingBalance: number
        closingBalance: number; totalPurchases: number; totalPayments: number
        transactionCount: number; totalLimit: number
      }>>("/statements"),
  },
  budgets: {
    list: () =>
      request<Array<{
        id: string; category: string; amount: number; period: string
        spent: number; startDate: string; endDate: string | null
        card: { id: string; name: string } | null
        createdAt: string
      }>>("/budgets"),
    create: (data: {
      category: string; amount: number; period: "MONTHLY" | "YEARLY"
      startDate: string; cardId?: string
    }) => request("/budgets", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/budgets/${id}`, { method: "DELETE" }),
  },
  reports: {
    get: () =>
      request<{
        bigNumber: number; totalLimit: number; totalUsed: number
        currency: string; cardCount: number
        monthlyTrend: Array<{ month: string; year: number; monthIndex: number; spending: number; payments: number }>
        categoryBreakdown: Array<{ category: string; amount: number; percentage: number }>
        totalSpending: number
      }>("/reports"),
  },
  dashboard: {
    get: () =>
      request<{
        totalBalance: number; totalLimit: number; totalCards: number
        recentTransactions: Array<{
          id: string; description: string; amount: number; currency: string
          type: string; date: string; cardName: string; cardId: string
        }>
        spendingByCategory: Array<{ category: string; amount: number }>
      }>("/dashboard"),
  },
}
