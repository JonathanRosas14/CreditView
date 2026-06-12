"use client"

import { useActionState } from "react"
import { createBudgetAction } from "@/actions/budgets"

export default function NewBudgetPage() {
  const [state, formAction, pending] = useActionState(createBudgetAction, {
    success: false,
    error: null,
  })

  if (state?.success) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">New Budget</h1>
        <div className="rounded-xl border p-6 text-center">
          <p className="font-medium text-green-600">Budget created!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Budget</h1>

      <form action={formAction} className="max-w-md space-y-4 rounded-xl border p-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Category</span>
          <input
            name="category"
            required
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="e.g. Groceries, Entertainment"
          />
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

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Period</span>
          <select
            name="period"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Start Date</span>
          <input
            name="startDate"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Create Budget"}
        </button>
      </form>
    </div>
  )
}
