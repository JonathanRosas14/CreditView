import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const metadata: Metadata = { title: "Home" }

export default async function Home() {
  const session = await auth()
  if (session?.user) redirect("/dashboard")
  redirect("/login")
}
