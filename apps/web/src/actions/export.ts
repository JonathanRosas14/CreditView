"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"

export async function exportTransactionsCSV(cardId?: string): Promise<string> {
  const user = await verifySession()

  const where: Record<string, unknown> = cardId
    ? { cardId, card: { userId: user.id } }
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
