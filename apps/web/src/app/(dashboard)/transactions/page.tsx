import type { Metadata } from "next"
import Link from "next/link"
import { getAllTransactions } from "@/actions/queries"
import { ExportButton } from "./export-button"

export const metadata: Metadata = { title: "Transactions" }

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatCurrency(amount: number) {
  return "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const currentPage = Math.max(1, parseInt(pageStr || "1", 10) || 1)
  const { transactions, page, totalPages } = await getAllTransactions(currentPage, 10)

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1
            className="text-[32px]"
            style={{
              fontFamily: "var(--font-literata)",
              color: "#002434",
              lineHeight: "48px",
              fontWeight: 400,
            }}
          >
            Transactions
          </h1>
          <p
            className="mt-2 text-base"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#42474B",
              lineHeight: "25.6px",
            }}
          >
            Manage and monitor your latest financial activity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 text-xs uppercase no-underline"
            style={{
              backgroundColor: "#002434",
              color: "#FFFFFF",
              fontFamily: "var(--font-dm-sans)",
              lineHeight: "18px",
              letterSpacing: "1.2px",
              padding: "16px 32px",
              borderRadius: "12px",
              fontWeight: 400,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="5.5" y1="0.5" x2="5.5" y2="10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0.5" y1="5.5" x2="10.5" y2="5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            ADD TRANSACTION
          </Link>
          <ExportButton />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="relative"
          style={{ width: "236px" }}
        >
          <select
            className="w-full appearance-none border bg-white px-4 py-3 pr-10 text-base outline-none"
            style={{
              borderColor: "#C2C7CC",
              borderRadius: "8px",
              fontFamily: "var(--font-dm-sans)",
              color: "#1C1B1B",
              lineHeight: "25.6px",
              fontWeight: 400,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2372787C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              backgroundSize: "12px",
            }}
          >
            <option>All Accounts</option>
          </select>
          <span
            className="absolute -top-2.5 left-3 px-1 text-[10px] uppercase"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#72787C",
              lineHeight: "15px",
              letterSpacing: "1px",
              fontWeight: 400,
              backgroundColor: "#FCF9F8",
            }}
          >
            SELECT CARD
          </span>
        </div>

        <div
          className="relative"
          style={{ width: "250px" }}
        >
          <div
            className="flex items-center gap-2 border bg-white px-4 py-3"
            style={{
              borderColor: "#C2C7CC",
              borderRadius: "8px",
            }}
          >
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="2.5" width="13" height="12" rx="2" stroke="#72787C" strokeWidth="1.2" />
              <line x1="0.5" y1="6.5" x2="13.5" y2="6.5" stroke="#72787C" strokeWidth="1.2" />
              <line x1="5" y1="10.5" x2="9" y2="10.5" stroke="#72787C" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span
              className="text-base"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#1C1B1B",
                lineHeight: "25.6px",
                fontWeight: 400,
              }}
            >
              Oct 01 &ndash; Oct 31, 2023
            </span>
          </div>
          <span
            className="absolute -top-2.5 left-3 px-1 text-[10px] uppercase"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#72787C",
              lineHeight: "15px",
              letterSpacing: "1px",
              fontWeight: 400,
              backgroundColor: "#FCF9F8",
            }}
          >
            DATE RANGE
          </span>
        </div>

        <div
          className="relative flex-1"
          style={{ maxWidth: "379px" }}
        >
          <input
            type="text"
            placeholder="Filter by merchant or category"
            className="w-full border bg-white pl-12 pr-4 text-base outline-none"
            style={{
              borderColor: "#C2C7CC",
              borderRadius: "8px",
              paddingTop: "14px",
              paddingBottom: "14.6px",
              fontFamily: "var(--font-dm-sans)",
              color: "#6B7280",
              lineHeight: "20.8px",
              fontWeight: 400,
            }}
          />
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="7.5" cy="7.5" r="5.5" stroke="#72787C" strokeWidth="1.2" />
            <line x1="11.5" y1="11.5" x2="16" y2="16" stroke="#72787C" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-xl border bg-white"
        style={{
          borderColor: "#C2C7CC",
          borderRadius: "12px",
          boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="grid grid-cols-12 items-center"
          style={{ backgroundColor: "#F6F3F2" }}
        >
          {["DATE", "MERCHANT", "CARD", "CATEGORY", "AMOUNT", "STATUS"].map((header) => (
            <div
              key={header}
              className="px-8 py-5 text-xs font-bold uppercase"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "#72787C",
                lineHeight: "12px",
                letterSpacing: "1.8px",
                fontWeight: 700,
                textAlign: header === "AMOUNT" ? "right" : "left",
                gridColumn: header === "DATE" ? "span 1" : header === "MERCHANT" ? "span 3" : header === "CARD" ? "span 2" : header === "CATEGORY" ? "span 2" : header === "AMOUNT" ? "span 2" : "span 2",
              }}
            >
              {header}
            </div>
          ))}
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p
              className="text-lg"
              style={{ fontFamily: "var(--font-literata)", color: "#72787C" }}
            >
              No transactions yet
            </p>
            <p
              className="mt-2 text-sm"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}
            >
              Add a transaction to get started.
            </p>
          </div>
        ) : (
          transactions.map((tx, i) => {
            const isNegative = tx.type !== "PAYMENT"
            const isCleared = tx.type === "PAYMENT" || i % 3 !== 1
            return (
              <div
                key={tx.id}
                className="grid grid-cols-12 items-center"
                style={{
                  borderTop: i > 0 ? "1px solid rgba(194,199,204,0.3)" : "none",
                  borderBottom: "1px solid #C2C7CC",
                }}
              >
                <div
                  className="px-8 py-6 text-base"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: "#42474B",
                    lineHeight: "20px",
                    fontWeight: 400,
                    gridColumn: "span 1",
                  }}
                >
                  {formatDate(new Date(tx.date))}
                </div>
                <div
                  className="px-8 py-6 text-base font-medium"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: "#002434",
                    lineHeight: "20px",
                    fontWeight: 500,
                    gridColumn: "span 3",
                  }}
                >
                  {tx.description}
                </div>
                <div
                  className="px-8 py-6 text-base"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: "#42474B",
                    lineHeight: "20px",
                    fontWeight: 400,
                    gridColumn: "span 2",
                  }}
                >
                  &bull;&bull;&bull;&bull; {tx.cardId.slice(-4)}
                </div>
                <div
                  className="px-8 py-6"
                  style={{ gridColumn: "span 2" }}
                >
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[10px] uppercase"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#42474B",
                      lineHeight: "15px",
                      fontWeight: 400,
                      backgroundColor: "#F0EDED",
                      letterSpacing: "1px",
                    }}
                  >
                    {tx.category}
                  </span>
                </div>
                <div
                  className="px-8 py-6 text-right text-base font-bold"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    lineHeight: "20px",
                    fontWeight: 700,
                    color: isNegative ? "#BA1A1A" : "#16A34A",
                    gridColumn: "span 2",
                  }}
                >
                  {isNegative ? `-${formatCurrency(tx.amount)}` : `+${formatCurrency(tx.amount)}`}
                </div>
                <div
                  className="flex items-center gap-2 px-8 py-6"
                  style={{ gridColumn: "span 2" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isCleared ? "#22C55E" : "#FBBF24",
                    }}
                  />
                  <span
                    className="text-base"
                    style={{
                      fontFamily: "var(--font-dm-sans)",
                      color: "#42474B",
                      lineHeight: "20px",
                      fontWeight: 400,
                    }}
                  >
                    {isCleared ? "Cleared" : "Pending"}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {totalPages > 1 && (
        <div
          className="flex items-center justify-between rounded-xl px-8 py-6"
          style={{ backgroundColor: "#F6F3F2" }}
        >
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/transactions?page=${page - 1}`}
                className="flex items-center justify-center"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "12px",
                  letterSpacing: "1.8px",
                  color: "#72787C",
                  textDecoration: "none",
                }}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1L1 6L6 11" stroke="#72787C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : null}

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <Link
                  key={pageNum}
                  href={`/transactions?page=${pageNum}`}
                  className="flex items-center justify-center text-xs font-bold uppercase no-underline"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 700,
                    lineHeight: "12px",
                    letterSpacing: "1.8px",
                    backgroundColor: pageNum === page ? "#002434" : "transparent",
                    color: pageNum === page ? "#FFFFFF" : "#72787C",
                  }}
                >
                  {pageNum}
                </Link>
              )
            })}

            {totalPages > 5 && page < totalPages - 2 && (
              <span
                className="px-2 text-base"
                style={{ fontFamily: "var(--font-dm-sans)", color: "#72787C" }}
              >
                ...
              </span>
            )}

            {totalPages > 5 && page < totalPages - 2 && (
              <Link
                href={`/transactions?page=${totalPages}`}
                className="flex items-center justify-center text-xs font-bold uppercase no-underline"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 700,
                  lineHeight: "12px",
                  letterSpacing: "1.8px",
                  color: "#72787C",
                }}
              >
                {totalPages}
              </Link>
            )}

            {page < totalPages ? (
              <Link
                href={`/transactions?page=${page + 1}`}
                className="flex items-center justify-center"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "6px",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "12px",
                  letterSpacing: "1.8px",
                  color: "#72787C",
                  textDecoration: "none",
                }}
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L1 11" stroke="#72787C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
