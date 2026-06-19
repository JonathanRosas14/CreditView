"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

type CardInfo = { id: string; name: string; bank: string }

export function TransactionFilters({ cards }: { cards: CardInfo[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [cardId, setCardId] = useState(searchParams.get("cardId") || "")
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "")
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "")
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const buildHref = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams()
      const card = overrides.cardId ?? cardId
      const from = overrides.dateFrom ?? dateFrom
      const to = overrides.dateTo ?? dateTo
      const q = overrides.search ?? search
      if (card) params.set("cardId", card)
      if (from) params.set("dateFrom", from)
      if (to) params.set("dateTo", to)
      if (q) params.set("search", q)
      params.set("page", "1")
      return `/transactions?${params.toString()}`
    },
    [cardId, dateFrom, dateTo, search],
  )

  const navigate = useCallback(
    (overrides: Record<string, string>) => {
      router.push(buildHref(overrides))
    },
    [router, buildHref],
  )

  const handleCardChange = (value: string) => {
    setCardId(value)
    navigate({ cardId: value })
  }

  const handleDateFromChange = (value: string) => {
    setDateFrom(value)
    navigate({ dateFrom: value })
  }

  const handleDateToChange = (value: string) => {
    setDateTo(value)
    navigate({ dateTo: value })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      navigate({ search: value })
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
    }
  }, [])

  return (
    <div className="flex items-center gap-4">
      {/* Card select */}
      <div className="relative" style={{ width: "236px" }}>
        <select
          value={cardId}
          onChange={(e) => handleCardChange(e.target.value)}
          className="w-full appearance-none border bg-white px-4 py-3 pr-10 text-base outline-none"
          style={{
            borderColor: "#C2C7CC",
            borderRadius: "8px",
            fontFamily: "var(--font-dm-sans)",
            color: "#1C1B1B",
            lineHeight: "25.6px",
            fontWeight: 400,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%2372787C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 16px center",
            backgroundSize: "12px",
          }}
        >
          <option value="">All Accounts</option>
          {cards.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
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

      {/* Date range */}
      <div className="relative" style={{ width: "250px" }}>
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
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="w-full border-none bg-transparent p-0 text-base outline-none"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#1C1B1B",
              lineHeight: "25.6px",
              fontWeight: 400,
            }}
          />
          <span style={{ color: "#72787C" }}>–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="w-full border-none bg-transparent p-0 text-base outline-none"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#1C1B1B",
              lineHeight: "25.6px",
              fontWeight: 400,
            }}
          />
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

      {/* Search */}
      <div className="relative flex-1" style={{ maxWidth: "379px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Filter by merchant or type"
          className="w-full border bg-white pl-12 pr-4 text-base outline-none"
          style={{
            borderColor: "#C2C7CC",
            borderRadius: "8px",
            paddingTop: "14px",
            paddingBottom: "14.6px",
            fontFamily: "var(--font-dm-sans)",
            color: "#1C1B1B",
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
  )
}
