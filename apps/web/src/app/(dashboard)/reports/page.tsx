import type { Metadata } from "next"
import { getCards } from "@/actions/queries"
import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = { title: "Reports" }

function deriveCategory(description: string): string {
  const desc = description.toLowerCase()
  if (desc.includes("amazon") || desc.includes("apple") || desc.includes("macbook") || desc.includes("iphone") || desc.includes("electronics")) return "Electronics"
  if (desc.includes("whole foods") || desc.includes("éxito") || desc.includes("supermarket") || desc.includes("market") || desc.includes("groceries")) return "Groceries"
  if (desc.includes("netflix") || desc.includes("spotify") || desc.includes("subscription")) return "Subscription"
  if (desc.includes("uber") || desc.includes("rappi") || desc.includes("ride") || desc.includes("transport") || desc.includes("travel")) return "Travel"
  if (desc.includes("delta") || desc.includes("lufthansa") || desc.includes("airline")) return "Travel"
  if (desc.includes("dining") || desc.includes("restaurant") || desc.includes("coucou")) return "Dining & Drinks"
  if (desc.includes("health") || desc.includes("wellness") || desc.includes("gym") || desc.includes("pharmacy") || desc.includes("medical")) return "Health & Wellness"
  if (desc.includes("shopping") || desc.includes("mall") || desc.includes("store") || desc.includes("retail") || desc.includes("amazon")) return "Shopping"
  if (desc.includes("payment") || desc.includes("pago") || desc.includes("deposit")) return "Income"
  return "Other"
}

function formatCompact(amount: number): string {
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`
  return `${Math.round(amount).toLocaleString("en-US")}`
}

function formatFull(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

export default async function ReportsPage() {
  await verifySession()
  const cards = await getCards()

  const cardIds = cards.map((c) => c.id)

  const allTransactions = cardIds.length > 0
    ? await prisma.transaction.findMany({
        where: { cardId: { in: cardIds } },
        orderBy: { date: "desc" },
      })
    : []

  const transactions = allTransactions.filter((t) => t.type !== "PAYMENT")
  const amounts = transactions.map((t) => ({ ...t, amount: Number(t.amount) }))

  const byCurrency = cards.reduce<Record<string, typeof cards>>((acc, card) => {
    const curr = card.currencyCode
    if (!acc[curr]) acc[curr] = []
    acc[curr].push(card)
    return acc
  }, {})

  const now = new Date()
  const monthlyData: { month: number; year: number; total: number }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth()
    const year = d.getFullYear()
    const total = amounts
      .filter((t) => {
        const td = new Date(t.date)
        return td.getMonth() === month && td.getFullYear() === year
      })
      .reduce((s, t) => s + t.amount, 0)
    monthlyData.push({ month, year, total })
  }

  const maxMonthly = Math.max(...monthlyData.map((d) => d.total), 1)

  const categoryTotals: Record<string, number> = {}
  for (const t of amounts) {
    const cat = deriveCategory(t.description)
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount
  }

  const grandTotal = Object.values(categoryTotals).reduce((s, v) => s + v, 0)
  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([name, total]) => ({
      name,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      count: amounts.filter((t) => deriveCategory(t.description) === name).length,
    }))
    .sort((a, b) => b.total - a.total)

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Breadcrumb pages="Reports" />
        <h1
          style={{
            fontFamily: "var(--font-literata)",
            fontWeight: 400,
            fontSize: 32,
            lineHeight: "48px",
            color: "#002434",
          }}
        >
          Reports
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 16,
            lineHeight: "24px",
            color: "#72787C",
            marginTop: 4,
          }}
        >
          Financial summaries and analytics
        </p>
      </div>

      {/* Section 1: Portfolio Overview */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2
            style={{
              fontFamily: "var(--font-literata)",
              fontWeight: 400,
              fontSize: 20,
              lineHeight: "28px",
              color: "#002434",
            }}
          >
            Portfolio Overview
          </h2>
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: "12px",
              letterSpacing: "1.8px",
              color: "#42474B",
              backgroundColor: "#EAE7E7",
              padding: "4px 14px",
              borderRadius: 9999,
              textTransform: "uppercase",
            }}
          >
            Live Data
          </span>
        </div>

        {cards.length === 0 ? (
          <p style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C", fontSize: 14 }}>
            No cards to report on.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(byCurrency).map(([currency, group]) => {
              const totalLimit = group.reduce((s, c) => s + c.totalLimit.amount, 0)
              const totalUsed = group.reduce((s, c) => s + c.usedBalance.amount, 0)
              const utilization = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0
              const symbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$"

              return (
                <div
                  key={currency}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: 12,
                    border: "1px solid #E5E5E1",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    padding: 0,
                  }}
                >
                  <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 700,
                          fontSize: 12,
                          lineHeight: "12px",
                          letterSpacing: "1.8px",
                          color: "#72787C",
                          textTransform: "uppercase",
                        }}
                      >
                        {currency} Account
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-literata)",
                          fontWeight: 400,
                          fontSize: 30,
                          lineHeight: "36px",
                          color: "#002434",
                          marginTop: 8,
                        }}
                      >
                        {symbol}{currencyFormatter.format(totalLimit - totalUsed)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 700,
                          fontSize: 12,
                          lineHeight: "12px",
                          letterSpacing: "1.8px",
                          color: "#72787C",
                          textTransform: "uppercase",
                        }}
                      >
                        Total Limit
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-literata)",
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: "28px",
                          color: "#002434",
                          marginTop: 8,
                        }}
                      >
                        {symbol}{formatCompact(totalLimit)}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 700,
                          fontSize: 12,
                          lineHeight: "12px",
                          letterSpacing: "1.8px",
                          color: "#72787C",
                          textTransform: "uppercase",
                        }}
                      >
                        Total Used
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-literata)",
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: "28px",
                          color: "#002434",
                          marginTop: 8,
                        }}
                      >
                        {symbol}{formatCompact(totalUsed)}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 700,
                          fontSize: 12,
                          lineHeight: "12px",
                          letterSpacing: "1.8px",
                          color: "#72787C",
                          textTransform: "uppercase",
                        }}
                      >
                        Utilization
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-literata)",
                          fontWeight: 400,
                          fontSize: 18,
                          lineHeight: "28px",
                          color: "#002434",
                          marginTop: 8,
                        }}
                      >
                        {utilization.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: "0 24px 24px" }}>
                    <div
                      style={{
                        backgroundColor: "#E5E2E1",
                        borderRadius: 9999,
                        height: 4,
                        width: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: "#002434",
                          borderRadius: 9999,
                          height: "100%",
                          width: `${Math.min(utilization, 100)}%`,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Section 2: Monthly Spending Trend */}
      {transactions.length > 0 && (
        <section>
          <div className="mb-6">
            <h2
              style={{
                fontFamily: "var(--font-literata)",
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "28px",
                color: "#002434",
              }}
            >
              Monthly Spending Trend
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #C2C7CC",
              padding: "32px 24px",
            }}
          >
            <div className="flex items-end justify-between" style={{ minHeight: 200 }}>
              {monthlyData.map((d) => {
                const pct = maxMonthly > 0 ? (d.total / maxMonthly) * 100 : 0
                return (
                  <div key={`${d.year}-${d.month}`} className="flex flex-col items-center" style={{ flex: 1 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 400,
                        fontSize: 10,
                        lineHeight: "15px",
                        color: "#72787C",
                        marginBottom: 8,
                      }}
                    >
                      {formatCompact(d.total)}
                    </span>
                    <div
                      style={{
                        width: 32,
                        height: `${Math.max(pct * 0.7, 4)}px`,
                        backgroundColor: "#002434",
                        borderRadius: 4,
                        minHeight: 4,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 400,
                        fontSize: 16,
                        lineHeight: "24px",
                        color: "#72787C",
                        marginTop: 12,
                      }}
                    >
                      {MONTHS[d.month]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Section 3: Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <section>
          <div className="mb-6">
            <h2
              style={{
                fontFamily: "var(--font-literata)",
                fontWeight: 400,
                fontSize: 20,
                lineHeight: "28px",
                color: "#002434",
              }}
            >
              Category Breakdown
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              border: "1px solid #C2C7CC",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 140px 120px",
                gap: 0,
                padding: "16px 24px",
                backgroundColor: "#F6F3F2",
              }}
            >
              {["CATEGORY", "AMOUNT", "PERCENTAGE", "TRANSACTIONS"].map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 700,
                    fontSize: 12,
                    lineHeight: "12px",
                    letterSpacing: "1.8px",
                    color: "#72787C",
                    textTransform: "uppercase",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {categoryBreakdown.map((cat, i) => (
              <div
                key={cat.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 140px 120px",
                  gap: 0,
                  padding: "16px 24px",
                  borderTop: i > 0 ? "1px solid #C2C7CC" : "none",
                }}
                className="items-center"
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#002434",
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-literata)",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#002434",
                  }}
                >
                  {formatFull(cat.total)}
                </span>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: "#E5E2E1",
                      borderRadius: 9999,
                      height: 6,
                      width: 100,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#002434",
                        borderRadius: 9999,
                        height: "100%",
                        width: `${Math.min(cat.percentage, 100)}%`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 400,
                      fontSize: 11,
                      lineHeight: "16.5px",
                      color: "#72787C",
                    }}
                  >
                    {cat.percentage.toFixed(0)}%
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: "24px",
                    color: "#72787C",
                  }}
                >
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Action */}
      <div className="flex items-center justify-between">
        <button
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 700,
            fontSize: 12,
            lineHeight: "12px",
            letterSpacing: "1.2px",
            color: "#002434",
            backgroundColor: "transparent",
            border: "1px solid #C2C7CC",
            borderRadius: 12,
            padding: "16px 32px",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Download Report
        </button>
        <span
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 13,
            lineHeight: "18.2px",
            color: "#72787C",
          }}
        >
          Last generated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} &bull; PDF, 2.4 MB
        </span>
      </div>
    </div>
  )
}
