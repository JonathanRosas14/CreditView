"use client"

import { useActionState } from "react"
import { markAlertAsRead, markAllAlertsAsRead } from "@/actions/alerts"
import type { AlertType } from "@creditview/shared"

interface AlertItem {
  id: string
  type: string
  message: string
  date: string
  isRead: boolean
  cardName: string
}

export function AlertBanner({ alerts }: { alerts: AlertItem[] }) {
  const unread = alerts.filter((a) => !a.isRead)

  if (unread.length === 0) return null

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Alertas ({unread.length})
        </h2>
        <form action={markAllAlertsAsRead}>
          <button
            type="submit"
            className="text-xs text-zinc-500 hover:text-zinc-800"
          >
            Marcar todas como leídas
          </button>
        </form>
      </div>
      <div className="space-y-2">
        {unread.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  )
}

function AlertItem({ alert }: { alert: AlertItem }) {
  const [, formAction] = useActionState(markAlertAsRead.bind(null, alert.id), null)

  const colors =
    alert.type === "PAYMENT"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-amber-200 bg-amber-50 text-amber-800"

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${colors}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider">
          {alert.type === "PAYMENT" ? "Pago" : "Corte"}
        </span>
        <span>{alert.message}</span>
      </div>
      <form action={formAction}>
        <button
          type="submit"
          className="shrink-0 rounded px-2 py-1 text-xs font-medium hover:bg-black/5"
        >
          ×
        </button>
      </form>
    </div>
  )
}
