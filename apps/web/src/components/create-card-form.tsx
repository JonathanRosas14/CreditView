"use client"

import { useActionState } from "react"
import { createCardAction } from "@/actions/cards"

const currencies = ["USD", "EUR", "GBP", "COP", "MXN", "ARS", "BRL", "CLP", "PEN"]

export function CreateCardForm() {
  const [state, formAction, pending] = useActionState(createCardAction, {
    success: false,
    error: null,
  })

  if (state?.success) {
    return (
      <div className="rounded-xl border p-6 text-center">
        <p className="font-medium text-green-600">Card created successfully!</p>
        <a href="/cards" className="mt-2 inline-block text-sm text-zinc-500 underline">
          Back to cards
        </a>
      </div>
    )
  }

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Add Card</h1>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name</span>
        <input
          name="name"
          required
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g. My Visa Platinum"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Bank</span>
        <input
          name="bank"
          required
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g. Chase"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Total Limit</span>
          <input
            name="totalLimit"
            type="number"
            step="0.01"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Currency</span>
          <select
            name="currencyCode"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Cutoff Day</span>
          <input
            name="cutoffDay"
            type="number"
            min="1"
            max="31"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Payment Day</span>
          <input
            name="paymentDay"
            type="number"
            min="1"
            max="31"
            required
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Interest Rate (%)</span>
        <input
          name="interestRate"
          type="number"
          step="0.001"
          required
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="e.g. 29.99"
        />
      </label>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Card"}
        </button>
        <a
          href="/cards"
          className="rounded-lg border px-4 py-2 text-sm font-medium"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
