"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { Money, Transaction } from "@creditview/core"
import { verifySession } from "@/lib/dal"
import { logAuditEvent } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { prisma } from "@creditview/database"
import { createTransactionSchema } from "@/lib/validation"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

export async function createTransactionAction(
  _prevState: unknown,
  formData: FormData,
) {
  const user = await verifySession()

  const parsed = createTransactionSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { cardId, type, amount, description, date: dateStr, installments } = parsed.data

  try {
    const cardRecord = await cardRepo.findById(cardId)
    if (!cardRecord) return { success: false, error: "Card not found" }
    if (cardRecord.userId !== user.id) return { success: false, error: "Card not found" }

    const tx = Transaction.create({
      cardId,
      type,
      amount: new Money(amount, cardRecord.currencyCode),
      description,
      date: new Date(dateStr),
      currency: cardRecord.currencyCode,
      isInstallment: installments > 1,
    })

    if (type === "PAYMENT") {
      cardRecord.recordPayment(tx.amount)
    } else {
      cardRecord.recordTransaction(tx.amount)
    }

    await cardRepo.save(cardRecord)
    await txRepo.save(tx)

    await logAuditEvent({
      userId: user.id,
      entity: "Transaction",
      entityId: tx.id,
      action: "CREATE",
      newValue: {
        cardId,
        type,
        amount: tx.amount.amount,
        currency: tx.currency,
        description,
        date: dateStr,
        isInstallment: installments > 1,
      },
    })

    if (installments > 1) {
      const installmentAmount = Math.round((amount / installments) * 100) / 100
      const card = await prisma.card.findUnique({ where: { id: cardId } })
      if (card) {
        await prisma.installment.create({
          data: {
            transactionId: tx.id,
            totalInstallments: installments,
            paidInstallments: 0,
            installmentAmount,
            nextDueDate: new Date(
              new Date(dateStr).getFullYear(),
              new Date(dateStr).getMonth() + 1,
              card.paymentDay,
            ),
          },
        })
      }
    }

    revalidatePath(`/cards/${cardId}`)
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
