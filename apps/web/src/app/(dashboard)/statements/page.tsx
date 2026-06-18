import type { Metadata } from "next"
import { getStatements } from "@/actions/statements"

export const metadata: Metadata = { title: "Statements" }

function formatCurrency(amount: number) {
  const sign = amount < 0 ? "-" : ""
  return sign + "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function getLastUpdated() {
  const now = new Date()
  return now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
    " • " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
}

export default async function StatementsPage() {
  const statements = await getStatements()

  const byMonth = statements.reduce<Record<string, typeof statements>>((acc, s) => {
    const key = `${s.year}-${String(s.month).padStart(2, "0")}`
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const sortedMonths = Object.entries(byMonth).sort(([a], [b]) => b.localeCompare(a))

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase" style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400, lineHeight: "15px", letterSpacing: "1px" }}>
            <span style={{ color: "#72787C" }}>FINANCE</span>
            <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 0.5L3.5 3.5L1 6.5" stroke="#72787C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#002434" }}>STATEMENTS</span>
          </div>
          <h1
            className="text-[32px]"
            style={{
              fontFamily: "var(--font-literata)",
              fontWeight: 400,
              color: "#002434",
              lineHeight: "40px",
              marginTop: "8px",
            }}
          >
            Statements
          </h1>
          <p
            className="max-w-[420px] text-base"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#5D5F5C",
              lineHeight: "24px",
              fontWeight: 400,
              marginTop: "8px",
            }}
          >
            Access your detailed wealth management reports and monthly performance breakdowns across all premium accounts.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-2 text-[10px] uppercase"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
                lineHeight: "15px",
                letterSpacing: "1px",
                fontWeight: 400,
                padding: "9px 20px",
                borderRadius: "8px",
                border: "1px solid #C2C7CC",
              }}
            >
              <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5.5 5.5L10 1" stroke="#002434" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              FILTER BY CARD
            </div>
            <div
              className="inline-flex items-center gap-2 text-[10px] uppercase"
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
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 5H9.5M5 0.5V9.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              EXPORT ALL
            </div>
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
            Statements will appear once you have card activity.
          </p>
        </div>
      ) : (
        sortedMonths.map(([key, group]) => {
          const [yearStr, monthStr] = key.split("-")
          const year = parseInt(yearStr)
          const month = parseInt(monthStr)
          const monthLabel = monthNames[month - 1] + " " + year

          return (
            <section key={key} className="space-y-8">
              <div className="flex items-center gap-4">
                <h2
                  className="text-xl"
                  style={{
                    fontFamily: "var(--font-literata)",
                    fontWeight: 400,
                    color: "#002434",
                    lineHeight: "30px",
                  }}
                >
                  {monthLabel}
                </h2>
                <div className="flex-1" style={{ height: "1px", backgroundColor: "#C2C7CC" }} />
              </div>

              <div className="grid grid-cols-2 gap-8">
                {group.map((s) => {
                  const utilizationPct = Math.min((s.closingBalance / s.totalLimit) * 100, 100)
                  return (
                    <div
                      key={s.cardId}
                      className="flex flex-col gap-10 rounded-xl border bg-white p-8"
                      style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p
                            className="text-[10px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#002434",
                              lineHeight: "15px",
                              letterSpacing: "2px",
                              fontWeight: 400,
                            }}
                          >
                            ACCOUNT NO. &bull;&bull;&bull;&bull; {s.cardId.slice(-4)}
                          </p>
                          <h3
                            className="text-lg"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#002434",
                              lineHeight: "28px",
                              fontWeight: 500,
                            }}
                          >
                            {s.cardName}
                          </h3>
                        </div>
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "9999px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="3" r="1.5" fill="#002434" />
                            <circle cx="11" cy="8" r="1.5" fill="#002434" />
                            <circle cx="11" cy="13" r="1.5" fill="#002434" />
                          </svg>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-6">
                        <div>
                          <p
                            className="text-[10px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#72787C",
                              lineHeight: "15px",
                              letterSpacing: "1px",
                              fontWeight: 400,
                            }}
                          >
                            OPENING BALANCE
                          </p>
                          <p
                            className="text-2xl"
                            style={{
                              fontFamily: "var(--font-literata)",
                              color: "#002434",
                              lineHeight: "24px",
                              fontWeight: 400,
                              marginTop: "12px",
                            }}
                          >
                            {formatCurrency(s.openingBalance)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#72787C",
                              lineHeight: "15px",
                              letterSpacing: "1px",
                              fontWeight: 400,
                            }}
                          >
                            PURCHASES
                          </p>
                          <p
                            className="text-2xl"
                            style={{
                              fontFamily: "var(--font-literata)",
                              color: "#002434",
                              lineHeight: "24px",
                              fontWeight: 400,
                              marginTop: "12px",
                            }}
                          >
                            {formatCurrency(s.totalPurchases)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#72787C",
                              lineHeight: "15px",
                              letterSpacing: "1px",
                              fontWeight: 400,
                            }}
                          >
                            PAYMENTS
                          </p>
                          <p
                            className="text-2xl"
                            style={{
                              fontFamily: "var(--font-literata)",
                              color: "#77A5BE",
                              lineHeight: "24px",
                              fontWeight: 400,
                              marginTop: "12px",
                            }}
                          >
                            -{formatCurrency(s.totalPayments)}
                          </p>
                        </div>
                        <div>
                          <p
                            className="text-[10px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#72787C",
                              lineHeight: "15px",
                              letterSpacing: "1px",
                              fontWeight: 400,
                            }}
                          >
                            CLOSING BALANCE
                          </p>
                          <p
                            className="text-2xl"
                            style={{
                              fontFamily: "var(--font-literata)",
                              color: "#002434",
                              lineHeight: "24px",
                              fontWeight: 400,
                              marginTop: "12px",
                            }}
                          >
                            {formatCurrency(s.closingBalance)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2" style={{ borderTop: "1px solid #C2C7CC", paddingTop: "16px" }}>
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[9px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#72787C",
                              lineHeight: "13.5px",
                              letterSpacing: "0.9px",
                              fontWeight: 400,
                            }}
                          >
                            LIMIT UTILIZATION
                          </span>
                          <span
                            className="text-[9px] uppercase"
                            style={{
                              fontFamily: "var(--font-dm-sans)",
                              color: "#002434",
                              lineHeight: "13.5px",
                              letterSpacing: "0.9px",
                              fontWeight: 400,
                            }}
                          >
                            {Math.round(utilizationPct)}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "4px",
                            backgroundColor: "#EAE7E7",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.round(utilizationPct)}%`,
                              height: "100%",
                              backgroundColor: "#1A3A4A",
                              borderRadius: "9999px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
