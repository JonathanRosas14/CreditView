"use client"

import { useState, useRef, useEffect } from "react"

export type BudgetOption = {
  id: string
  category: string
  amount: number
  spent: number
  period: string
  cardName: string | null
}

export function BudgetSelector({
  budgets,
  value,
  onChange,
}: {
  budgets: BudgetOption[]
  value: string
  onChange: (budgetId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = budgets.find((b) => b.id === value)

  const filtered = budgets.filter((b) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      b.category.toLowerCase().includes(q) ||
      (b.cardName && b.cardName.toLowerCase().includes(q))
    )
  })

  return (
    <div ref={ref} className="relative">
      <span className="text-sm font-medium">Budget (optional)</span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          fontFamily: "var(--font-dm-sans)",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: "20px",
          color: selected ? "#1C1B1B" : "#72787C",
          backgroundColor: "#FFFFFF",
          border: "1px solid #C2C7CC",
          borderRadius: 8,
          padding: "10px 12px",
          textAlign: "left",
          marginTop: 4,
          cursor: "pointer",
        }}
      >
        {selected
          ? `${selected.category}${selected.cardName ? ` (${selected.cardName})` : ""}`
          : "None"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: "#FFFFFF",
            border: "1px solid #C2C7CC",
            borderRadius: 8,
            marginTop: 4,
            maxHeight: 240,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="text"
            placeholder="Filter budgets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 13,
              fontWeight: 400,
              lineHeight: "18px",
              color: "#1C1B1B",
              backgroundColor: "#F6F3F2",
              border: "none",
              borderRadius: 6,
              padding: "8px 12px",
              margin: 8,
              outline: "none",
            }}
          />
          <div style={{ overflowY: "auto", flex: 1 }}>
            <button
              type="button"
              onClick={() => {
                onChange("")
                setOpen(false)
                setSearch("")
              }}
              style={{
                width: "100%",
                fontFamily: "var(--font-dm-sans)",
                fontSize: 14,
                fontWeight: value === "" ? 700 : 400,
                lineHeight: "20px",
                color: "#1C1B1B",
                backgroundColor: value === "" ? "#F0EDED" : "transparent",
                border: "none",
                padding: "10px 12px",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              None
            </button>
            {filtered.map((b) => {
              const remaining = b.amount - b.spent
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onChange(b.id)
                    setOpen(false)
                    setSearch("")
                  }}
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 14,
                    fontWeight: value === b.id ? 700 : 400,
                    lineHeight: "20px",
                    color: "#1C1B1B",
                    backgroundColor: value === b.id ? "#F0EDED" : "transparent",
                    border: "none",
                    borderTop: "1px solid #F0EDED",
                    padding: "10px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span>{b.category}</span>
                    <span style={{ fontSize: 12, color: "#72787C" }}>
                      {b.cardName ?? "All cards"} &middot;{" "}
                      {b.period === "YEARLY" ? "Yearly" : "Monthly"} &middot;
                      ${remaining >= 0 ? remaining.toLocaleString("en-US") : "0"} remaining
                    </span>
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "16px 12px",
                  textAlign: "center",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: 13,
                  color: "#72787C",
                }}
              >
                No budgets match
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
