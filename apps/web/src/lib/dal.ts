import { cache } from "react"
import { auth } from "./auth"

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return session.user
})

export const verifySession = cache(async () => {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  return user
})
