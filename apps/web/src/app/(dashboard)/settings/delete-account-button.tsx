"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { deleteAccountAction } from "@/actions/settings"

export function DeleteAccountButton() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setError(null)
    if (confirm("Delete your account? All cards, transactions, and data will be permanently removed.")) {
      try {
        await deleteAccountAction()
        router.push("/login")
      } catch (e) {
        setError((e as Error).message)
      }
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 400,
          fontSize: 12,
          lineHeight: "18px",
          letterSpacing: "1.2px",
          color: "#DC2626",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          textTransform: "uppercase",
        }}
      >
        Delete Account
      </button>
      {error && (
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 12,
            color: "#DC2626",
            marginTop: 8,
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
