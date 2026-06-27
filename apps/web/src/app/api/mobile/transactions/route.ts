import { NextRequest, NextResponse } from "next/server"
import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { Money, Transaction } from "@creditview/core"
import { prisma } from "@creditview/database"
import { verifyMobileToken, unauthorized } from "../lib/auth"
import { z } from "zod"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

const createSchema = z.object({
  cardId: z.string().min(1),
  type: z.enum(["PURCHASE", "PAYMENT", "ADVANCE"]),
  amount: z.number().positive(),
  description: z.string().min(1),
  date: z.string().min(1),
  installments: z.number().int().min(0).default(0),
  budgetId: z.string().optional(),
})

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

function clampPage(page: number): number {
  return Math.max(1, Math.floor(page))
}

function clampPageSize(size: number): number {
  return Math.max(1, Math.min(100, Math.floor(size)))
}

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyMobileToken(request)
    const cards = await cardRepo.findByUserId(payload.sub)
    const cardIds = cards.map((c) => c.id)
    if (cardIds.length === 0) {
      return NextResponse.json({ transactions: [], total: 0 })
    }

    const url = new URL(request.url)
    const page = clampPage(parseInt(url.searchParams.get("page") ?? "1") || 1)
    const pageSize = clampPageSize(parseInt(url.searchParams.get("pageSize") ?? "20") || 20)
    const cardId = url.searchParams.get("cardId")
    const dateFrom = url.searchParams.get("dateFrom")
    const dateTo = url.searchParams.get("dateTo")
    const search = url.searchParams.get("search")

    const where: Record<string, unknown> = { cardId: { in: cardIds } }
    if (cardId) where.cardId = cardId
    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {}
      if (dateFrom) dateFilter.gte = new Date(dateFrom)
      if (dateTo) dateFilter.lte = new Date(dateTo + "T23:59:59.999Z")
      where.date = dateFilter
    }
    if (search) where.description = { contains: search, mode: "insensitive" }

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

    return NextResponse.json({
      transactions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyMobileToken(request)
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const { cardId, type, amount, description, date: dateStr, installments, budgetId } = parsed.data

    const cardRecord = await cardRepo.findById(cardId)
    if (!cardRecord || cardRecord.userId !== payload.sub) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const tx = Transaction.create({
      cardId,
      type,
      amount: new Money(amount, cardRecord.currencyCode),
      description,
      date: new Date(dateStr),
      currency: cardRecord.currencyCode,
      isInstallment: installments > 1,
      budgetId: budgetId || undefined,
    })

    if (type === "PAYMENT") {
      cardRecord.recordPayment(tx.amount)
    } else {
      cardRecord.recordTransaction(tx.amount)
    }

    await cardRepo.save(cardRecord)
    await txRepo.save(tx)

    let warning: string | null = null
    if (budgetId) {
      const delta = type === "PAYMENT" ? -amount : amount
      const budget = await prisma.budget.findUnique({ where: { id: budgetId } })
      if (budget && budget.userId === payload.sub) {
        const newSpent = Number(budget.spent) + delta
        await prisma.budget.update({
          where: { id: budgetId },
          data: { spent: newSpent },
        })
        if (newSpent > Number(budget.amount)) {
          warning = `Warning: This transaction will exceed your ${budget.category} budget`
        }
      }
    }

    if (installments > 1) {
      const installmentAmount = Math.round((amount / installments) * 100) / 100
      const card = await prisma.card.findUnique({ where: { id: cardId } })
      if (card) {
        await prisma.installment.create({
          data: {
            transactionId: tx.id,
            totalInstallments: installments,
            paidInstallments: 0,
            installmentAmount,
            nextDueDate: new Date(
              new Date(dateStr).getFullYear(),
              new Date(dateStr).getMonth() + 1,
              card.paymentDay,
            ),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      transaction: {
        id: tx.id,
        type: tx.type,
        amount: tx.amount.amount,
        currency: tx.currency,
        description: tx.description,
        date: tx.date,
        isInstallment: tx.isInstallment,
        budgetId: tx.budgetId,
      },
      warning,
    }, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
