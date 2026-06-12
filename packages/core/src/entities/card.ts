import { Money } from "../value-objects/money"

export type CardProps = {
  id: string
  userId: string
  name: string
  bank: string
  totalLimit: Money
  usedBalance: Money
  availableBalance: Money
  cutoffDay: number
  paymentDay: number
  interestRate: number
  currencyCode: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export class Card {
  private constructor(private props: CardProps) {}

  static create(props: Omit<CardProps, "createdAt" | "updatedAt" | "usedBalance" | "availableBalance">): Card {
    return new Card({
      ...props,
      usedBalance: Money.zero(props.currencyCode),
      availableBalance: props.totalLimit,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static restore(props: CardProps): Card {
    return new Card(props)
  }

  get id(): string { return this.props.id }
  get userId(): string { return this.props.userId }
  get name(): string { return this.props.name }
  get bank(): string { return this.props.bank }
  get totalLimit(): Money { return this.props.totalLimit }
  get usedBalance(): Money { return this.props.usedBalance }
  get availableBalance(): Money { return this.props.availableBalance }
  get cutoffDay(): number { return this.props.cutoffDay }
  get paymentDay(): number { return this.props.paymentDay }
  get interestRate(): number { return this.props.interestRate }
  get currencyCode(): string { return this.props.currencyCode }
  get isActive(): boolean { return this.props.isActive }
  get createdAt(): Date { return this.props.createdAt }
  get updatedAt(): Date { return this.props.updatedAt }

  recordTransaction(amount: Money): void {
    this.props.usedBalance = this.props.usedBalance.add(amount)
    this.props.availableBalance = this.props.totalLimit.subtract(this.props.usedBalance)
    this.props.updatedAt = new Date()
  }

  recordPayment(amount: Money): void {
    this.props.usedBalance = this.props.usedBalance.subtract(amount)
    this.props.availableBalance = this.props.totalLimit.subtract(this.props.usedBalance)
    this.props.updatedAt = new Date()
  }

  deactivate(): void {
    this.props.isActive = false
    this.props.updatedAt = new Date()
  }

  activate(): void {
    this.props.isActive = true
    this.props.updatedAt = new Date()
  }
}
