import type { Metadata } from "next"
import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { CardService } from "@creditview/core"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAlerts } from "@/actions/alerts"
import { getRecentTransactions, type RecentTransaction } from "@/actions/queries"
import { prisma } from "@creditview/database"
import { AlertBanner } from "@/components/alert-banner"
import { Breadcrumb } from "@/components/breadcrumb"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()
const cardService = new CardService(cardRepo, txRepo)

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

function formatCurrency(amount: number) {
  return "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const metadata: Metadata = { title: "Dashboard" }

type TxRow = { amount: number; description: string }
type SpendingCat = { label: string; amount: number; fillPercent: number }

function computeSpending(txRows: TxRow[]): SpendingCat[] {
  const catMap: Record<string, (desc: string) => string> = {
    ELECTRONICS: (d) => d.includes("amazon") || d.includes("apple") || d.includes("macbook") || d.includes("iphone") || d.includes("electronics") ? "ELECTRONICS" : "",
    ESSENTIALS: (d) => d.includes("whole foods") || d.includes("éxito") || d.includes("supermarket") || d.includes("market") || d.includes("groceries") ? "ESSENTIALS" : "",
    ENTERTAINMENT: (d) => d.includes("netflix") || d.includes("spotify") || d.includes("subscription") ? "ENTERTAINMENT" : "",
    "TRAVEL & LEISURE": (d) => d.includes("uber") || d.includes("rappi") || d.includes("ride") || d.includes("transport") || d.includes("delta") || d.includes("lufthansa") || d.includes("airline") || d.includes("travel") ? "TRAVEL & LEISURE" : "",
    "DINING & DRINK": (d) => d.includes("dining") || d.includes("restaurant") || d.includes("coucou") ? "DINING & DRINK" : "",
  }
  const catTotals: Record<string, number> = {}
  for (const t of txRows) {
    let assigned = "OTHER"
    for (const [, fn] of Object.entries(catMap)) {
      const c = fn(t.description.toLowerCase())
      if (c) { assigned = c; break }
    }
    catTotals[assigned] = (catTotals[assigned] || 0) + t.amount
  }
  const grandTotal = Object.values(catTotals).reduce((s, v) => s + v, 0) || 1
  const order = ["TRAVEL & LEISURE", "DINING & DRINK", "ELECTRONICS", "ESSENTIALS", "ENTERTAINMENT", "OTHER"]
  return order
    .filter((cat) => catTotals[cat])
    .map((cat) => ({ label: cat, amount: catTotals[cat], fillPercent: Math.round((catTotals[cat] / grandTotal) * 100) }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4)
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const [cards, alerts] = await Promise.all([
    cardService.getUserCards(session.user.id),
    getAlerts(),
  ])

  const cardIds = cards.map((c) => c.id)

  const [recentTx, spendingTxRows] = await Promise.all([
    cardIds.length > 0 ? getRecentTransactions(8, cardIds) : Promise.resolve([] as RecentTransaction[]),
    cardIds.length > 0
      ? (await prisma.transaction.findMany({
          where: { cardId: { in: cardIds }, type: { not: "PAYMENT" } },
          select: { amount: true, description: true },
        })).map((r) => ({ amount: Number(r.amount), description: r.description }))
      : ([] as TxRow[]),
  ])

  const totalLimit = cards.reduce((sum, c) => sum + c.totalLimit.amount, 0)
  const totalUsed = cards.reduce((sum, c) => sum + c.usedBalance.amount, 0)

  const spendingCategories = computeSpending(spendingTxRows)

  return (
    <div className="space-y-12">
      <section>
        <Breadcrumb pages="Dashboard" />
        <h1
          className="text-[32px]"
          style={{
            fontFamily: "var(--font-literata)",
            fontWeight: 400,
            color: "#002434",
            lineHeight: "51.2px",
          }}
        >
          Dashboard
        </h1>
        <p
          className="mt-2 max-w-[576px] text-base"
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "#42474B",
            lineHeight: "25.6px",
          }}
        >
          Track your credit card portfolio, monitor spending patterns, and stay on top
          of your financial health.
        </p>
      </section>

      <AlertBanner alerts={alerts} />

      <section className="grid grid-cols-3 gap-6">
        {([
          { label: "TOTAL LIMIT", value: totalLimit },
          { label: "TOTAL USED", value: totalUsed },
          { label: "AVAILABLE BALANCE", value: totalLimit - totalUsed },
        ] as const).map((item) => (
          <div
            key={item.label}
            className="rounded-xl border bg-white px-[33px]"
            style={{
              borderColor: "#C2C7CC",
              borderRadius: "12px",
              paddingTop: "32px",
              paddingBottom: "33px",
            }}
          >
            <p
              className="text-[11px] uppercase"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#42474B",
                lineHeight: "17.6px",
                letterSpacing: "1.1px",
              }}
            >
              {item.label}
            </p>
            <p
              className="mt-4 text-[28px]"
              style={{
                fontFamily: "var(--font-literata)",
                color: "#002434",
                lineHeight: "44.8px",
                fontWeight: 400,
              }}
            >
              {item.label === "AVAILABLE BALANCE" ? (
                <span style={{ color: "#059669" }}>{formatCurrency(item.value)}</span>
              ) : (
                formatCurrency(item.value)
              )}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-12">
        <section className="col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-[20px]"
              style={{
                fontFamily: "var(--font-literata)",
                color: "#002434",
                lineHeight: "32px",
                fontWeight: 400,
              }}
            >
              Recent Transactions
            </h2>
            <a
              href="/transactions"
              className="text-[11px] uppercase no-underline"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
                letterSpacing: "1.1px",
                lineHeight: "17.6px",
              }}
            >
              VIEW ALL
            </a>
          </div>

          <div className="w-full">
            <div
              className="grid grid-cols-4 px-2 pb-4"
              style={{ borderBottom: "1px solid #C2C7CC" }}
            >
              {["DATE", "MERCHANT", "CARD", "AMOUNT"].map((header) => (
                <div
                  key={header}
                  className="text-xs font-bold uppercase"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: "#72787C",
                    letterSpacing: "1.8px",
                    lineHeight: "12px",
                    fontWeight: 700,
                    textAlign: header === "AMOUNT" ? "right" : "left",
                  }}
                >
                  {header}
                </div>
              ))}
            </div>

            {recentTx.length === 0 ? (
              <p className="py-8 text-center text-base" style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}>
                No recent transactions
              </p>
            ) : (
              recentTx.map((tx) => {
                const isNegative = tx.type !== "PAYMENT"
                return (
                  <div
                    key={tx.id}
                    className="grid grid-cols-4 px-2 py-6"
                    style={{
                      borderTop: "1px solid rgba(194, 199, 204, 0.3)",
                    }}
                  >
                    <div
                      className="text-base"
                      style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", lineHeight: "25.6px" }}
                    >
                      {formatDate(new Date(tx.date))}
                    </div>
                    <div
                      className="text-base"
                      style={{ fontFamily: "var(--font-dm-sans)", color: "#002434", lineHeight: "25.6px" }}
                    >
                      {tx.description}
                    </div>
                    <div
                      className="text-[10px] uppercase"
                      style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", lineHeight: "16px", letterSpacing: "1px" }}
                    >
                      {tx.cardName}
                    </div>
                    <div
                      className="text-base text-right"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        lineHeight: "25.6px",
                        color: isNegative ? "#DC2626" : "#059669",
                      }}
                    >
                      {isNegative ? `-${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>

        <section className="col-span-4">
          <h2
            className="mb-8 text-[20px]"
            style={{
              fontFamily: "var(--font-literata)",
              color: "#002434",
              lineHeight: "32px",
              fontWeight: 400,
            }}
          >
            Spending Breakdown
          </h2>

          <div className="space-y-10">
            {spendingCategories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="text-[11px] uppercase"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#002434",
                      lineHeight: "17.6px",
                      letterSpacing: "1.1px",
                    }}
                  >
                    {cat.label}
                  </span>
                  <span
                    className="text-base"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#002434",
                      lineHeight: "25.6px",
                    }}
                  >
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div
                  className="h-1 w-full overflow-hidden"
                  style={{
                    backgroundColor: "#E5E5E1",
                    borderRadius: "9999px",
                  }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: `${cat.fillPercent}%`,
                      backgroundColor: "#002434",
                      borderRadius: "9999px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
