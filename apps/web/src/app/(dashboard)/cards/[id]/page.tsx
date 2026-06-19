import type { Metadata } from "next"
import { getCard, getCardTransactions } from "@/actions/queries"
import { getBudgets } from "@/actions/budgets"
import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { TransactionForm } from "@/components/transaction-form"
import type { BudgetOption } from "@/components/budget-selector"
import { DeleteCardButton } from "../delete-card-button"

export const metadata: Metadata = { title: "Card Details" }

function formatCurrency(amount: number, currencyCode: string) {
  const symbol = currencyCode === "COP" ? "$" : "$"
  return symbol + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const [card, transactions, rawBudgets] = await Promise.all([
    getCard(id),
    getCardTransactions(id),
    getBudgets(),
  ])

  if (!card) notFound()

  const budgets: BudgetOption[] = rawBudgets.map((b) => ({
    id: b.id,
    category: b.category,
    amount: b.amount,
    spent: b.spent,
    period: b.period,
    cardName: b.card?.name ?? null,
  }))

  const userName = session?.user?.name ?? "CARDHOLDER"

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <Link
            href="/cards"
            className="inline-flex items-center gap-1 text-xs uppercase no-underline"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#002434",
              letterSpacing: "1.1px",
              fontWeight: 400,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 9L4.5 6L7.5 3" stroke="#002434" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            BACK TO CARDS
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/cards/${card.id}/edit`}
              className="text-[11px] uppercase no-underline"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
                letterSpacing: "1.1px",
                fontWeight: 400,
              }}
            >
              EDIT
            </Link>
            <DeleteCardButton cardId={card.id} />
          </div>
        </div>
        <h1
          className="mt-2"
          style={{
            fontFamily: "var(--font-literata)",
            fontSize: "32px",
            fontWeight: 400,
            color: "#002434",
            lineHeight: "48px",
          }}
        >
          {card.name}
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", lineHeight: "20px" }}
        >
          {card.bank} &middot; {card.currencyCode}
          <span
            className="ml-3 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase"
            style={{
              backgroundColor: card.isActive ? "#E8F5E9" : "#F0EDED",
              color: card.isActive ? "#059669" : "#72787C",
              fontFamily: "var(--font-dm-sans)",
              letterSpacing: "1px",
            }}
          >
            {card.isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width: "100%",
          maxWidth: "400px",
          aspectRatio: "1.58",
          background: "linear-gradient(147.67deg, #002434 0%, #1A4A5E 100%)",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          padding: "28px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-30px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            filter: "blur(32px)",
            pointerEvents: "none",
          }}
        />
        <div className="flex items-start justify-between">
          <span
            className="text-[10px] uppercase"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "rgba(255,255,255,0.5)",
              lineHeight: "15px",
              letterSpacing: "2px",
            }}
          >
            {card.bank}
          </span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C7.5 2 5 4.5 5 7.5V10H4V16H16V10H15V7.5C15 4.5 12.5 2 10 2Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <path d="M10 11C10.8284 11 11.5 11.6716 11.5 12.5C11.5 13.3284 10.8284 14 10 14C9.17157 14 8.5 13.3284 8.5 12.5C8.5 11.6716 9.17157 11 10 11Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="mt-8" style={{ position: "relative", zIndex: 1 }}>
          <p
            style={{
              fontFamily: "ui-monospace, 'Liberation Mono', monospace",
              fontSize: "24px",
              lineHeight: "36px",
              letterSpacing: "4.8px",
              color: "#FFFFFF",
            }}
          >
            &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; XXXX
          </p>
        </div>
        <div className="mt-8 flex items-center justify-between" style={{ position: "relative", zIndex: 1 }}>
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "rgba(255,255,255,0.8)",
              lineHeight: "18px",
              fontWeight: 500,
            }}
          >
            {userName.toUpperCase()}
          </span>
          <span
            className="text-xs"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "rgba(255,255,255,0.8)",
              lineHeight: "18px",
              fontWeight: 400,
            }}
          >
            XX/XX
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "TOTAL LIMIT", value: card.totalLimit.amount },
          { label: "USED", value: card.usedBalance.amount },
          { label: "AVAILABLE", value: card.availableBalance.amount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border bg-white px-8 py-6"
            style={{ borderColor: "#C2C7CC", borderRadius: "12px" }}
          >
            <p
              className="text-[11px] uppercase"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#42474B",
                lineHeight: "17.6px",
                letterSpacing: "1.1px",
                fontWeight: 400,
              }}
            >
              {item.label}
            </p>
            <p
              className="mt-2 text-[28px]"
              style={{
                fontFamily: "var(--font-literata)",
                color: "#002434",
                lineHeight: "44.8px",
                fontWeight: 400,
              }}
            >
              {formatCurrency(item.value, card.currencyCode)}
            </p>
            <div
              className="mt-3 h-1 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "#E5E5E1" }}
            >
              {item.label === "USED" && (
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((card.usedBalance.amount / card.totalLimit.amount) * 100, 100)}%`,
                    backgroundColor: "#002434",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <div
            className="overflow-hidden rounded-xl border bg-white"
            style={{ borderColor: "#E5E5E1", borderRadius: "12px" }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2
                className="text-lg"
                style={{
                  fontFamily: "var(--font-literata)",
                  color: "#002434",
                  lineHeight: "27px",
                  fontWeight: 500,
                }}
              >
                Transaction History
              </h2>
            </div>
            {transactions.length === 0 ? (
              <p
                className="px-5 pb-6 text-sm"
                style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}
              >
                No transactions yet.
              </p>
            ) : (
              <div>
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-t px-5 py-3"
                    style={{ borderColor: "rgba(194, 199, 204, 0.3)" }}
                  >
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          color: "#002434",
                          lineHeight: "20px",
                          fontWeight: 500,
                        }}
                      >
                        {tx.description}
                      </p>
                      <p
                        className="text-xs"
                        style={{
                          fontFamily: "var(--font-dm-sans)",
                          color: "#72787C",
                          lineHeight: "18px",
                        }}
                      >
                        {formatDate(tx.date)} &middot; {tx.type}
                        {tx.isInstallment && " · Installments"}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold`}
                      style={{
                        fontFamily: "var(--font-dm-sans)",
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: tx.type === "PAYMENT" ? "#059669" : "#002434",
                      }}
                    >
                      {tx.type === "PAYMENT" ? "+" : "-"}
                      {formatCurrency(tx.amount.amount, tx.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-5">
          <div
            className="rounded-xl border bg-white p-5"
            style={{ borderColor: "#E5E5E1", borderRadius: "12px" }}
          >
            <h2
              className="mb-4 text-lg"
              style={{
                fontFamily: "var(--font-literata)",
                color: "#002434",
                lineHeight: "27px",
                fontWeight: 500,
              }}
            >
              Add Transaction
            </h2>
            <TransactionForm cardId={card.id} budgets={budgets} />
          </div>
        </div>
      </div>
    </div>
  )
}
