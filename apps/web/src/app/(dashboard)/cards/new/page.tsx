import type { Metadata } from "next"
import { CreateCardForm } from "@/components/create-card-form"

export const metadata: Metadata = { title: "Add Card" }

export default function NewCardPage() {
  return (
    <div>
      <CreateCardForm />
    </div>
  )
}
