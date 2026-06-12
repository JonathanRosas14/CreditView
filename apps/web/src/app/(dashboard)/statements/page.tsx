import { getStatements } from "@/actions/statements"

export default async function StatementsPage() {
  const statements = await getStatements()

  const grouped = statements.reduce<
    Record<string, typeof statements>
  >((acc, s) => {
    const key = `${s.cardId}-${s.year}-${String(s.month).padStart(2, "0")}`
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Statements</h1>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-zinc-500">No statements available yet.</p>
      ) : (
        Object.entries(grouped).map(([key, group]) => {
          const s = group[0]
          return (
            <div key={key} className="rounded-xl border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{s.cardName}</h2>
                  <p className="text-sm text-zinc-500">
                    {s.bank} &middot; {s.currencyCode}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {s.month}/{s.year}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-zinc-500">Opening</p>
                  <p className="text-lg font-bold">
                    ${s.openingBalance.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Purchases</p>
                  <p className="text-lg font-bold text-red-600">
                    +${s.totalPurchases.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Payments</p>
                  <p className="text-lg font-bold text-green-600">
                    -${s.totalPayments.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Closing</p>
                  <p className="text-lg font-bold">
                    ${s.closingBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              <p className="mt-2 text-xs text-zinc-400">
                {s.transactionCount} transaction{s.transactionCount !== 1 ? "s" : ""}
              </p>
            </div>
          )
        })
      )}
    </div>
  )
}
