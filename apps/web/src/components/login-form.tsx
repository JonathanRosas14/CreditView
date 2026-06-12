"use client"

import { useActionState } from "react"
import { loginAction } from "@/actions/auth"

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {
    success: false,
    error: "",
  })

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold">CreditView</h1>
      <p className="text-sm text-zinc-500">Sign in to your account</p>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </label>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-xs text-zinc-500 underline hover:text-zinc-900"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <a href="/register" className="text-zinc-900 underline">
          Create one
        </a>
      </p>
    </form>
  )
}
