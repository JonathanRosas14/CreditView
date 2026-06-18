import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

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
    <div className="flex min-h-screen" style={{ backgroundColor: "#FCF9F8" }}>
      <Sidebar user={session.user} />
      <div className="flex-1 pl-64">
        <DashboardHeader />
        <main className="px-16 pb-16" style={{ paddingTop: "127px" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
