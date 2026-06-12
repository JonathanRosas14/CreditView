"use client"

import { useActionState } from "react"
import { registerAction } from "@/actions/auth"

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, {
    success: false,
    error: "",
  })

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold">CreditView</h1>
      <p className="text-sm text-zinc-500">Create your account</p>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Name</span>
        <input
          name="name"
          type="text"
          required
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </label>

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

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Confirm Password</span>
        <input
          name="confirmPassword"
          type="password"
          required
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </label>

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <a href="/login" className="text-zinc-900 underline">
          Sign in
        </a>
      </p>
    </form>
  )
}
