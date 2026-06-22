import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileMenuProvider } from "@/components/mobile-menu-context"

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
    <MobileMenuProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: "#FCF9F8" }}>
        <Sidebar user={session.user} />
        <div className="flex-1 lg:pl-64">
          <DashboardHeader />
          <main className="px-4 pb-16 pt-[100px] sm:px-8 lg:px-16" style={{ paddingTop: "100px" }}>
            {children}
          </main>
        </div>
      </div>
    </MobileMenuProvider>
  )
}
