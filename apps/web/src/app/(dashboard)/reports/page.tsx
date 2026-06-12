import { getCards } from "@/actions/queries"

export default async function ReportsPage() {
  const cards = await getCards()

  const byCurrency = cards.reduce<Record<string, typeof cards>>((acc, card) => {
    const curr = card.currencyCode
    if (!acc[curr]) acc[curr] = []
    acc[curr].push(card)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      {Object.entries(byCurrency).map(([currency, group]) => {
        const totalLimit = group.reduce((s, c) => s + c.totalLimit.amount, 0)
        const totalUsed = group.reduce((s, c) => s + c.usedBalance.amount, 0)

        return (
          <div key={currency} className="rounded-xl border p-4">
            <h2 className="mb-3 text-lg font-semibold">{currency}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-zinc-500">Total Limit</p>
                <p className="text-xl font-bold">${totalLimit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Total Used</p>
                <p className="text-xl font-bold">${totalUsed.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Utilization</p>
                <p className="text-xl font-bold">
                  {totalLimit > 0
                    ? `${((totalUsed / totalLimit) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {group.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm"
                >
                  <span>{card.name}</span>
                  <span>
                    ${card.usedBalance.amount.toFixed(2)} / $
                    {card.totalLimit.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {cards.length === 0 && (
        <p className="text-zinc-500">No cards to report on.</p>
      )}
    </div>
  )
}
