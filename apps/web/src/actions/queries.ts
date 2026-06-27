"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { verifySession } from "@/lib/dal"
import { prisma } from "@creditview/database"
import { checkRateLimit } from "@/lib/rate-limit"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

export async function getCards() {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) throw new Error("Too many requests. Try again later.")
  return cardRepo.findByUserId(user.id)
}

export async function getCard(id: string) {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) return null
  const card = await cardRepo.findById(id)
  if (!card || card.userId !== user.id) return null
  return card
}

export async function getCardTransactions(cardId: string) {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) return []
  const card = await cardRepo.findById(cardId)
  if (!card || card.userId !== user.id) return []
  return txRepo.findByCardId(cardId)
}

export async function getRecentTransactions(limit: number): Promise<RecentTransaction[]>
export async function getRecentTransactions(limit: number, cardIds: string[]): Promise<RecentTransaction[]>
export async function getRecentTransactions(limit = 8, cardIds?: string[]): Promise<RecentTransaction[]> {
  if (!cardIds || cardIds.length === 0) {
    const user = await verifySession()
    const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
    if (limited) return []
    const cards = await cardRepo.findByUserId(user.id)
    cardIds = cards.map((c) => c.id)
  }

  if (cardIds.length === 0) return []

  const records = await prisma.transaction.findMany({
    where: { cardId: { in: cardIds } },
    orderBy: { date: "desc" },
    take: limit,
    include: { card: { select: { name: true } } },
  })

  return records.map((r) => ({
    id: r.id,
    description: r.description,
    amount: Number(r.amount),
    currency: r.currency,
    type: r.type,
    date: r.date,
    cardName: r.card.name,
    cardId: r.cardId,
  }))
}

export type RecentTransaction = {
  id: string
  description: string
  amount: number
  currency: string
  type: string
  date: Date
  cardName: string
  cardId: string
}

function deriveCategory(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes("amazon") || desc.includes("apple") || desc.includes("macbook") || desc.includes("iphone") || desc.includes("electronics")) return "ELECTRONICS"
  if (desc.includes("whole foods") || desc.includes("éxito") || desc.includes("supermarket") || desc.includes("market")) return "GROCERIES"
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("subscription")) return "SUBSCRIPTION"
  if (desc.includes("uber") || desc.includes("rappi") || desc.includes("ride") || desc.includes("transport")) return "TRANSPORT"
  if (desc.includes("delta") || desc.includes("lufthansa") || desc.includes("airline") || desc.includes("travel")) return "TRAVEL"
  if (desc.includes("payment") || desc.includes("pago") || desc.includes("deposit")) return "INCOME"
  if (desc.includes("dining") || desc.includes("restaurant") || desc.includes("coucou") || desc.includes("le coucou")) return "DINING"
  return "OTHER"
}

export async function getAllTransactions(
  page = 1,
  pageSize = 10,
  filters?: { cardId?: string; dateFrom?: string; dateTo?: string; search?: string },
) {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) return { transactions: [], total: 0, page, pageSize, totalPages: 0 }

  const cards = await cardRepo.findByUserId(user.id)
  const cardIds = cards.map((c) => c.id)
  if (cardIds.length === 0) return { transactions: [], total: 0, page, pageSize, totalPages: 0 }

  const where: Record<string, unknown> = { cardId: { in: cardIds } }

  if (filters?.cardId) {
    where.cardId = filters.cardId
  }

  if (filters?.dateFrom || filters?.dateTo) {
    const dateFilter: Record<string, Date> = {}
    if (filters.dateFrom) dateFilter.gte = new Date(filters.dateFrom)
    if (filters.dateTo) dateFilter.lte = new Date(filters.dateTo + "T23:59:59.999Z")
    where.date = dateFilter
  }

  if (filters?.search) {
    where.description = { contains: filters.search, mode: "insensitive" }
  }

  const [records, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { card: { select: { name: true } } },
    }),
    prisma.transaction.count({ where }),
  ])

  const transactions = records.map((r) => ({
    id: r.id,
    description: r.description,
    amount: Number(r.amount),
    currency: r.currency,
    type: r.type,
    date: r.date,
    cardName: r.card.name,
    cardId: r.cardId,
    category: deriveCategory(r.description),
    status: r.type === "PAYMENT" ? "Cleared" : "Pending",
  }))

  return {
    transactions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export type { Card } from "@creditview/core"
