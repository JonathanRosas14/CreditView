"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { z } from "zod"

const cardIdSchema = z.string().optional()

export async function exportTransactionsCSV(cardId?: string): Promise<string> {
  const user = await verifySession()

  const parsed = cardIdSchema.safeParse(cardId)
  const validCardId = parsed.success ? parsed.data : undefined

  const where: Record<string, unknown> = validCardId
    ? { cardId: validCardId, card: { userId: user.id } }
    : { card: { userId: user.id } }

  const transactions = await prisma.transaction.findMany({
    where,
    include: { card: { select: { name: true, currencyCode: true } } },
    orderBy: { date: "desc" },
  })

  const header = "Date,Card,Type,Description,Amount,Currency,Installment\n"
  const rows = transactions
    .map(
      (tx) =>
        `${tx.date.toISOString().split("T")[0]},${tx.card.name},${tx.type},${tx.description.replace(/,/g, "")},${tx.amount},${tx.currency},${tx.isInstallment ? "Yes" : "No"}`,
    )
    .join("\n")

  return header + rows
}
