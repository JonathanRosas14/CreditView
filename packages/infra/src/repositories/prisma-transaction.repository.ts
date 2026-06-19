import { Transaction, Money } from "@creditview/core"
import type { TransactionRepository } from "@creditview/core"
import { prisma } from "@creditview/database"
import type { TransactionType } from "@creditview/core"

export class PrismaTransactionRepository implements TransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    const record = await prisma.transaction.findUnique({ where: { id } })
    if (!record) return null
    return this.toDomain(record)
  }

  async findByCardId(cardId: string): Promise<Transaction[]> {
    const records = await prisma.transaction.findMany({
      where: { cardId },
      orderBy: { date: "desc" },
    })
    return records.map(this.toDomain)
  }

  async save(transaction: Transaction): Promise<void> {
    await prisma.transaction.upsert({
      where: { id: transaction.id },
      update: {
        type: transaction.type as TransactionType,
        amount: transaction.amount.amount,
        description: transaction.description,
        date: transaction.date,
        currency: transaction.currency,
        isInstallment: transaction.isInstallment,
        budgetId: transaction.budgetId ?? null,
      },
      create: {
        id: transaction.id,
        cardId: transaction.cardId,
        type: transaction.type as TransactionType,
        amount: transaction.amount.amount,
        description: transaction.description,
        date: transaction.date,
        currency: transaction.currency,
        isInstallment: transaction.isInstallment,
        budgetId: transaction.budgetId ?? null,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.transaction.delete({ where: { id } })
  }

  private toDomain(record: {
    id: string
    cardId: string
    type: string
    amount: { toNumber?: () => number } | number
    description: string
    date: Date
    currency: string
    isInstallment: boolean
    budgetId: string | null
    createdAt: Date
  }): Transaction {
    const toNum = (v: { toNumber?: () => number } | number): number =>
      typeof v === "number" ? v : v.toNumber?.() ?? Number(v)

    return Transaction.restore({
      id: record.id,
      cardId: record.cardId,
      type: record.type as TransactionType,
      amount: new Money(toNum(record.amount), record.currency),
      description: record.description,
      date: record.date,
      currency: record.currency,
      isInstallment: record.isInstallment,
      budgetId: record.budgetId ?? undefined,
      createdAt: record.createdAt,
    })
  }
}
