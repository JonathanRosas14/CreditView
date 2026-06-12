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
      className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
    >
      Export CSV
    </button>
  )
}
