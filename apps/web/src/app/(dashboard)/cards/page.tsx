import type { Metadata } from "next"
import Link from "next/link"
import { getCards } from "@/actions/queries"
import { getRecentTransactions } from "@/actions/queries"
import { CardVisual } from "@/components/card-visual"
import { DeleteCardButton } from "./delete-card-button"

export const metadata: Metadata = { title: "Cards" }

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatCurrency(amount: number) {
  return "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function CardsPage() {
  const cards = await getCards()
  const recentTransactions = await getRecentTransactions(5)

  return (
    <div className="space-y-12">
      <section className="flex items-end justify-between">
        <div>
          <p
            className="text-xs font-bold uppercase"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#85A4B7",
              lineHeight: "12px",
              letterSpacing: "1.8px",
              fontWeight: 700,
            }}
          >
            MANAGE ACCOUNTS
          </p>
          <h1
            className="mt-2 text-[32px]"
            style={{
              fontFamily: "var(--font-literata)",
              color: "#002434",
              lineHeight: "48px",
              fontWeight: 400,
            }}
          >
            Cards
          </h1>
        </div>
        <Link
          href="/cards/new"
          className="inline-flex items-center gap-2 text-xs uppercase no-underline"
          style={{
            backgroundColor: "#002434",
            color: "#FFFFFF",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            lineHeight: "18px",
            letterSpacing: "1.2px",
            padding: "16px 32px",
            borderRadius: "12px",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="7.5" y1="1.5" x2="7.5" y2="13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1.5" y1="7.5" x2="13.5" y2="7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          ADD NEW CARD
        </Link>
      </section>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <p
            className="text-2xl"
            style={{
              fontFamily: "var(--font-literata)",
              color: "#72787C",
              fontWeight: 400,
            }}
          >
            No cards yet
          </p>
          <p
            className="mt-2 text-base"
            style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}
          >
            Add your first card to start tracking.
          </p>
          <Link
            href="/cards/new"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase no-underline"
            style={{
              backgroundColor: "#002434",
              color: "#FFFFFF",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              lineHeight: "18px",
              letterSpacing: "1.2px",
              padding: "16px 32px",
              borderRadius: "12px",
            }}
          >
            ADD NEW CARD
          </Link>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div key={card.id}>
                <Link
                  href={`/cards/${card.id}`}
                  className="block transition-all no-underline"
                  style={{ borderRadius: "12px" }}
                >
                  <CardVisual card={{ id: card.id, bank: card.bank, name: card.name }} index={index} />
                </Link>
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ fontFamily: "var(--font-dm-sans)", color: "#002434", lineHeight: "20px" }}
                    >
                      {card.name}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C", lineHeight: "16px" }}
                    >
                      {card.bank} &middot; ${card.totalLimit.amount.toLocaleString()} limit
                    </p>
                    <div
                      className="mt-2 h-1 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "#E5E5E1" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min((card.usedBalance.amount / card.totalLimit.amount) * 100, 100)}%`,
                          backgroundColor: "#002434",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <Link
                      href={`/cards/${card.id}/edit`}
                      className="text-[11px] uppercase no-underline"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        color: "#72787C",
                        letterSpacing: "1.1px",
                        fontWeight: 400,
                      }}
                    >
                      EDIT
                    </Link>
                    <DeleteCardButton cardId={card.id} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section>
            <div
              className="mb-6 flex items-center justify-between"
              style={{ borderTop: "1px solid #C2C7CC", paddingTop: "25px" }}
            >
              <h2
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-literata)",
                  fontWeight: 500,
                  color: "#002434",
                  lineHeight: "31.2px",
                }}
              >
                Card Activity
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div
                className="col-span-8 rounded-xl border bg-white p-6"
                style={{ borderColor: "#E5E5E1", borderRadius: "12px" }}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: "var(--font-literata)",
                      color: "#002434",
                      lineHeight: "30px",
                      fontWeight: 400,
                    }}
                  >
                    Monthly Utilization
                  </h3>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#42474B",
                      lineHeight: "16px",
                      fontWeight: 400,
                    }}
                  >
                    Last 6 Months
                  </span>
                </div>
                <p
                  className="mt-1 text-sm"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: "#42474B",
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
                  Track your monthly spending patterns across all cards
                </p>

                <div className="mt-8 flex items-end gap-3" style={{ height: "140px" }}>
                  {[
                    { label: "Jan", value: 35 },
                    { label: "Feb", value: 28 },
                    { label: "Mar", value: 42 },
                    { label: "Apr", value: 38 },
                    { label: "May", value: 55 },
                    { label: "Jun", value: 48 },
                  ].map((month, i) => (
                    <div key={month.label} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="relative flex w-full items-end justify-center"
                        style={{ height: "100%" }}
                      >
                        {i === 4 && (
                          <span
                            className="absolute -top-7 whitespace-nowrap rounded px-2 py-1 text-[10px] font-bold"
                            style={{
                              backgroundColor: "#002434",
                              color: "#FFFFFF",
                              fontFamily: "var(--font-dm-sans)",
                              lineHeight: "15px",
                              borderRadius: "4px",
                            }}
                          >
                            Current
                          </span>
                        )}
                        <div
                          style={{
                            width: "48px",
                            height: `${month.value}%`,
                            backgroundColor: i === 4 ? "#002434" : "#F0EDED",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            minHeight: "8px",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          color: "#42474B",
                          lineHeight: "16px",
                          fontWeight: 400,
                        }}
                      >
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#002434",
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        color: "#42474B",
                        lineHeight: "16px",
                        fontWeight: 400,
                      }}
                    >
                      Primary
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#C7E7FC",
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        color: "#42474B",
                        lineHeight: "16px",
                        fontWeight: 400,
                      }}
                    >
                      Recurring
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#E5E2E1",
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        color: "#42474B",
                        lineHeight: "16px",
                        fontWeight: 400,
                      }}
                    >
                      Other
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-4 flex flex-col gap-6">
                <div
                  className="rounded-xl border bg-white p-6"
                  style={{ borderColor: "#E5E5E1", borderRadius: "12px" }}
                >
                  <h3
                    className="text-lg"
                    style={{
                      fontFamily: "var(--font-literata)",
                      color: "#002434",
                      lineHeight: "27px",
                      fontWeight: 400,
                    }}
                  >
                    Quick Actions
                  </h3>
                  <div className="mt-4 space-y-1">
                    {[
                      { label: "Freeze Card", icon: "freeze" },
                      { label: "Change PIN", icon: "pin" },
                      { label: "Rewards Summary", icon: "rewards" },
                    ].map((action) => (
                      <button
                        key={action.label}
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          color: "#002434",
                          lineHeight: "20px",
                          fontWeight: 500,
                          borderRadius: "8px",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span>{action.label}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 4L10 8L6 12" stroke="#C2C7CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className="relative overflow-hidden rounded-xl border bg-white p-6"
                  style={{ borderColor: "#E5E5E1", borderRadius: "12px" }}
                >
                  <div
                    className="absolute bottom-0 right-0"
                    style={{
                      fontSize: "80px",
                      lineHeight: 1,
                      color: "rgba(0, 36, 52, 0.03)",
                      transform: "rotate(-15deg) translate(10px, 10px)",
                      pointerEvents: "none",
                    }}
                  >
                    &#9733;
                  </div>
                  <h3
                    className="text-lg"
                    style={{
                      fontFamily: "var(--font-literata)",
                      color: "#002434",
                      lineHeight: "27px",
                      fontWeight: 400,
                    }}
                  >
                    Exclusive Offer
                  </h3>
                  <p
                    className="mt-2 text-xs leading-relaxed"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "rgba(0,36,52,0.7)",
                      lineHeight: "19.5px",
                      fontWeight: 400,
                    }}
                  >
                    Upgrade to CreditView Premium and unlock unlimited cards,
                    advanced analytics, and priority support.
                  </p>
                  <button
                    className="mt-4 text-[10px] uppercase"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#002434",
                      lineHeight: "15px",
                      fontWeight: 400,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    LEARN MORE
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-literata)",
                  fontWeight: 500,
                  color: "#002434",
                  lineHeight: "31.2px",
                }}
              >
                Recent Activity
              </h2>
              <Link
                href="/transactions"
                className="text-[11px] underline"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: "#002434",
                  lineHeight: "16.5px",
                  fontWeight: 400,
                }}
              >
                VIEW ALL TRANSACTIONS
              </Link>
            </div>

            <div
              className="overflow-hidden rounded-xl border bg-white"
              style={{ borderColor: "#E5E5E1", borderRadius: "12px" }}
            >
              <div className="grid grid-cols-4 gap-4 px-4 py-3">
                {["DATE", "MERCHANT", "CARD", "AMOUNT"].map((header) => (
                  <div
                    key={header}
                    className="text-[10px] font-bold uppercase"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#002434",
                      lineHeight: "15px",
                      fontWeight: 700,
                      textAlign: header === "AMOUNT" ? "right" : "left",
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>

              {recentTransactions.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm" style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}>
                  No recent activity
                </p>
              ) : (
                recentTransactions.map((tx) => {
                  const isPayment = tx.type === "PAYMENT"
                  return (
                    <div
                      key={tx.id}
                      className="grid grid-cols-4 gap-4 border-t px-4 py-3"
                      style={{ borderColor: "rgba(194, 199, 204, 0.3)" }}
                    >
                      <div
                        className="text-sm"
                        style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", lineHeight: "20px", fontWeight: 400 }}
                      >
                        {formatDate(new Date(tx.date))}
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-dm-sans)", color: "#002434", lineHeight: "20px", fontWeight: 500 }}
                      >
                        {tx.description}
                      </div>
                      <div
                        className="text-[10px]"
                        style={{
                          fontFamily: "ui-monospace, 'Liberation Mono', monospace",
                          color: "#42474B",
                          lineHeight: "15px",
                          letterSpacing: "0.5px",
                          fontWeight: 400,
                        }}
                      >
                        &bull; {tx.cardId.slice(-4)}
                      </div>
                      <div
                        className="text-right text-sm font-bold"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          color: "#002434",
                          lineHeight: "20px",
                          fontWeight: 700,
                        }}
                      >
                        {isPayment ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
