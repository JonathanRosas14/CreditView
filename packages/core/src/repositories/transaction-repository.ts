import { Transaction } from "../entities/transaction"

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>
  findByCardId(cardId: string): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>
  delete(id: string): Promise<void>
}
