import { describe, it, expect } from "vitest"
import {
  loginSchema,
  registerSchema,
  createCardSchema,
  createTransactionSchema,
} from "../../lib/validation"

describe("loginSchema", () => {
  it("accepts valid input", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "123456" })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "123456" })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = loginSchema.safeParse({ email: "test@test.com", password: "12345" })
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@test.com",
      password: "123456",
      confirmPassword: "123456",
    })
    expect(result.success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@test.com",
      password: "123456",
      confirmPassword: "654321",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("confirmPassword")
    }
  })

  it("rejects missing name", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "john@test.com",
      password: "123456",
      confirmPassword: "123456",
    })
    expect(result.success).toBe(false)
  })
})

describe("createCardSchema", () => {
  it("accepts valid card data", () => {
    const result = createCardSchema.safeParse({
      name: "Platinum",
      bank: "Test Bank",
      totalLimit: "10000",
      cutoffDay: "15",
      paymentDay: "10",
      interestRate: "0.02",
      currencyCode: "USD",
    })
    expect(result.success).toBe(true)
  })

  it("rejects negative limit", () => {
    const result = createCardSchema.safeParse({
      name: "Platinum",
      bank: "Test Bank",
      totalLimit: "-100",
      cutoffDay: "15",
      paymentDay: "10",
      interestRate: "0.02",
      currencyCode: "USD",
    })
    expect(result.success).toBe(false)
  })
})

describe("createTransactionSchema", () => {
  it("accepts valid purchase", () => {
    const result = createTransactionSchema.safeParse({
      cardId: "card-1",
      type: "PURCHASE",
      amount: "100",
      description: "Groceries",
      date: "2026-06-12",
      installments: "0",
    })
    expect(result.success).toBe(true)
  })

  it("accepts valid payment", () => {
    const result = createTransactionSchema.safeParse({
      cardId: "card-1",
      type: "PAYMENT",
      amount: "500",
      description: "Payment",
      date: "2026-06-12",
      installments: "0",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid type", () => {
    const result = createTransactionSchema.safeParse({
      cardId: "card-1",
      type: "INVALID",
      amount: "100",
      description: "Test",
      date: "2026-06-12",
      installments: "0",
    })
    expect(result.success).toBe(false)
  })
})
