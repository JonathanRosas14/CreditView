import { logoutAction } from "@/actions/auth"
import Link from "next/link"

export function Sidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  return (
    <aside className="flex w-64 flex-col border-r bg-zinc-50">
      <div className="flex h-14 items-center border-b px-4 font-bold">
        CreditView
      </div>

      <nav className="flex-1 space-y-1 p-2">
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/cards" label="Cards" />
        <NavItem href="/transactions" label="Transactions" />
        <NavItem href="/reports" label="Reports" />
        <NavItem href="/settings" label="Settings" />
      </nav>

      <div className="border-t p-4">
        <p className="text-sm font-medium">{user.name ?? user.email}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="mt-2 text-sm text-zinc-500 hover:text-zinc-900"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
    >
      {label}
    </Link>
  )
}
