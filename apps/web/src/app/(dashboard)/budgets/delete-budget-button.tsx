"use client"

import { useRouter } from "next/navigation"
import { deleteBudgetAction } from "@/actions/budgets"

export function DeleteBudgetButton({ budgetId }: { budgetId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Delete this budget? This action cannot be undone.")) {
      try {
        await deleteBudgetAction(budgetId)
        router.refresh()
      } catch {
        // handled
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 400,
        fontSize: 11,
        lineHeight: "17.6px",
        letterSpacing: "1.1px",
        color: "#DC2626",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        textTransform: "uppercase",
      }}
    >
      DELETE
    </button>
  )
}
