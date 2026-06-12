import type { Metadata } from "next"
import { getCards } from "@/actions/queries"
import Link from "next/link"

export const metadata: Metadata = { title: "Cards" }
import { DeleteCardButton } from "./delete-card-button"

export default async function CardsPage() {
  const cards = await getCards()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cards</h1>
        <Link
          href="/cards/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add Card
        </Link>
      </div>

      {cards.length === 0 ? (
        <p className="text-zinc-500">No cards yet. Add your first card.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.id} className="rounded-xl border p-4">
              <Link href={`/cards/${card.id}`} className="block">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{card.name}</p>
                    <p className="text-sm text-zinc-500">{card.bank}</p>
                  </div>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium">
                    {card.currencyCode}
                  </span>
                </div>
                <div className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Used</span>
                    <span className="font-medium">${card.usedBalance.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Available</span>
                    <span className="font-medium">${card.availableBalance.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Limit</span>
                    <span className="font-medium">${card.totalLimit.amount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className="h-full rounded-full bg-zinc-800"
                    style={{
                      width: `${Math.min((card.usedBalance.amount / card.totalLimit.amount) * 100, 100)}%`,
                    }}
                  />
                </div>
              </Link>
              <div className="mt-3 flex justify-end">
                <DeleteCardButton cardId={card.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
