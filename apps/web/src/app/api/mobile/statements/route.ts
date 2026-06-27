import { NextResponse } from "next/server"
import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { verifyMobileToken, unauthorized } from "../lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 30, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const cards = await cardRepo.findByUserId(payload.sub)

    const statements: Array<{
      cardId: string
      cardName: string
      bank: string
      currencyCode: string
      year: number
      month: number
      openingBalance: number
      closingBalance: number
      totalPurchases: number
      totalPayments: number
      transactionCount: number
      totalLimit: number
    }> = []

    for (const card of cards) {
      const txs = await txRepo.findByCardId(card.id)
      const byMonth = new Map<string, { txs: typeof txs; openingBalance: number }>()
      const sorted = [...txs].sort((a, b) => a.date.getTime() - b.date.getTime())
      if (sorted.length === 0) continue

      for (const tx of sorted) {
        const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, "0")}`
        if (!byMonth.has(key)) byMonth.set(key, { txs: [], openingBalance: 0 })
        byMonth.get(key)!.txs.push(tx)
      }

      let cumulative = 0
      const sortedMonths = Array.from(byMonth.entries()).sort()

      for (let i = 0; i < sortedMonths.length; i++) {
        const [, data] = sortedMonths[i]
        const [yearStr, monthStr] = sortedMonths[i][0].split("-")
        const year = parseInt(yearStr)
        const month = parseInt(monthStr)

        let purchases = 0
        let payments = 0
        for (const tx of data.txs) {
          if (tx.type === "PAYMENT") payments += tx.amount.amount
          else purchases += tx.amount.amount
          cumulative += tx.type === "PAYMENT" ? -tx.amount.amount : tx.amount.amount
        }

        statements.push({
          cardId: card.id,
          cardName: card.name,
          bank: card.bank,
          currencyCode: card.currencyCode,
          year,
          month,
          openingBalance: cumulative - (purchases - payments),
          closingBalance: cumulative,
          totalPurchases: purchases,
          totalPayments: payments,
          transactionCount: data.txs.length,
          totalLimit: card.totalLimit.amount,
        })
      }
    }

    return NextResponse.json(statements)
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}
