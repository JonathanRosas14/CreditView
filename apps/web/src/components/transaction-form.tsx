"use client"

import { useActionState, useState } from "react"
import { createTransactionAction } from "@/actions/transactions"
import { BudgetSelector, type BudgetOption } from "./budget-selector"

export function TransactionForm({ cardId, budgets }: { cardId: string; budgets: BudgetOption[] }) {
  const [state, formAction, pending] = useActionState(createTransactionAction, {
    success: false,
    error: null,
    warning: null,
  })
  const [hasInstallments, setHasInstallments] = useState(false)
  const [budgetId, setBudgetId] = useState("")

  if (state?.success) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="font-medium text-green-600">Transaction recorded!</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="cardId" value={cardId} />
      <input type="hidden" name="budgetId" value={budgetId} />

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Type</span>
          <select
            name="type"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="PURCHASE">Purchase</option>
            <option value="PAYMENT">Payment</option>
            <option value="ADVANCE">Cash Advance</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Amount</span>
          <input
            name="amount"
            type="number"
            step="0.01"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Description</span>
        <input
          name="description"
          required
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g. Amazon purchase"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Date</span>
          <input
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Installments</span>
          <select
            name="installments"
            value={hasInstallments ? "2" : "0"}
            onChange={(e) => setHasInstallments(e.target.value !== "0")}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="0">No (one payment)</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
          </select>
        </label>
      </div>

      <BudgetSelector budgets={budgets} value={budgetId} onChange={setBudgetId} />

      {state?.warning && (
        <div
          style={{
            backgroundColor: "#FEF3C7",
            border: "1px solid #F59E0B",
            borderRadius: 8,
            padding: "10px 14px",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 13,
            fontWeight: 500,
            lineHeight: "18px",
            color: "#92400E",
          }}
        >
          {state.warning}
        </div>
      )}

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Transaction"}
      </button>
    </form>
  )
}
