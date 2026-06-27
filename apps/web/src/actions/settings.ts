"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { signOut } from "@/lib/auth"
import { logAuditEvent } from "@/lib/audit"
import { checkRateLimit } from "@/lib/rate-limit"

export async function deleteAccountAction() {
  const user = await verifySession()
  const { limited } = await checkRateLimit(user.id, { maxRequests: 3, windowMs: 60_000 })
  if (limited) throw new Error("Too many requests. Try again later.")

  if (user.email === "demo@creditview.app") {
    throw new Error("The demo account cannot be deleted. Create a new account to test deletion.")
  }

  await logAuditEvent({
    userId: user.id,
    entity: "User",
    entityId: user.id,
    action: "DELETE",
    oldValue: { email: user.email },
  })

  await prisma.user.delete({ where: { id: user.id } })
  await signOut({ redirect: false })
}
