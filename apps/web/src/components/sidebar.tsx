"use client"

import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useMobileMenu } from "@/components/mobile-menu-context"

const navItems = [
  {
    href: "/dashboard",
    label: "DASHBOARD",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="5.4" height="5.4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="8.1" y="0.5" width="5.4" height="5.4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="0.5" y="8.1" width="5.4" height="5.4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="8.1" y="8.1" width="5.4" height="5.4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: "/cards",
    label: "CARDS",
    icon: (
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="0.5" y1="4.5" x2="15.5" y2="4.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="10" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "TRANSACTIONS",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.5" y1="2.5" x2="13.5" y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0.5" y1="7.5" x2="13.5" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="0.5" y1="12.5" x2="13.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/statements",
    label: "STATEMENTS",
    icon: (
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 0.5H10C10.8284 0.5 11.5 1.17157 11.5 2V12C11.5 12.8284 10.8284 13.5 10 13.5H2C1.17157 13.5 0.5 12.8284 0.5 12V2C0.5 1.17157 1.17157 0.5 2 0.5Z" stroke="currentColor" strokeWidth="1.2" />
        <line x1="2.5" y1="3.5" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="2.5" y1="6.5" x2="9.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="2.5" y1="9.5" x2="7.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/budgets",
    label: "BUDGETS",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="7.5" width="5.4" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="8.1" y="0.5" width="5.4" height="13" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: "/reports",
    label: "REPORTS",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="8.4" width="3.4" height="5.2" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="5.3" y="4.2" width="3.4" height="9.4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
        <rect x="10.1" y="0.5" width="3.4" height="13.1" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "SETTINGS",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 0.5V2.5M7 11.5V13.5M2.5 7H0.5M13.5 7H11.5M3.9 3.9L2.5 2.5M11.5 11.5L10.1 10.1M10.1 3.9L11.5 2.5M3.9 10.1L2.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function Sidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname()
  const { open, close } = useMobileMenu()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={close}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:z-30`}
        style={{ backgroundColor: "#002434" }}
      >
      <div
        className="px-6 pb-[33px] pt-8"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-2xl -tracking-[0.6px]"
              style={{ fontFamily: "var(--font-literata)", fontWeight: 400, color: "#FFFFFF", lineHeight: "31.2px" }}
            >
              CreditView
            </p>
            <p
              className="mt-0 text-[10px] uppercase"
              style={{
                fontFamily: "var(--font-dm-sans)",
                color: "rgba(255,255,255,0.6)",
                lineHeight: "16px",
                letterSpacing: "2px",
                fontWeight: 400,
              }}
            >
              PREMIUM INTELLIGENCE
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="lg:hidden text-white/60 hover:text-white"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 pt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 text-[11px] uppercase transition-all"
              style={{
                fontFamily: "var(--font-dm-sans)",
                lineHeight: "17.6px",
                letterSpacing: "1.1px",
                fontWeight: 400,
                color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)",
                backgroundColor: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                borderLeft: isActive ? "2px solid #C7E7FC" : "2px solid transparent",
                padding: "12px 24px",
                paddingLeft: isActive ? "26px" : "24px",
                borderRadius: "0",
                textDecoration: "none",
              }}
            >
              <span className="shrink-0" style={{ color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.6)" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div
        className="px-6 pb-6 pt-[25px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <p
          className="text-base"
          style={{ fontFamily: "var(--font-dm-sans)", color: "#FFFFFF", lineHeight: "25.6px", fontWeight: 400 }}
        >
          {user.name ?? user.email}
        </p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-[7px] text-[11px] uppercase transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "rgba(255,255,255,0.4)",
            lineHeight: "17.6px",
            letterSpacing: "1.1px",
            fontWeight: 400,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          SIGN OUT
        </button>
      </div>
    </aside>
    </>
  )
}
