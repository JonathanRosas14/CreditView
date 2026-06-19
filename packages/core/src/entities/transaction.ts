import { randomUUID } from "node:crypto"
import { Money } from "../value-objects/money"

export type TransactionType = "PURCHASE" | "ADVANCE" | "PAYMENT"

export type TransactionProps = {
  id: string
  cardId: string
  type: TransactionType
  amount: Money
  description: string
  date: Date
  currency: string
  isInstallment: boolean
  budgetId?: string
  createdAt: Date
}

export class Transaction {
  private constructor(private props: TransactionProps) {}

  static create(props: Omit<TransactionProps, "id" | "createdAt">): Transaction {
    return new Transaction({
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
    })
  }

  static restore(props: TransactionProps): Transaction {
    return new Transaction(props)
  }

  get id(): string { return this.props.id }
  get cardId(): string { return this.props.cardId }
  get type(): TransactionType { return this.props.type }
  get amount(): Money { return this.props.amount }
  get description(): string { return this.props.description }
  get date(): Date { return this.props.date }
  get currency(): string { return this.props.currency }
  get isInstallment(): boolean { return this.props.isInstallment }
  get budgetId(): string | undefined { return this.props.budgetId }
  get createdAt(): Date { return this.props.createdAt }
}
