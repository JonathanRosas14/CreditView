"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { auth } from "@/lib/auth"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

export async function getCards() {
  const session = await auth()
  if (!session?.user?.id) return []
  return cardRepo.findByUserId(session.user.id)
}

export async function getCard(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null
  return cardRepo.findById(id)
}

export async function getCardTransactions(cardId: string) {
  const session = await auth()
  if (!session?.user?.id) return []
  return txRepo.findByCardId(cardId)
}
