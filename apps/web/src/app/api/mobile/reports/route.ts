import { NextResponse } from "next/server"
import { prisma } from "@creditview/database"
import { PrismaCardRepository } from "@creditview/infra"
import { verifyMobileToken, unauthorized } from "../lib/auth"

const cardRepo = new PrismaCardRepository()

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

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    const cards = await cardRepo.findByUserId(payload.sub)
    const cardIds = cards.map((c) => c.id)

    const allTransactions = cardIds.length > 0
      ? await prisma.transaction.findMany({
          where: { cardId: { in: cardIds } },
          orderBy: { date: "desc" },
        })
      : []

    const transactions = allTransactions.filter((t) => t.type !== "PAYMENT")
    const amounts = transactions.map((t) => ({ ...t, amount: Number(t.amount) }))

    const byCurrency = cards.reduce<Record<string, typeof cards>>((acc, card) => {
      if (!acc[card.currencyCode]) acc[card.currencyCode] = []
      acc[card.currencyCode].push(card)
      return acc
    }, {})

    const currency = Object.keys(byCurrency)[0] ?? "USD"
    const totalLimit = cards.reduce((sum, c) => sum + c.totalLimit.amount, 0)
    const totalUsed = cards.reduce((sum, c) => sum + c.usedBalance.amount, 0)

    const byCategory = new Map<string, number>()
    for (const tx of amounts) {
      const cat = deriveCategory(tx.description)
      byCategory.set(cat, (byCategory.get(cat) || 0) + tx.amount)
    }

    const categoryBreakdown = Array.from(byCategory.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: amounts.length > 0 ? Math.round((amount / amounts.reduce((s, t) => s + t.amount, 0)) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    const monthlyData: Array<{ month: string; year: number; monthIndex: number; spending: number; payments: number }> = []
    const monthMap = new Map<string, { spending: number; payments: number }>()

    for (const tx of allTransactions) {
      const key = `${tx.date.getFullYear()}-${tx.date.getMonth()}`
      const entry = monthMap.get(key) || { spending: 0, payments: 0 }
      const amt = Number(tx.amount)
      if (tx.type === "PAYMENT") entry.payments += amt
      else entry.spending += amt
      monthMap.set(key, entry)
    }

    for (const [key, data] of monthMap) {
      const [yearStr, monthIdx] = key.split("-")
      const year = parseInt(yearStr)
      const monthIndex = parseInt(monthIdx)
      monthlyData.push({
        month: MONTHS[monthIndex],
        year,
        monthIndex,
        spending: data.spending,
        payments: data.payments,
      })
    }
    monthlyData.sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex)

    const bigNumber = totalLimit - totalUsed

    return NextResponse.json({
      bigNumber,
      totalLimit,
      totalUsed,
      currency,
      cardCount: cards.length,
      monthlyTrend: monthlyData.slice(-12),
      categoryBreakdown: categoryBreakdown.slice(0, 8),
      totalSpending: amounts.reduce((s, t) => s + t.amount, 0),
    })
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}
