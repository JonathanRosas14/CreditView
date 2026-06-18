import type { Metadata } from "next"
import { CreateCardForm } from "@/components/create-card-form"

export const metadata: Metadata = { title: "Add Card" }

export default function NewCardPage() {
  return (
    <div className="flex items-start justify-center pt-8">
      <CreateCardForm />
    </div>
  )
}
