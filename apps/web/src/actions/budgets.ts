"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { logAuditEvent } from "@/lib/audit"
import { checkRateLimit } from "@/lib/rate-limit"

const createBudgetSchema = z.object({
  cardId: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  period: z.enum(["MONTHLY", "YEARLY"]),
  startDate: z.string().min(1, "Start date is required"),
})

export type BudgetWithCard = {
  id: string
  category: string
  amount: number
  period: string
  spent: number
  startDate: Date
  endDate: Date | null
  card: { id: string; name: string } | null
  createdAt: Date
}

export async function getBudgets(): Promise<BudgetWithCard[]> {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) throw new Error("Too many requests. Try again later.")

  const budgets = await prisma.budget.findMany({
    where: { userId: user.id },
    include: { card: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return budgets.map((b: typeof budgets[number]) => ({
    id: b.id,
    category: b.category,
    amount: Number(b.amount),
    period: b.period,
    spent: Number(b.spent),
    startDate: b.startDate,
    endDate: b.endDate,
    card: b.card,
    createdAt: b.createdAt,
  }))
}

export async function createBudgetAction(
  _prevState: unknown,
  formData: FormData,
) {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 10, windowMs: 60_000 })
  if (limited) return { success: false, error: "Too many requests. Try again later." }

  const parsed = createBudgetSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { cardId, category, amount, period, startDate } = parsed.data

  try {
    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        cardId: cardId || null,
        category,
        amount,
        period,
        startDate: new Date(startDate),
        spent: 0,
      },
    })

    await logAuditEvent({
      userId: user.id,
      entity: "Budget",
      entityId: budget.id,
      action: "CREATE",
      newValue: { category, amount, period, cardId: cardId || null },
    })

    revalidatePath("/budgets")
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteBudgetAction(id: string) {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 10, windowMs: 60_000 })
  if (limited) throw new Error("Too many requests. Try again later.")

  const budget = await prisma.budget.findUnique({ where: { id } })
  if (!budget || budget.userId !== user.id) throw new Error("Not found")

  await logAuditEvent({
    userId: user.id,
    entity: "Budget",
    entityId: id,
    action: "DELETE",
    oldValue: { category: budget.category, amount: Number(budget.amount), period: budget.period },
  })

  await prisma.budget.delete({ where: { id } })
  revalidatePath("/budgets")
}
