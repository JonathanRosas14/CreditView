"use server"

import { prisma } from "@creditview/database"
import { verifySession } from "@/lib/dal"
import { signOut } from "@/lib/auth"

export async function deleteAccountAction() {
  const user = await verifySession()

  if (user.email === "demo@creditview.app") {
    throw new Error("The demo account cannot be deleted. Create a new account to test deletion.")
  }

  await prisma.user.delete({ where: { id: user.id } })
  await signOut({ redirect: false })
}
