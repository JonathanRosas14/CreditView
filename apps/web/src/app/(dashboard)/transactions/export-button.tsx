"use client"

import { exportTransactionsCSV } from "@/actions/export"

export function ExportButton() {
  const handleExport = async () => {
    const csv = await exportTransactionsCSV()
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 text-xs uppercase"
      style={{
        fontFamily: "var(--font-dm-sans)",
        color: "#002434",
        lineHeight: "18px",
        letterSpacing: "1.2px",
        fontWeight: 400,
        padding: "16px 32px",
        borderRadius: "12px",
        border: "1px solid #C2C7CC",
        background: "none",
        cursor: "pointer",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 1V8M6 8L3 5M6 8L9 5" stroke="#002434" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 9V10.5C1 10.7761 1.22386 11 1.5 11H10.5C10.7761 11 11 10.7761 11 10.5V9" stroke="#002434" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      Export CSV
    </button>
  )
}
