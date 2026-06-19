"use client"

import { useActionState, useState } from "react"
import { registerAction } from "@/actions/auth"

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]

  return (
    <div className="flex gap-1">
      {checks.map((pass, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-colors"
          style={{
            backgroundColor: pass ? "#002434" : "#C2C7CC",
          }}
        />
      ))}
    </div>
  )
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, {
    success: false,
    error: "",
  })
  const [password, setPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  return (
    <form action={formAction} className="w-full max-w-[448px]">
      <p
        className="text-[12px] uppercase leading-3 tracking-[1.8px]"
        style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
      >
        START TRACKING YOUR CREDIT CARDS
      </p>
      <h1
        className="mt-[15px] text-[48px] leading-[52.8px] -tracking-[0.96px]"
        style={{ fontFamily: "var(--font-literata)", fontWeight: 400, color: "#002434" }}
      >
        Create your
        <br />
        account
      </h1>

      <div className="mt-[33px] flex flex-col gap-8">
        <label className="flex flex-col">
          <span
            className="text-[12px] uppercase leading-3 tracking-[1.8px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            FULL NAME
          </span>
          <input
            name="name"
            type="text"
            required
            className="w-full border-0 border-b-2 bg-transparent pb-4 pt-[13px] text-base outline-none transition-colors focus:border-[#002434]"
            style={{
              borderColor: "#C2C7CC",
              color: "#002434",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
        </label>

        <label className="flex flex-col">
          <span
            className="text-[12px] uppercase leading-3 tracking-[1.8px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            EMAIL
          </span>
          <input
            name="email"
            type="email"
            required
            className="w-full border-0 border-b-2 bg-transparent pb-4 pt-[13px] text-base outline-none transition-colors focus:border-[#002434]"
            style={{
              borderColor: "#C2C7CC",
              color: "#002434",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
        </label>

        <label className="flex flex-col">
          <span
            className="text-[12px] uppercase leading-3 tracking-[1.8px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            PASSWORD
          </span>
          <input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-0 border-b-2 bg-transparent pb-4 pt-[13px] text-base outline-none transition-colors focus:border-[#002434]"
            style={{
              borderColor: "#C2C7CC",
              color: "#002434",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
          <div className="mt-[7px]">
            <PasswordStrength password={password} />
          </div>
          <span
            className="mt-1 text-[13px] leading-[18.2px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            At least 8 characters with a number.
          </span>
        </label>

        <label className="flex flex-col">
          <span
            className="text-[12px] uppercase leading-3 tracking-[1.8px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            CONFIRM PASSWORD
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            className="w-full border-0 border-b-2 bg-transparent pb-4 pt-[13px] text-base outline-none transition-colors focus:border-[#002434]"
            style={{
              borderColor: "#C2C7CC",
              color: "#002434",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
        </label>

        <label className="relative flex cursor-pointer items-center gap-3">
          <input
            name="terms"
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="absolute inset-0 z-10 h-full w-full opacity-0"
          />
          <span
            className="pointer-events-none flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
            style={{
              borderColor: termsAccepted ? "#002434" : "#C2C7CC",
              backgroundColor: termsAccepted ? "#002434" : "#FFFFFF",
            }}
          >
            {termsAccepted && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span
            className="pointer-events-none text-[13px] leading-[18.2px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            I agree to the{" "}
            <a href="#" className="underline" style={{ color: "#002434" }}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline" style={{ color: "#002434" }}>
              Privacy Policy
            </a>
          </span>
        </label>

        {state?.error && (
          <p className="text-[13px]" style={{ color: "#dc2626" }}>
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full border-none text-[12px] uppercase leading-3 tracking-[1.2px] text-white transition-opacity disabled:opacity-50"
          style={{
            paddingTop: "20px",
            paddingBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "#002434",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {pending ? "Creating account..." : "CREATE ACCOUNT"}
        </button>
      </div>

      <p
        className="mt-[17px] text-center text-base leading-[25.6px]"
        style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
      >
        Already have an account?{" "}
        <a
          href="/login"
          className="no-underline"
          style={{ color: "#002434", fontFamily: "var(--font-dm-sans)" }}
        >
          Log in
        </a>
      </p>
    </form>
  )
}
