"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { CardService } from "@creditview/core"
import { verifySession } from "@/lib/dal"
import { logAuditEvent } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { createCardSchema, updateCardSchema } from "@/lib/validation"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()
const cardService = new CardService(cardRepo, txRepo)

export async function createCardAction(_prevState: unknown, formData: FormData) {
  const user = await verifySession()

  const parsed = createCardSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    const card = await cardService.createCard({
      userId: user.id,
      ...parsed.data,
    })

    await logAuditEvent({
      userId: user.id,
      entity: "Card",
      entityId: card.id,
      action: "CREATE",
      newValue: {
        name: card.name,
        bank: card.bank,
        totalLimit: card.totalLimit.amount,
        currencyCode: card.currencyCode,
        cutoffDay: card.cutoffDay,
        paymentDay: card.paymentDay,
        interestRate: card.interestRate,
      },
    })

    revalidatePath("/cards")
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateCardAction(cardId: string, _prevState: unknown, formData: FormData) {
  const user = await verifySession()

  const parsed = updateCardSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    const card = await cardService.updateCard(cardId, user.id, parsed.data)

    await logAuditEvent({
      userId: user.id,
      entity: "Card",
      entityId: card.id,
      action: "UPDATE",
      oldValue: undefined,
      newValue: {
        name: card.name,
        bank: card.bank,
        totalLimit: card.totalLimit.amount,
        currencyCode: card.currencyCode,
        cutoffDay: card.cutoffDay,
        paymentDay: card.paymentDay,
        interestRate: card.interestRate,
      },
    })

    revalidatePath(`/cards/${cardId}`)
    revalidatePath("/cards")
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteCardAction(id: string) {
  const user = await verifySession()

  const card = await cardRepo.findById(id)
  if (!card) throw new Error("Card not found")
  if (card.userId !== user.id) throw new Error("Forbidden")

  await logAuditEvent({
    userId: user.id,
    entity: "Card",
    entityId: card.id,
    action: "DELETE",
    oldValue: {
      name: card.name,
      bank: card.bank,
      totalLimit: card.totalLimit.amount,
      currencyCode: card.currencyCode,
      cutoffDay: card.cutoffDay,
      paymentDay: card.paymentDay,
      interestRate: card.interestRate,
      isActive: card.isActive,
    },
  })

  await cardRepo.delete(id)
  revalidatePath("/cards")
}
