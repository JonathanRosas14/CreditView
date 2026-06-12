import { cache } from "react"
import { auth } from "./auth"

export interface SessionUser {
  id: string
  email: string
  name: string | null
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth()
  if (!session?.user?.id) return null
  return { id: session.user.id, email: session.user.email ?? "", name: session.user.name ?? null }
})

export const verifySession = cache(async (): Promise<SessionUser> => {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  return user
})
