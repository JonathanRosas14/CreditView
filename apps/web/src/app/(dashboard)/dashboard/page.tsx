import { PrismaCardRepository, PrismaTransactionRepository } from "@creditview/infra"
import { CardService } from "@creditview/core"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAlerts } from "@/actions/alerts"
import { AlertBanner } from "@/components/alert-banner"

const cardRepo = new PrismaCardRepository()
const txRepo = new PrismaTransactionRepository()
const cardService = new CardService(cardRepo, txRepo)

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const cards = await cardService.getUserCards(session.user.id)
  const alerts = await getAlerts()

  const totalLimit = cards.reduce((sum, c) => sum + c.totalLimit.amount, 0)
  const totalUsed = cards.reduce((sum, c) => sum + c.usedBalance.amount, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <AlertBanner alerts={alerts} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Total Limit</p>
          <p className="text-2xl font-bold">${totalLimit.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Used Balance</p>
          <p className="text-2xl font-bold">${totalUsed.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Available</p>
          <p className="text-2xl font-bold">${(totalLimit - totalUsed).toFixed(2)}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Your Cards</h2>
        {cards.length === 0 ? (
          <p className="text-zinc-500">No cards yet. Add your first card.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <div key={card.id} className="rounded-xl border p-4">
                <p className="font-medium">{card.name}</p>
                <p className="text-sm text-zinc-500">{card.bank}</p>
                <div className="mt-2 flex justify-between text-sm">
                  <span>Used: ${card.usedBalance.amount.toFixed(2)}</span>
                  <span>Limit: ${card.totalLimit.amount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
