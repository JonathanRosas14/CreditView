import { Card } from "@creditview/core"
import type { CardRepository } from "@creditview/core"
import { prisma } from "@creditview/database"
import { Money } from "@creditview/core"

export class PrismaCardRepository implements CardRepository {
  async findById(id: string): Promise<Card | null> {
    const record = await prisma.card.findUnique({ where: { id } })
    if (!record) return null
    return this.toDomain(record)
  }

  async findByUserId(userId: string): Promise<Card[]> {
    const records = await prisma.card.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    })
    return records.map(this.toDomain)
  }

  async save(card: Card): Promise<void> {
    await prisma.card.upsert({
      where: { id: card.id },
      update: {
        name: card.name,
        bank: card.bank,
        totalLimit: card.totalLimit.amount,
        usedBalance: card.usedBalance.amount,
        availableBalance: card.availableBalance.amount,
        cutoffDay: card.cutoffDay,
        paymentDay: card.paymentDay,
        interestRate: card.interestRate,
        isActive: card.isActive,
        updatedAt: card.updatedAt,
      },
      create: {
        id: card.id,
        userId: card.userId,
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
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.card.delete({ where: { id } })
  }

  private toDomain(record: {
    id: string
    userId: string
    name: string
    bank: string
    totalLimit: { toNumber?: () => number } | number
    usedBalance: { toNumber?: () => number } | number
    availableBalance: { toNumber?: () => number } | number
    cutoffDay: number
    paymentDay: number
    interestRate: { toNumber?: () => number } | number
    currencyCode: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }): Card {
    const toNum = (v: { toNumber?: () => number } | number): number =>
      typeof v === "number" ? v : v.toNumber?.() ?? Number(v)

    return Card.restore({
      id: record.id,
      userId: record.userId,
      name: record.name,
      bank: record.bank,
      totalLimit: new Money(toNum(record.totalLimit), record.currencyCode),
      usedBalance: new Money(toNum(record.usedBalance), record.currencyCode),
      availableBalance: new Money(toNum(record.availableBalance), record.currencyCode),
      cutoffDay: record.cutoffDay,
      paymentDay: record.paymentDay,
      interestRate: toNum(record.interestRate),
      currencyCode: record.currencyCode,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }
}
