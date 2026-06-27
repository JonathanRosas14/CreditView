import { NextRequest, NextResponse } from "next/server"
import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { CardService, Money } from "@creditview/core"
import { verifyMobileToken, unauthorized } from "../lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()
const cardService = new CardService(cardRepo, txRepo)

const createSchema = z.object({
  name: z.string().min(1),
  bank: z.string().min(1),
  totalLimit: z.number().positive(),
  cutoffDay: z.number().int().min(1).max(30),
  paymentDay: z.number().int().min(1).max(30),
  interestRate: z.number().min(0),
  currencyCode: z.string().length(3),
})

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 30, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const cards = await cardRepo.findByUserId(payload.sub)
    const result = cards.map((c) => ({
      id: c.id,
      name: c.name,
      bank: c.bank,
      totalLimit: c.totalLimit.amount,
      usedBalance: c.usedBalance.amount,
      availableBalance: c.availableBalance.amount,
      cutoffDay: c.cutoffDay,
      paymentDay: c.paymentDay,
      interestRate: c.interestRate,
      currencyCode: c.currencyCode,
      isActive: c.isActive,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))
    return NextResponse.json(result)
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 10, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const card = await cardService.createCard({ userId: payload.sub, ...parsed.data })
    return NextResponse.json({
      id: card.id,
      name: card.name,
      bank: card.bank,
      totalLimit: card.totalLimit.amount,
      usedBalance: card.usedBalance.amount,
      availableBalance: card.availableBalance.amount,
      cutoffDay: card.cutoffDay,
      paymentDay: card.paymentDay,
      interestRate: card.interestRate,
      currencyCode: card.currencyCode,
    }, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
