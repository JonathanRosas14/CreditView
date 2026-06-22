import type { Metadata } from "next"
import { getBudgets } from "@/actions/budgets"
import Link from "next/link"
import { DeleteBudgetButton } from "./delete-budget-button"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = { title: "Budgets" }

function progressColor(used: number) {
  if (used <= 50) return "#16A34A"
  if (used <= 80) return "#FBBF24"
  return "#BA1A1A"
}

export default async function BudgetsPage() {
  const budgets = await getBudgets()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Breadcrumb pages="Budgets" />
          <h1
            style={{
              fontFamily: "var(--font-literata)",
              fontWeight: 400,
              fontSize: 32,
              lineHeight: "48px",
              color: "#002434",
            }}
          >
            Budgets
          </h1>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: "24px",
              color: "#42474B",
            }}
          >
            Manage and track your monthly allocations.
          </p>
        </div>
        <Link
          href="/budgets/new"
          className="self-start whitespace-nowrap sm:self-auto"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 700,
            fontSize: 12,
            lineHeight: "18px",
            letterSpacing: "1.2px",
            color: "#FFFFFF",
            backgroundColor: "#002434",
            padding: "16px 32px",
            borderRadius: 12,
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          Add Budget
        </Link>
      </div>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p
            style={{
              fontFamily: "var(--font-literata)",
              fontWeight: 400,
              fontSize: 20,
              color: "#002434",
            }}
          >
            No budgets yet
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              fontSize: 14,
              color: "#72787C",
              marginTop: 8,
            }}
          >
            Create your first budget to start tracking your spending.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => {
            const used = b.amount > 0 ? (b.spent / b.amount) * 100 : 0
            const clamped = Math.min(used, 100)
            const color = progressColor(used)

            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  border: "1px solid #C2C7CC",
                }}
                className="flex flex-col"
              >
                <div className="flex flex-col gap-3 px-6 pt-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-0.5">
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 500,
                          fontSize: 18,
                          lineHeight: "27px",
                          color: "#1C1B1B",
                        }}
                      >
                        {b.category}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          fontWeight: 400,
                          fontSize: 12,
                          lineHeight: "18px",
                          color: "#42474B",
                        }}
                      >
                        {b.card?.name ?? "All cards"}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 700,
                        fontSize: 10,
                        lineHeight: "15px",
                        letterSpacing: "1px",
                        color: "#42474B",
                        backgroundColor: "#F0EDED",
                        padding: "4px 12px",
                        borderRadius: 9999,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.period}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span
                      style={{
                        fontFamily: "var(--font-literata)",
                        fontWeight: 400,
                        fontSize: 24,
                        lineHeight: "32px",
                        color: "#002434",
                      }}
                    >
                      ${b.spent.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        fontWeight: 400,
                        fontSize: 14,
                        lineHeight: "20px",
                        color: "#42474B",
                      }}
                    >
                      / ${b.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <div
                    style={{
                      backgroundColor: "#F0EDED",
                      borderRadius: 9999,
                      height: 4,
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: color,
                        borderRadius: 9999,
                        height: "100%",
                        width: `${clamped}%`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 pb-6">
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      fontWeight: 700,
                      fontSize: 12,
                      lineHeight: "18px",
                      color,
                    }}
                  >
                    {used.toFixed(0)}% used
                  </span>
                  <DeleteBudgetButton budgetId={b.id} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
