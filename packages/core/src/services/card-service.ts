import { randomUUID } from "node:crypto"
import { Card } from "../entities/card"
import { Money } from "../value-objects/money"
import type { CardRepository } from "../repositories/card-repository"
import type { TransactionRepository } from "../repositories/transaction-repository"

export class CardService {
  constructor(
    private cardRepo: CardRepository,
    private transactionRepo: TransactionRepository,
  ) {}

  async createCard(params: {
    userId: string
    name: string
    bank: string
    totalLimit: number
    cutoffDay: number
    paymentDay: number
    interestRate: number
    currencyCode: string
  }): Promise<Card> {
    const card = Card.create({
      id: randomUUID(),
      userId: params.userId,
      name: params.name,
      bank: params.bank,
      totalLimit: new Money(params.totalLimit, params.currencyCode),
      cutoffDay: params.cutoffDay,
      paymentDay: params.paymentDay,
      interestRate: params.interestRate,
      currencyCode: params.currencyCode,
      isActive: true,
    })

    await this.cardRepo.save(card)
    return card
  }

  async getUserCards(userId: string): Promise<Card[]> {
    return this.cardRepo.findByUserId(userId)
  }
}
