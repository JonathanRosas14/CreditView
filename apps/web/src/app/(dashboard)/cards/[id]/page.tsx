import { getCard, getCardTransactions } from "@/actions/queries"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [card, transactions] = await Promise.all([
    getCard(id),
    getCardTransactions(id),
  ])

  if (!card) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/cards" className="text-sm text-zinc-500 hover:text-zinc-900">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold">{card.name}</h1>
          <p className="text-zinc-500">
            {card.bank} &middot; {card.currencyCode}
          </p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">
          {card.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Total Limit</p>
          <p className="text-2xl font-bold">${card.totalLimit.amount.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Used</p>
          <p className="text-2xl font-bold">${card.usedBalance.amount.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Available</p>
          <p className="text-2xl font-bold">${card.availableBalance.amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="font-semibold">Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-4 text-sm text-zinc-500">No transactions yet.</p>
        ) : (
          <div className="divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-zinc-500">
                    {tx.date.toLocaleDateString()} &middot; {tx.type}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  ${tx.amount.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
