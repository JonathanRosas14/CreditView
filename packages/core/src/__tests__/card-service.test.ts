import { describe, it, expect, vi } from "vitest"
import { CardService } from "../services/card-service"
import type { CardRepository } from "../repositories/card-repository"
import type { TransactionRepository } from "../repositories/transaction-repository"

describe("CardService", () => {
  it("creates a card and saves it", async () => {
    const cardRepo: CardRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      delete: vi.fn(),
    }
    const txRepo: TransactionRepository = {
      save: vi.fn(),
      findByCardId: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    }

    const service = new CardService(cardRepo, txRepo)

    const card = await service.createCard({
      userId: "user-1",
      name: "Platinum",
      bank: "Test Bank",
      totalLimit: 5000,
      cutoffDay: 15,
      paymentDay: 10,
      interestRate: 0.02,
      currencyCode: "USD",
    })

    expect(card.name).toBe("Platinum")
    expect(card.bank).toBe("Test Bank")
    expect(card.totalLimit.amount).toBe(5000)
    expect(card.usedBalance.amount).toBe(0)
    expect(cardRepo.save).toHaveBeenCalledWith(card)
  })

  it("returns user cards", async () => {
    const cardRepo: CardRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn().mockResolvedValue([]),
      delete: vi.fn(),
    }
    const txRepo: TransactionRepository = {
      save: vi.fn(),
      findByCardId: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn(),
    }

    const service = new CardService(cardRepo, txRepo)
    const cards = await service.getUserCards("user-1")
    expect(cards).toEqual([])
    expect(cardRepo.findByUserId).toHaveBeenCalledWith("user-1")
  })
})
