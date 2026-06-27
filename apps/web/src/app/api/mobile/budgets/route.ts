import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@creditview/database"
import { verifyMobileToken, unauthorized } from "../lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { z } from "zod"

const createSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
  period: z.enum(["MONTHLY", "YEARLY"]),
  startDate: z.string().min(1),
  cardId: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 30, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    const budgets = await prisma.budget.findMany({
      where: { userId: payload.sub },
      include: { card: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      budgets.map((b) => ({
        id: b.id,
        category: b.category,
        amount: Number(b.amount),
        period: b.period,
        spent: Number(b.spent),
        startDate: b.startDate,
        endDate: b.endDate,
        card: b.card,
        createdAt: b.createdAt,
      })),
    )
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

    const { category, amount, period, startDate, cardId } = parsed.data
    const budget = await prisma.budget.create({
      data: {
        userId: payload.sub,
        cardId: cardId || null,
        category,
        amount,
        period,
        startDate: new Date(startDate),
        spent: 0,
      },
    })

    return NextResponse.json({
      id: budget.id,
      category: budget.category,
      amount: Number(budget.amount),
      period: budget.period,
      spent: Number(budget.spent),
      startDate: budget.startDate,
      endDate: budget.endDate,
      card: null,
    }, { status: 201 })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
