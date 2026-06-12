import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
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

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: currency,
    })
  }

  // Seed test user
  const passwordHash = await bcrypt.hash("password123", 10)

  const user = await prisma.user.upsert({
    where: { email: "demo@creditview.app" },
    update: {},
    create: {
      email: "demo@creditview.app",
      name: "Demo User",
      password: passwordHash,
    },
  })

  console.log(`Seeded ${currencies.length} currencies`)
  console.log(`Seeded user: ${user.email} / password123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
