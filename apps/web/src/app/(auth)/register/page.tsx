import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = { title: "Register" }

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCF9F8]">
      <nav
        className="flex h-[65px] items-center justify-between px-16"
        style={{ borderBottom: "1px solid #C2C7CC" }}
      >
        <span
          className="text-2xl leading-[31.2px]"
          style={{ fontFamily: "var(--font-literata)", fontWeight: 600, color: "#002434" }}
        >
          CreditView
        </span>
          <Link
            href="/login"
            className="text-xs uppercase leading-3 tracking-[1.2px] no-underline"
          style={{ color: "#002434", fontFamily: "var(--font-dm-sans)" }}
        >
          SIGN IN
        </Link>
      </nav>
      <div className="flex flex-1 items-center py-20">
        <div className="w-[533px] shrink-0 pl-16">
          <RegisterForm />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "12px",
              boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <Image
              src="/assets/register-bg.png"
              alt=""
              className="block"
              width={523}
              height={768}
              style={{ height: "auto" }}
            />
            <div
              className="absolute rounded-lg p-[33px]"
              style={{
                bottom: "48px",
                left: "48px",
                right: "48px",
                background: "rgba(255,255,255,0.6)",
                border: "1px solid #E5E5E1",
                backdropFilter: "blur(5px)",
                borderRadius: "8px",
              }}
            >
              <p
                className="text-xs font-bold uppercase leading-3 tracking-[1.8px]"
                style={{ color: "#002434", fontFamily: "var(--font-dm-sans)" }}
              >
                ELITE INTELLIGENCE
              </p>
              <h2
                className="mt-2 text-2xl leading-[31.2px]"
                style={{
                  fontFamily: "var(--font-literata)",
                  fontWeight: 500,
                  color: "#002434",
                }}
              >
                Smart credit management at your fingertips
              </h2>
              <div className="my-4 h-px w-12" style={{ backgroundColor: "#C2C7CC" }} />
              <p
                className="text-sm leading-[18.2px]"
                style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
              >
                Consolidate your cards, track spending in real-time, and never miss a payment
                with intelligent alerts and actionable insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
