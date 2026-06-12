"use server"

import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { verifySession } from "@/lib/dal"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()

export async function getCards() {
  const user = await verifySession()
  return cardRepo.findByUserId(user.id)
}

export async function getCard(id: string) {
  const user = await verifySession()
  const card = await cardRepo.findById(id)
  if (!card || card.userId !== user.id) return null
  return card
}

export async function getCardTransactions(cardId: string) {
  const user = await verifySession()
  const card = await cardRepo.findById(cardId)
  if (!card || card.userId !== user.id) return []
  return txRepo.findByCardId(cardId)
}
