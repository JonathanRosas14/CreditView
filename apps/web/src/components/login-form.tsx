"use client"

import { useActionState } from "react"
import { loginAction } from "@/actions/auth"

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {
    success: false,
    error: "",
  })

  return (
    <form action={formAction} className="w-full max-w-[384px]">
      <h1
        className="text-[32px] leading-[38px] -tracking-[0.64px] sm:text-[48px] sm:leading-[52.8px] sm:-tracking-[0.96px]"
        style={{ fontFamily: "var(--font-literata)", color: "#002434" }}
      >
        Welcome back
      </h1>
      <p
        className="mt-3 text-xs uppercase leading-3 tracking-[1.8px]"
        style={{ color: "#42474B" }}
      >
        SIGN IN TO YOUR ACCOUNT
      </p>

      <div className="mt-[31px] flex flex-col gap-6">
        <label className="relative">
          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="w-full border px-4 text-base leading-6 outline-none transition-colors"
            style={{
              height: "56px",
              borderColor: "#C2C7CC",
              borderRadius: "8px",
              color: "#002434",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
        </label>

        <label className="relative">
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full border px-4 text-base leading-6 outline-none transition-colors"
            style={{
              height: "56px",
              borderColor: "#C2C7CC",
              borderRadius: "8px",
              color: "#002434",
              fontFamily: "var(--font-dm-sans)",
            }}
          />
        </label>

        {state?.error && (
          <p className="text-sm" style={{ color: "#dc2626" }}>
            {state.error}
          </p>
        )}

        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-[13px] leading-[18.2px] no-underline transition-opacity hover:opacity-70"
            style={{ color: "#5D5F5C", fontFamily: "var(--font-dm-sans)" }}
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full border-none text-xs font-normal uppercase leading-3 tracking-[1.2px] text-white transition-opacity disabled:opacity-50"
          style={{
            height: "56px",
            borderRadius: "8px",
            backgroundColor: "#002434",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          {pending ? "Signing in..." : "SIGN IN"}
        </button>
      </div>

      <div className="mt-[31px] flex items-center gap-4">
        <div className="flex-1" style={{ height: "1px", backgroundColor: "#C2C7CC" }} />
          <span
            className="text-[13px] leading-[18.2px]"
            style={{ color: "#42474B", fontFamily: "var(--font-dm-sans)" }}
          >
            Don&apos;t have an account?
        </span>
        <div className="flex-1" style={{ height: "1px", backgroundColor: "#C2C7CC" }} />
      </div>

      <div className="mt-[31px] flex justify-center">
        <a
          href="/register"
          className="inline-block border text-xs font-normal uppercase leading-3 tracking-[1.8px] no-underline transition-opacity hover:opacity-70"
          style={{
            padding: "15px 33px",
            borderRadius: "9999px",
            borderColor: "#C2C7CC",
            color: "#002434",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          CREATE ACCOUNT
        </a>
      </div>
    </form>
  )
}
