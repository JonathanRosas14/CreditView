import { NextRequest, NextResponse } from "next/server"
import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { CardService, Money } from "@creditview/core"
import { verifyMobileToken, unauthorized } from "../../lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()
const cardService = new CardService(cardRepo, txRepo)

const updateSchema = z.object({
  name: z.string().min(1),
  bank: z.string().min(1),
  totalLimit: z.number().positive(),
  cutoffDay: z.number().int().min(1).max(30),
  paymentDay: z.number().int().min(1).max(30),
  interestRate: z.number().min(0),
  currencyCode: z.string().length(3),
})

async function getOwnedCard(cardId: string, userId: string) {
  const card = await cardRepo.findById(cardId)
  if (!card || card.userId !== userId) return null
  return card
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 30, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const { id } = await params
    const card = await getOwnedCard(id, payload.sub)
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const transactions = await txRepo.findByCardId(id)
    const txs = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount.amount,
      currency: t.currency,
      description: t.description,
      date: t.date,
      isInstallment: t.isInstallment,
      budgetId: t.budgetId,
    }))

    return NextResponse.json({
      card: {
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
        isActive: card.isActive,
      },
      transactions: txs,
    })
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 10, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const { id } = await params
    const card = await getOwnedCard(id, payload.sub)
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const updated = await cardService.updateCard(id, payload.sub, parsed.data)
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      bank: updated.bank,
      totalLimit: updated.totalLimit.amount,
      usedBalance: updated.usedBalance.amount,
      availableBalance: updated.availableBalance.amount,
      cutoffDay: updated.cutoffDay,
      paymentDay: updated.paymentDay,
      interestRate: updated.interestRate,
      currencyCode: updated.currencyCode,
    })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 10, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const { id } = await params
    const card = await getOwnedCard(id, payload.sub)
    if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await cardRepo.delete(id)
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
