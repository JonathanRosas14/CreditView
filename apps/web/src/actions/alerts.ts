"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { revalidatePath } from "next/cache"
import { checkRateLimit } from "@/lib/rate-limit"

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

export async function generateAlerts({
  userId,
  cards,
}: {
  userId: string
  cards: { id: string; name: string; cutoffDay: number; paymentDay: number }[]
}) {
  const now = new Date()
  const DAY_MS = 24 * 60 * 60 * 1000

  const entries: { userId: string; cardId: string; type: "CUTOFF" | "PAYMENT"; message: string; date: Date; sentAt: Date }[] = []

  for (const card of cards) {
    for (const event of [
      { day: card.cutoffDay, type: "CUTOFF" as const },
      { day: card.paymentDay, type: "PAYMENT" as const },
    ]) {
      const { date: nextDate, label } = getNextDate(event.day)
      const diffMs = nextDate.getTime() - now.getTime()
      const daysUntil = Math.round(diffMs / DAY_MS)

      if (daysUntil >= 0 && daysUntil <= 3) {
        const dayText = daysUntil === 0 ? "hoy" : daysUntil === 1 ? "mañana" : `en ${daysUntil} días`
        const message = `${card.name} ${event.type === "CUTOFF" ? "corta" : "vence"} ${dayText} (${label})`
        entries.push({ userId, cardId: card.id, type: event.type, message, date: nextDate, sentAt: now })
      }
    }
  }

  if (entries.length === 0) return

  const existing = await prisma.alert.findMany({
    where: {
      userId,
      OR: entries.map((e) => ({
        cardId: e.cardId,
        type: e.type,
        message: e.message,
        date: { gte: new Date(now.getTime() - DAY_MS) },
      })),
    },
    select: { cardId: true, type: true, message: true },
  })

  const existingSet = new Set(existing.map((e) => `${e.cardId}:${e.type}:${e.message}`))
  const newEntries = entries.filter((e) => !existingSet.has(`${e.cardId}:${e.type}:${e.message}`))

  if (newEntries.length > 0) {
    await prisma.alert.createMany({ data: newEntries })
  }
}

export async function getAlerts() {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) throw new Error("Too many requests. Try again later.")

  const cards = await prisma.card.findMany({
    where: { userId: user.id, isActive: true },
    select: { id: true, name: true, cutoffDay: true, paymentDay: true },
  })

  await generateAlerts({ userId: user.id, cards })

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
    include: { card: { select: { name: true } } },
  })

  return alerts.map((a: { id: string; type: string; message: string; date: Date; isRead: boolean; card: { name: string } }) => ({
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
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) throw new Error("Too many requests. Try again later.")

  const count = await prisma.alert.count({
    where: { userId: user.id, isRead: false },
  })

  return count
}

export async function markAlertAsRead(id: string) {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 30, windowMs: 60_000 })
  if (limited) return

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
  const { limited } = await checkRateLimit(user.id, { maxRequests: 10, windowMs: 60_000 })
  if (limited) return

  await prisma.alert.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  })

  revalidatePath("/dashboard")
}
