"use client"

import { useState } from "react"
import type { MonthlyStatement } from "@/actions/statements"

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function formatCurrency(amount: number) {
  const sign = amount < 0 ? "-" : ""
  return sign + "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function toCSV(statements: MonthlyStatement[]): string {
  const headers = ["Card", "Bank", "Currency", "Year", "Month", "Opening Balance", "Closing Balance", "Purchases", "Payments", "Transactions", "Limit"]
  const rows = statements.map((s) => [
    s.cardName,
    s.bank,
    s.currencyCode,
    s.year,
    String(s.month).padStart(2, "0"),
    s.openingBalance.toFixed(2),
    s.closingBalance.toFixed(2),
    s.totalPurchases.toFixed(2),
    s.totalPayments.toFixed(2),
    s.transactionCount,
    s.totalLimit.toFixed(2),
  ].map((v) => `"${v}"`).join(","))
  return [headers.join(","), ...rows].join("\n")
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function StatementsView({ statements }: { statements: MonthlyStatement[] }) {
  const [selectedCard, setSelectedCard] = useState("")

  const cardNames = [...new Set(statements.map((s) => s.cardName))].sort()

  const filtered = selectedCard
    ? statements.filter((s) => s.cardName === selectedCard)
    : statements

  const byMonth = filtered.reduce<Record<string, typeof filtered>>((acc, s) => {
    const key = `${s.year}-${String(s.month).padStart(2, "0")}`
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const sortedMonths = Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a))

  function getLastUpdated() {
    const now = new Date()
    return now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
      " • " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="hidden sm:invisible sm:block">
          <BreadcrumbPlaceholder />
        </div>
        <div className="sm:text-right">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative">
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="appearance-none self-start text-[10px] uppercase outline-none sm:self-auto"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: selectedCard ? "#002434" : "#002434",
                  lineHeight: "15px",
                  letterSpacing: "1px",
                  fontWeight: 400,
                  padding: "9px 36px 9px 20px",
                  borderRadius: "8px",
                  border: "1px solid #C2C7CC",
                  backgroundColor: "#FFFFFF",
                  cursor: "pointer",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='11' height='8' viewBox='0 0 11 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 5.5L10 1' stroke='%23002434' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                <option value="">FILTER BY CARD</option>
                {cardNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                const csv = toCSV(filtered)
                downloadCSV(csv, `creditview-statements-${new Date().toISOString().split("T")[0]}.csv`)
              }}
              className="inline-flex items-center justify-center gap-2 self-start whitespace-nowrap text-[10px] uppercase sm:self-auto"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#FFFFFF",
                lineHeight: "15px",
                letterSpacing: "1px",
                fontWeight: 400,
                padding: "9px 24px",
                borderRadius: "8px",
                backgroundColor: "#002434",
                cursor: "pointer",
                border: "none",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 5H9.5M5 0.5V9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              EXPORT ALL
            </button>
          </div>
          <p
            className="mt-2 text-right text-xs"
            style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C", lineHeight: "16px", fontWeight: 400 }}
          >
            Last updated: {getLastUpdated()}
          </p>
        </div>
      </div>

      {sortedMonths.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-lg" style={{ fontFamily: "var(--font-literata)", color: "#72787C" }}>
            No statements available yet
          </p>
          <p className="mt-2 text-sm" style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}>
            {selectedCard ? "Try selecting a different card." : "Statements will appear once you have card activity."}
          </p>
        </div>
      ) : (
        sortedMonths.map(([key, group]) => {
          const [yearStr, monthStr] = key.split("-")
          const year = parseInt(yearStr)
          const month = parseInt(monthStr)
          const grandPurchases = group.reduce((s, st) => s + st.totalPurchases, 0)
          const grandPayments = group.reduce((s, st) => s + st.totalPayments, 0)

          return (
            <section key={key} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2
                  style={{
                    fontFamily: "var(--font-literata)",
                    fontWeight: 400,
                    fontSize: 20,
                    lineHeight: "28px",
                    color: "#002434",
                  }}
                >
                  {monthNames[month - 1]} {year}
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#D4D3D1",
                  }}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {group.map((st) => {
                  const util = st.totalLimit > 0 ? (st.closingBalance / st.totalLimit) * 100 : 0

                  return (
                    <div
                      key={`${st.cardId}-${key}`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 12,
                        border: "1px solid #C2C7CC",
                        padding: "20px 24px",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 700,
                              fontSize: 12,
                              lineHeight: "15px",
                              letterSpacing: "1.8px",
                              color: "#72787C",
                              textTransform: "uppercase",
                            }}
                          >
                            {st.bank}
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-literata)",
                              fontWeight: 400,
                              fontSize: 22,
                              lineHeight: "28px",
                              color: "#002434",
                              marginTop: 4,
                            }}
                          >
                            {st.cardName}
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
                          {st.currencyCode}
                        </span>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 400,
                              fontSize: 11,
                              lineHeight: "14px",
                              color: "#72787C",
                            }}
                          >
                            Opening Balance
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-literata)",
                              fontWeight: 400,
                              fontSize: 24,
                              lineHeight: "32px",
                              color: "#002434",
                              marginTop: 4,
                            }}
                          >
                            {formatCurrency(st.openingBalance)}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 400,
                              fontSize: 11,
                              lineHeight: "14px",
                              color: "#72787C",
                            }}
                          >
                            Closing Balance
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-literata)",
                              fontWeight: 400,
                              fontSize: 24,
                              lineHeight: "32px",
                              color: "#002434",
                              marginTop: 4,
                            }}
                          >
                            {formatCurrency(st.closingBalance)}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 400,
                              fontSize: 11,
                              lineHeight: "14px",
                              color: "#72787C",
                            }}
                          >
                            Purchases
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-literata)",
                              fontWeight: 400,
                              fontSize: 24,
                              lineHeight: "32px",
                              color: "#002434",
                              marginTop: 4,
                            }}
                          >
                            {formatCurrency(st.totalPurchases)}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 400,
                              fontSize: 11,
                              lineHeight: "14px",
                              color: "#72787C",
                            }}
                          >
                            Payments
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-literata)",
                              fontWeight: 400,
                              fontSize: 24,
                              lineHeight: "32px",
                              color: "#002434",
                              marginTop: 4,
                            }}
                          >
                            {formatCurrency(st.totalPayments)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <span
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 400,
                              fontSize: 11,
                              lineHeight: "14px",
                              color: "#72787C",
                            }}
                          >
                            Utilization
                          </span>
                          <span
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              fontWeight: 400,
                              fontSize: 11,
                              lineHeight: "14px",
                              color: "#72787C",
                            }}
                          >
                            {util.toFixed(1)}%
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            backgroundColor: "#F0EDED",
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
                              width: `${Math.min(util, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {group.length > 1 && (
                <div
                  className="flex items-center justify-end gap-8 py-2"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 13,
                    lineHeight: "18px",
                    color: "#72787C",
                  }}
                >
                  <span>Total Purchases: <strong>{formatCurrency(grandPurchases)}</strong></span>
                  <span>Total Payments: <strong>{formatCurrency(grandPayments)}</strong></span>
                </div>
              )}
            </section>
          )
        })
      )}
    </>
  )
}

function BreadcrumbPlaceholder() {
  return (
    <div
      className="flex items-center gap-2 text-[10px] uppercase"
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 400,
        lineHeight: "15px",
        letterSpacing: "1px",
        color: "transparent",
        userSelect: "none",
      }}
    >
      <span>CREDITVIEW</span>
      <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 0.5L3.5 3.5L1 6.5" stroke="transparent" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>STATEMENTS</span>
    </div>
  )
}
