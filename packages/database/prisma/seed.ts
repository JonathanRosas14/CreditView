import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clean existing data (respect FK order)
  await prisma.installment.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.alert.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.card.deleteMany()
  await prisma.currency.deleteMany()
  await prisma.user.deleteMany()

  // Seed currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "COP", name: "Colombian Peso", symbol: "$" },
    { code: "MXN", name: "Mexican Peso", symbol: "$" },
    { code: "ARS", name: "Argentine Peso", symbol: "$" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$" },
    { code: "CLP", name: "Chilean Peso", symbol: "$" },
    { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  ]

  for (const c of currencies) {
    await prisma.currency.create({ data: c })
  }

  // Seed user
  const passwordHash = await bcrypt.hash("password123", 10)
  const user = await prisma.user.create({
    data: {
      email: "demo@creditview.app",
      name: "Demo User",
      password: passwordHash,
    },
  })

  // Seed cards
  const visa = await prisma.card.create({
    data: {
      userId: user.id,
      name: "Visa Platinum",
      bank: "Chase",
      totalLimit: 5000,
      usedBalance: 0,
      availableBalance: 5000,
      cutoffDay: 15,
      paymentDay: 5,
      interestRate: 29.99,
      currencyCode: "USD",
      isActive: true,
    },
  })

  const amex = await prisma.card.create({
    data: {
      userId: user.id,
      name: "Amex Gold",
      bank: "American Express",
      totalLimit: 8000,
      usedBalance: 0,
      availableBalance: 8000,
      cutoffDay: 20,
      paymentDay: 10,
      interestRate: 32.5,
      currencyCode: "USD",
      isActive: true,
    },
  })

  const mastercard = await prisma.card.create({
    data: {
      userId: user.id,
      name: "Mastercard Black",
      bank: "Bancolombia",
      totalLimit: 10000000,
      usedBalance: 0,
      availableBalance: 10000000,
      cutoffDay: 10,
      paymentDay: 28,
      interestRate: 36.0,
      currencyCode: "COP",
      isActive: true,
    },
  })

  // Seed budgets
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const foodBudget = await prisma.budget.create({
    data: {
      userId: user.id,
      category: "Food",
      amount: 500,
      period: "MONTHLY",
      startDate: startOfMonth,
      spent: 0,
    },
  })

  const shoppingBudget = await prisma.budget.create({
    data: {
      userId: user.id,
      category: "Shopping",
      amount: 2000,
      period: "MONTHLY",
      startDate: startOfMonth,
      spent: 0,
    },
  })

  const entertainmentBudget = await prisma.budget.create({
    data: {
      userId: user.id,
      category: "Entertainment",
      amount: 200,
      period: "MONTHLY",
      startDate: startOfMonth,
      spent: 0,
    },
  })

  const transportBudget = await prisma.budget.create({
    data: {
      userId: user.id,
      category: "Transport",
      amount: 300,
      period: "MONTHLY",
      startDate: startOfMonth,
      spent: 0,
    },
  })

  const electronicsBudget = await prisma.budget.create({
    data: {
      userId: user.id,
      category: "Electronics",
      amount: 3000,
      period: "MONTHLY",
      startDate: startOfMonth,
      spent: 0,
    },
  })

  // Helper: create transaction and update card balance
  async function addTx(
    cardId: string,
    type: "PURCHASE" | "PAYMENT" | "ADVANCE",
    amount: number,
    description: string,
    date: Date,
    opts?: { installments?: number; budgetId?: string },
  ) {
    const card = await prisma.card.findUniqueOrThrow({ where: { id: cardId } })

    // Sign: purchases add to used, payments subtract
    const balanceChange = type === "PAYMENT" ? -amount : amount
    const newUsed = Number(card.usedBalance) + balanceChange
    const newAvailable = Number(card.totalLimit) - newUsed

    const tx = await prisma.transaction.create({
      data: {
        cardId,
        type,
        amount,
        description,
        date,
        currency: card.currencyCode,
        isInstallment: !!opts?.installments && opts.installments > 1,
        budgetId: opts?.budgetId ?? null,
      },
    })

    if (opts?.installments && opts.installments > 1) {
      await prisma.installment.create({
        data: {
          transactionId: tx.id,
          totalInstallments: opts.installments,
          paidInstallments: 0,
          installmentAmount: Math.round((amount / opts.installments) * 100) / 100,
          nextDueDate: new Date(date.getFullYear(), date.getMonth() + 1, card.paymentDay),
        },
      })
    }

    await prisma.card.update({
      where: { id: cardId },
      data: {
        usedBalance: newUsed,
        availableBalance: newAvailable,
      },
    })
  }

  // Seed transactions for Visa (with budget links)
  await addTx(visa.id, "PURCHASE", 125.50, "Amazon.com", new Date(now.getFullYear(), now.getMonth(), 3), { budgetId: shoppingBudget.id })
  await addTx(visa.id, "PURCHASE", 45.00, "Netflix Subscription", new Date(now.getFullYear(), now.getMonth(), 5), { budgetId: entertainmentBudget.id })
  await addTx(visa.id, "PURCHASE", 89.99, "Uber Rides", new Date(now.getFullYear(), now.getMonth(), 8), { budgetId: transportBudget.id })
  await addTx(visa.id, "PURCHASE", 1200.00, "MacBook Pro 14", new Date(now.getFullYear(), now.getMonth() - 1, 15), { installments: 12, budgetId: electronicsBudget.id })
  await addTx(visa.id, "PAYMENT", 500.00, "Payment - Thank you", new Date(now.getFullYear(), now.getMonth(), 2))

  // Seed transactions for Amex (with budget links)
  await addTx(amex.id, "PURCHASE", 234.80, "Whole Foods Market", new Date(now.getFullYear(), now.getMonth(), 1), { budgetId: foodBudget.id })
  await addTx(amex.id, "PURCHASE", 560.00, "Delta Airlines", new Date(now.getFullYear(), now.getMonth() - 1, 20), { budgetId: transportBudget.id })
  await addTx(amex.id, "PURCHASE", 75.00, "Spotify Premium", new Date(now.getFullYear(), now.getMonth(), 10), { budgetId: entertainmentBudget.id })
  await addTx(amex.id, "PAYMENT", 600.00, "Online Payment", new Date(now.getFullYear(), now.getMonth(), 8))

  // Seed transactions for Mastercard (with budget links)
  await addTx(mastercard.id, "PURCHASE", 250000, "Éxito Supermarket", new Date(now.getFullYear(), now.getMonth(), 2), { budgetId: foodBudget.id })
  await addTx(mastercard.id, "PURCHASE", 120000, "Rappi Food", new Date(now.getFullYear(), now.getMonth(), 5), { budgetId: foodBudget.id })
  await addTx(mastercard.id, "PURCHASE", 1500000, "iPhone 16", new Date(now.getFullYear(), now.getMonth() - 1, 25), { installments: 24, budgetId: electronicsBudget.id })
  await addTx(mastercard.id, "PURCHASE", 85000, "Netflix + Prime Video", new Date(now.getFullYear(), now.getMonth(), 7), { budgetId: entertainmentBudget.id })
  await addTx(mastercard.id, "PAYMENT", 500000, "Pago en línea", new Date(now.getFullYear(), now.getMonth(), 1))

  // Recalculate budget spent from linked transactions
  const allBudgets = [foodBudget, shoppingBudget, entertainmentBudget, transportBudget, electronicsBudget]
  for (const budget of allBudgets) {
    const txs = await prisma.transaction.findMany({ where: { budgetId: budget.id } })
    const spent = txs.reduce((sum, tx) => {
      const delta = tx.type === "PAYMENT" ? -Number(tx.amount) : Number(tx.amount)
      return sum + delta
    }, 0)
    await prisma.budget.update({
      where: { id: budget.id },
      data: { spent: Math.max(0, spent) },
    })
  }

  console.log(`Seeded ${currencies.length} currencies`)
  console.log(`Seeded user: ${user.email} / password123`)
  console.log(`Seeded 3 cards with ${await prisma.transaction.count()} transactions`)
  console.log(`Seeded ${allBudgets.length} budgets`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
