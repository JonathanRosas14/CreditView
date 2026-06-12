import { describe, it, expect } from "vitest"
import { Card } from "../entities/card"
import { Money } from "../value-objects/money"

function makeCard(overrides = {}) {
  return Card.create({
    id: "card-1",
    userId: "user-1",
    name: "Test Card",
    bank: "Test Bank",
    totalLimit: new Money(10000, "USD"),
    cutoffDay: 15,
    paymentDay: 10,
    interestRate: 0.02,
    currencyCode: "USD",
    isActive: true,
    ...overrides,
  })
}

describe("Card", () => {
  it("creates with zero balance", () => {
    const card = makeCard()
    expect(card.name).toBe("Test Card")
    expect(card.bank).toBe("Test Bank")
    expect(card.usedBalance.amount).toBe(0)
    expect(card.availableBalance.amount).toBe(10000)
    expect(card.isActive).toBe(true)
  })

  it("records a transaction reducing available balance", () => {
    const card = makeCard()
    card.recordTransaction(new Money(2000, "USD"))
    expect(card.usedBalance.amount).toBe(2000)
    expect(card.availableBalance.amount).toBe(8000)
  })

  it("records a payment increasing available balance", () => {
    const card = makeCard()
    card.recordTransaction(new Money(5000, "USD"))
    card.recordPayment(new Money(2000, "USD"))
    expect(card.usedBalance.amount).toBe(3000)
    expect(card.availableBalance.amount).toBe(7000)
  })

  it("deactivates the card", () => {
    const card = makeCard()
    card.deactivate()
    expect(card.isActive).toBe(false)
  })

  it("activates the card", () => {
    const card = makeCard()
    card.deactivate()
    card.activate()
    expect(card.isActive).toBe(true)
  })
})
