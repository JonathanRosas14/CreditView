import { describe, it, expect } from "vitest"
import { Money } from "../value-objects/money"

describe("Money", () => {
  it("creates with amount and currency", () => {
    const m = new Money(100, "USD")
    expect(m.amount).toBe(100)
    expect(m.currency).toBe("USD")
  })

  it("adds two amounts in same currency", () => {
    const a = new Money(100, "USD")
    const b = new Money(50, "USD")
    const result = a.add(b)
    expect(result.amount).toBe(150)
    expect(result.currency).toBe("USD")
  })

  it("subtracts two amounts in same currency", () => {
    const a = new Money(100, "USD")
    const b = new Money(30, "USD")
    const result = a.subtract(b)
    expect(result.amount).toBe(70)
    expect(result.currency).toBe("USD")
  })

  it("throws on add with different currencies", () => {
    const a = new Money(100, "USD")
    const b = new Money(50, "EUR")
    expect(() => a.add(b)).toThrow("Currency mismatch")
  })

  it("throws on subtract with different currencies", () => {
    const a = new Money(100, "USD")
    const b = new Money(50, "EUR")
    expect(() => a.subtract(b)).toThrow("Currency mismatch")
  })

  it("creates zero money", () => {
    const m = Money.zero("USD")
    expect(m.amount).toBe(0)
    expect(m.currency).toBe("USD")
  })
})
