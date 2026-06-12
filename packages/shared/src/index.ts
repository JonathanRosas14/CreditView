export type TransactionType = "PURCHASE" | "ADVANCE" | "PAYMENT"
export type AlertType = "CUTOFF" | "PAYMENT"
export type CurrencyCode = string

export interface CreateCardDTO {
  name: string
  bank: string
  totalLimit: number
  usedBalance: number
  cutoffDay: number
  paymentDay: number
  interestRate: number
  currencyCode: CurrencyCode
}

export interface CreateTransactionDTO {
  cardId: string
  type: TransactionType
  amount: number
  description: string
  date: Date
  isInstallment?: boolean
  totalInstallments?: number
}
