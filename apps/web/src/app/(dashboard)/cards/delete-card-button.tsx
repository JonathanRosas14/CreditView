"use client"

import { useActionState } from "react"
import { deleteCardAction } from "@/actions/cards"
import { useRouter } from "next/navigation"

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (confirm("Delete this card?")) {
      await deleteCardAction(cardId)
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700"
    >
      Delete
    </button>
  )
}
