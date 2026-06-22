"use client"

import { useActionState } from "react"
import { createBudgetAction } from "@/actions/budgets"
import { Breadcrumb } from "@/components/breadcrumb"

export default function NewBudgetPage() {
  const [state, formAction, pending] = useActionState(createBudgetAction, {
    success: false,
    error: null,
  })

  if (state?.success) {
    return (
      <div className="space-y-8">
      <Breadcrumb pages="New Budget" />
      <h1
          style={{
            fontFamily: "var(--font-literata)",
            fontWeight: 400,
            fontSize: 32,
            lineHeight: "48px",
            color: "#002434",
          }}
        >
          New Budget
        </h1>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            border: "1px solid #C2C7CC",
            padding: 32,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: 16,
              color: "#16A34A",
            }}
          >
            Budget created successfully!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1
        style={{
          fontFamily: "var(--font-literata)",
          fontWeight: 400,
          fontSize: 32,
          lineHeight: "48px",
          color: "#002434",
        }}
      >
        New Budget
      </h1>

      <form
        action={formAction}
        style={{
          maxWidth: 480,
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid #C2C7CC",
          padding: 24,
        }}
        className="w-full space-y-5 sm:p-8"
      >
        <label className="flex flex-col gap-1.5">
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: "18px",
              letterSpacing: "1.1px",
              color: "#42474B",
              textTransform: "uppercase",
            }}
          >
            Category
          </span>
          <input
            name="category"
            required
            placeholder="e.g. Groceries, Entertainment"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              color: "#002434",
              border: "1px solid #C2C7CC",
              borderRadius: 8,
              padding: "12px 16px",
              outline: "none",
            }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: "18px",
              letterSpacing: "1.1px",
              color: "#42474B",
              textTransform: "uppercase",
            }}
          >
            Amount
          </span>
          <input
            name="amount"
            type="number"
            step="0.01"
            required
            placeholder="0.00"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              color: "#002434",
              border: "1px solid #C2C7CC",
              borderRadius: 8,
              padding: "12px 16px",
              outline: "none",
            }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: "18px",
              letterSpacing: "1.1px",
              color: "#42474B",
              textTransform: "uppercase",
            }}
          >
            Period
          </span>
          <select
            name="period"
            required
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              color: "#002434",
              border: "1px solid #C2C7CC",
              borderRadius: 8,
              padding: "12px 16px",
              outline: "none",
              background: "#FFFFFF",
            }}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: "18px",
              letterSpacing: "1.1px",
              color: "#42474B",
              textTransform: "uppercase",
            }}
          >
            Start Date
          </span>
          <input
            name="startDate"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              color: "#002434",
              border: "1px solid #C2C7CC",
              borderRadius: 8,
              padding: "12px 16px",
              outline: "none",
            }}
          />
        </label>

        {state?.error && (
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 13,
              color: "#DC2626",
            }}
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "18px",
            letterSpacing: "1.2px",
            color: "#FFFFFF",
            backgroundColor: "#002434",
            padding: "16px 32px",
            borderRadius: 12,
            border: "none",
            cursor: pending ? "not-allowed" : "pointer",
            opacity: pending ? 0.6 : 1,
            textTransform: "uppercase",
          }}
        >
          {pending ? "Saving..." : "Create Budget"}
        </button>
      </form>
    </div>
  )
}
