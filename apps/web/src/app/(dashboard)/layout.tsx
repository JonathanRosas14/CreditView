import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex h-screen">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
