"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { verifySession } from "@/lib/dal"
import { prisma } from "@creditview/database"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

export async function getCards() {
  const user = await verifySession()
  return cardRepo.findByUserId(user.id)
}

export async function getCard(id: string) {
  const user = await verifySession()
  const card = await cardRepo.findById(id)
  if (!card || card.userId !== user.id) return null
  return card
}

export async function getCardTransactions(cardId: string) {
  const user = await verifySession()
  const card = await cardRepo.findById(cardId)
  if (!card || card.userId !== user.id) return []
  return txRepo.findByCardId(cardId)
}

export async function getRecentTransactions(limit = 8) {
  const user = await verifySession()
  const cards = await cardRepo.findByUserId(user.id)
  const cardIds = cards.map((c) => c.id)
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

export async function getAllTransactions(page = 1, pageSize = 10) {
  const user = await verifySession()
  const cards = await cardRepo.findByUserId(user.id)
  const cardIds = cards.map((c) => c.id)
  if (cardIds.length === 0) return { transactions: [], total: 0, page, pageSize, totalPages: 0 }

  const [records, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { cardId: { in: cardIds } },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { card: { select: { name: true } } },
    }),
    prisma.transaction.count({
      where: { cardId: { in: cardIds } },
    }),
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
