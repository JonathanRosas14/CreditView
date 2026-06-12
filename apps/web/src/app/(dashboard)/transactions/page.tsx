import type { Metadata } from "next"
import { getCards } from "@/actions/queries"
import { ExportButton } from "./export-button"

export const metadata: Metadata = { title: "Transactions" }

export default async function TransactionsPage() {
  const cards = await getCards()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <ExportButton />
      </div>
      <p className="text-zinc-500">
        Select a card to view its transactions.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.id}
            href={`/cards/${card.id}`}
            className="rounded-xl border p-4 hover:bg-zinc-50"
          >
            <p className="font-semibold">{card.name}</p>
            <p className="text-sm text-zinc-500">{card.bank}</p>
          </a>
        ))}
        {cards.length === 0 && (
          <p className="col-span-full text-sm text-zinc-500">
            No cards yet. <a href="/cards/new" className="underline">Add one</a>.
          </p>
        )}
      </div>
    </div>
  )
}
