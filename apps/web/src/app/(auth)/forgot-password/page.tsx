import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export const metadata: Metadata = { title: "Forgot Password" }

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FCF9F8]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #002434 1px, transparent 1px),
            linear-gradient(180deg, #002434 1px, transparent 1px),
            radial-gradient(circle at 20% 50%, #002434 0%, transparent 1%),
            radial-gradient(circle at 80% 30%, #002434 0%, transparent 0.5%)
          `,
          backgroundSize: "60px 60px, 60px 60px, 200px 200px, 300px 300px",
          mixBlendMode: "multiply",
        }}
      />
      <header className="pt-[31px] pb-8 text-center">
        <span
          className="text-2xl leading-[31.2px]"
          style={{ fontFamily: "var(--font-literata)", color: "#002434" }}
        >
          CreditView
        </span>
      </header>
      <main className="flex flex-1 items-center justify-center px-5">
        <ForgotPasswordForm />
      </main>
      <footer className="px-16 pb-12 pt-2 text-center">
        <div className="mx-auto h-px w-full max-w-[448px]" style={{ backgroundColor: "#C2C7CC" }} />
        <p
          className="pt-5 text-[13px] leading-[18.2px]"
          style={{ color: "#5D5F5C", fontFamily: "var(--font-dm-sans)" }}
        >
          &copy; 2026 CreditView. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
