"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { revalidatePath } from "next/cache"

function getNextDate(dayOfMonth: number): { date: Date; label: string } {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  let next = new Date(currentYear, currentMonth, dayOfMonth)
  const label = next.toLocaleDateString("es", { day: "numeric", month: "long" })

  if (next < today) {
    next = new Date(currentYear, currentMonth + 1, dayOfMonth)
  }

  return { date: next, label }
}

export async function generateAlerts() {
  const user = await verifySession()

  const cards = await prisma.card.findMany({
    where: { userId: user.id, isActive: true },
  })

  const now = new Date()
  const threshold = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const DAY_MS = 24 * 60 * 60 * 1000

  for (const card of cards) {
    for (const event of [
      { day: card.cutoffDay, type: "CUTOFF" as const, template: " cutta en " },
      { day: card.paymentDay, type: "PAYMENT" as const, template: " vence en " },
    ]) {
      const { date: nextDate, label } = getNextDate(event.day)
      const diffMs = nextDate.getTime() - now.getTime()
      const daysUntil = Math.round(diffMs / DAY_MS)

      if (daysUntil >= 0 && daysUntil <= 3) {
        const dayText = daysUntil === 0 ? "hoy" : daysUntil === 1 ? "mañana" : `en ${daysUntil} días`
        const message = `${card.name} ${event.type === "CUTOFF" ? "corta" : "vence"} ${dayText} (${label})`

        const existing = await prisma.alert.findFirst({
          where: {
            userId: user.id,
            cardId: card.id,
            type: event.type,
            date: { gte: new Date(now.getTime() - DAY_MS) },
            message,
          },
        })

        if (!existing) {
          await prisma.alert.create({
            data: {
              userId: user.id,
              cardId: card.id,
              type: event.type,
              message,
              date: nextDate,
              sentAt: now,
            },
          })
        }
      }
    }
  }
}

export async function getAlerts() {
  const user = await verifySession()

  await generateAlerts()

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
    include: { card: { select: { name: true } } },
  })

  return alerts.map((a) => ({
    id: a.id,
    type: a.type,
    message: a.message,
    date: a.date.toISOString(),
    isRead: a.isRead,
    cardName: a.card.name,
  }))
}

export async function getUnreadAlertCount() {
  const user = await verifySession()

  const count = await prisma.alert.count({
    where: { userId: user.id, isRead: false },
  })

  return count
}

export async function markAlertAsRead(id: string) {
  const user = await verifySession()

  const alert = await prisma.alert.findUnique({ where: { id } })
  if (!alert || alert.userId !== user.id) return

  await prisma.alert.update({
    where: { id },
    data: { isRead: true },
  })

  revalidatePath("/dashboard")
}

export async function markAllAlertsAsRead() {
  const user = await verifySession()

  await prisma.alert.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  })

  revalidatePath("/dashboard")
}
