"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { updateCardAction } from "@/actions/cards"

const currencies = ["USD", "EUR", "GBP", "COP", "MXN", "ARS", "BRL", "CLP", "PEN"]

export function EditCardForm({
  cardId,
  defaultValues,
}: {
  cardId: string
  defaultValues: {
    name: string
    bank: string
    totalLimit: number
    currencyCode: string
    cutoffDay: number
    paymentDay: number
    interestRate: number
  }
}) {
  const router = useRouter()
  const updateAction = updateCardAction.bind(null, cardId)
  const [state, formAction, pending] = useActionState(updateAction, {
    success: false,
    error: null,
  })

  if (state?.success) {
    router.push(`/cards/${cardId}`)
    return null
  }

  return (
    <div className="w-full" style={{ maxWidth: "560px" }}>
      <div className="mb-8">
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
          EDIT CARD
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
          Edit {defaultValues.name}
        </h1>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
            >
              Name
            </span>
            <input
              name="name"
              required
              defaultValue={defaultValues.name}
              className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "#C2C7CC",
                borderRadius: "8px",
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
              }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
            >
              Bank
            </span>
            <input
              name="bank"
              required
              defaultValue={defaultValues.bank}
              className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "#C2C7CC",
                borderRadius: "8px",
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
              }}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
            >
              Total Limit
            </span>
            <input
              name="totalLimit"
              type="number"
              step="0.01"
              required
              defaultValue={defaultValues.totalLimit}
              className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "#C2C7CC",
                borderRadius: "8px",
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
              }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
            >
              Currency
            </span>
            <select
              name="currencyCode"
              required
              defaultValue={defaultValues.currencyCode}
              className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "#C2C7CC",
                borderRadius: "8px",
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
              }}
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

        <div className="grid grid-cols-2 gap-6">
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
            >
              Cutoff Day
            </span>
            <input
              name="cutoffDay"
              type="number"
              min="1"
              max="31"
              required
              defaultValue={defaultValues.cutoffDay}
              className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "#C2C7CC",
                borderRadius: "8px",
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
              }}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-bold uppercase"
              style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
            >
              Payment Day
            </span>
            <input
              name="paymentDay"
              type="number"
              min="1"
              max="31"
              required
              defaultValue={defaultValues.paymentDay}
              className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
              style={{
                borderColor: "#C2C7CC",
                borderRadius: "8px",
                fontFamily: "var(--font-dm-sans)",
                color: "#002434",
              }}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span
            className="text-xs font-bold uppercase"
            style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B", letterSpacing: "1.1px", fontWeight: 700 }}
          >
            Interest Rate (%)
          </span>
          <input
            name="interestRate"
            type="number"
            step="0.001"
            required
            defaultValue={defaultValues.interestRate}
            className="w-full border bg-white px-4 py-3 text-sm outline-none transition-colors"
            style={{
              borderColor: "#C2C7CC",
              borderRadius: "8px",
              fontFamily: "var(--font-dm-sans)",
              color: "#002434",
            }}
          />
        </label>

        {state?.error && (
          <p className="text-sm" style={{ fontFamily: "var(--font-dm-sans)", color: "#DC2626" }}>
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 text-xs uppercase transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: "#002434",
              color: "#FFFFFF",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              lineHeight: "18px",
              letterSpacing: "1.2px",
              padding: "16px 32px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {pending ? "Saving..." : "SAVE CHANGES"}
          </button>
          <a
            href={`/cards/${cardId}`}
            className="text-xs uppercase no-underline"
            style={{
              fontFamily: "var(--font-dm-sans)",
              color: "#002434",
              letterSpacing: "1.1px",
              fontWeight: 400,
            }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
