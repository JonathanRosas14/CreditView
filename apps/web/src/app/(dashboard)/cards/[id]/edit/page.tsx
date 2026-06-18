import type { Metadata } from "next"
import { getCard } from "@/actions/queries"
import { notFound } from "next/navigation"
import { EditCardForm } from "@/components/edit-card-form"

export const metadata: Metadata = { title: "Edit Card" }

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await getCard(id)

  if (!card) notFound()

  return (
    <div className="flex items-start justify-center pt-8">
      <EditCardForm
        cardId={card.id}
        defaultValues={{
          name: card.name,
          bank: card.bank,
          totalLimit: card.totalLimit.amount,
          currencyCode: card.currencyCode,
          cutoffDay: card.cutoffDay,
          paymentDay: card.paymentDay,
          interestRate: card.interestRate,
        }}
      />
    </div>
  )
}
