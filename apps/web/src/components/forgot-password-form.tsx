"use client"

import { useActionState } from "react"
import { forgotPasswordAction } from "@/actions/password"

function ArrowLeft() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 5H1M5 9L1 5L5 1"
        stroke="#5D5F5C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null)

  const isSuccess = state?.success

  return (
    <div className="mx-auto w-full max-w-[448px]">
      {isSuccess ? (
        <div className="text-center">
          <h1
            className="text-[32px] leading-[38px] -tracking-[0.64px] sm:text-[48px] sm:leading-[52.8px] sm:-tracking-[0.96px]"
            style={{ fontFamily: "var(--font-literata)", color: "#002434" }}
          >
            Check your email
          </h1>
          <p
            className="mt-4 text-lg leading-[28.8px]"
            style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B" }}
          >
            We&apos;ve sent a password reset link to{" "}
            <strong>{state?.resetLink ? "your email" : ""}</strong>.
          </p>
        </div>
      ) : (
        <form action={formAction}>
          <h1
            className="text-center text-[28px] leading-[34px] -tracking-[0.56px] sm:text-[48px] sm:leading-[52.8px] sm:-tracking-[0.96px]"
            style={{ fontFamily: "var(--font-literata)", color: "#002434" }}
          >
            Reset your password
          </h1>
          <p
            className="mx-auto mt-[15px] max-w-[320px] text-center text-lg leading-[28.8px]"
            style={{ fontFamily: "var(--font-dm-sans)", color: "#42474B" }}
          >
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            <label className="relative">
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full border bg-white px-4 text-base outline-none transition-colors"
                style={{
                  height: "56px",
                  borderColor: "#C2C7CC",
                  color: "#002434",
                  fontFamily: "var(--font-dm-sans)",
                }}
              />
            </label>

            {state?.error && (
              <p className="text-[13px]" style={{ color: "#dc2626" }}>
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full border-none text-[12px] uppercase leading-3 tracking-[2.4px] text-white transition-opacity disabled:opacity-50"
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
                backgroundColor: "#002434",
                fontFamily: "var(--font-dm-sans)",
                boxShadow: "0px 1px 1px rgba(0,0,0,0.05)",
              }}
            >
              {pending ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </div>

          <div className="pt-8 text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-[12px] uppercase leading-3 tracking-[1.8px] no-underline transition-opacity hover:opacity-70"
              style={{ color: "#5D5F5C", fontFamily: "var(--font-dm-sans)" }}
            >
              <ArrowLeft />
              BACK TO SIGN IN
            </a>
          </div>
        </form>
      )}
    </div>
  )
}
