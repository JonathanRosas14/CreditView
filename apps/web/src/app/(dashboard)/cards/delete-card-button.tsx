"use client"

import { useRouter } from "next/navigation"
import { deleteCardAction } from "@/actions/cards"

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Delete this card and all its transactions?")) {
      try {
        await deleteCardAction(cardId)
        router.refresh()
      } catch {
        // redirect handled by caller
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-[11px] uppercase"
      style={{
        fontFamily: "var(--font-dm-sans)",
        color: "#DC2626",
        letterSpacing: "1.1px",
        fontWeight: 400,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      DELETE
    </button>
  )
}
