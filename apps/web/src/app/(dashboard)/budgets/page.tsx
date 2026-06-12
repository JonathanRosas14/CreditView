import type { Metadata } from "next"
import { getBudgets } from "@/actions/budgets"
import Link from "next/link"

export const metadata: Metadata = { title: "Budgets" }

export default async function BudgetsPage() {
  const budgets = await getBudgets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Link
          href="/budgets/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add Budget
        </Link>
      </div>

      {budgets.length === 0 ? (
        <p className="text-zinc-500">No budgets yet. Create your first budget.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => {
            const used = b.amount > 0 ? (b.spent / b.amount) * 100 : 0
            const remaining = b.amount - b.spent

            return (
              <div key={b.id} className="rounded-xl border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{b.category}</p>
                    <p className="text-xs text-zinc-500">
                      {b.period} &middot; {b.card?.name ?? "All cards"}
                    </p>
                  </div>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium">
                    {used.toFixed(0)}%
                  </span>
                </div>

                <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className={`h-full rounded-full ${used > 90 ? "bg-red-500" : used > 70 ? "bg-amber-500" : "bg-zinc-800"}`}
                    style={{ width: `${Math.min(used, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">
                    ${b.spent.toFixed(2)} spent
                  </span>
                  <span className="font-medium">
                    ${remaining.toFixed(2)} left
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
