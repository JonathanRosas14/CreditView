import { NextResponse } from "next/server"
import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { prisma } from "@creditview/database"
import { verifyMobileToken, unauthorized } from "../lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

function deriveCategory(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes("amazon") || desc.includes("apple") || desc.includes("macbook") || desc.includes("iphone") || desc.includes("electronics")) return "Electronics"
  if (desc.includes("whole foods") || desc.includes("éxito") || desc.includes("supermarket") || desc.includes("market") || desc.includes("groceries")) return "Groceries"
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("subscription")) return "Subscription"
  if (desc.includes("uber") || desc.includes("rappi") || desc.includes("ride") || desc.includes("transport") || desc.includes("travel")) return "Travel"
  if (desc.includes("delta") || desc.includes("lufthansa") || desc.includes("airline")) return "Travel"
  if (desc.includes("dining") || desc.includes("restaurant") || desc.includes("coucou")) return "Dining & Drinks"
  if (desc.includes("health") || desc.includes("wellness") || desc.includes("gym") || desc.includes("pharmacy") || desc.includes("medical")) return "Health & Wellness"
  if (desc.includes("shopping") || desc.includes("mall") || desc.includes("store") || desc.includes("retail") || desc.includes("amazon")) return "Shopping"
  if (desc.includes("payment") || desc.includes("pago") || desc.includes("deposit")) return "Income"
  return "Other"
}

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 30, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const cards = await cardRepo.findByUserId(payload.sub)
    const cardIds = cards.map((c) => c.id)

    if (cardIds.length === 0) {
      return NextResponse.json({
        totalBalance: 0,
        totalLimit: 0,
        totalCards: 0,
        recentTransactions: [],
        spendingByCategory: [],
      })
    }

    const records = await prisma.transaction.findMany({
      where: { cardId: { in: cardIds } },
      orderBy: { date: "desc" },
      take: 8,
      include: { card: { select: { name: true } } },
    })

    const recentTransactions = records.map((r) => ({
      id: r.id,
      description: r.description,
      amount: Number(r.amount),
      currency: r.currency,
      type: r.type,
      date: r.date,
      cardName: r.card.name,
      cardId: r.cardId,
    }))

    const allTxs = await prisma.transaction.findMany({
      where: { cardId: { in: cardIds }, type: { not: "PAYMENT" } },
    })

    const byCategory = new Map<string, number>()
    for (const tx of allTxs) {
      const cat = deriveCategory(tx.description)
      byCategory.set(cat, (byCategory.get(cat) || 0) + Number(tx.amount))
    }

    const spendingByCategory = Array.from(byCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)

    const totalBalance = cards.reduce((sum, c) => sum + c.usedBalance.amount, 0)
    const totalLimit = cards.reduce((sum, c) => sum + c.totalLimit.amount, 0)

    return NextResponse.json({
      totalBalance,
      totalLimit,
      totalCards: cards.length,
      recentTransactions,
      spendingByCategory,
    })
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}
