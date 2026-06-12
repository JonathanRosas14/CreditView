"use client"

import { useActionState } from "react"
import { resetPasswordAction } from "@/actions/password"
import { useSearchParams } from "next/navigation"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [state, formAction, pending] = useActionState(resetPasswordAction, null)

  if (state?.message && !state?.error) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-sm">
        <h1 className="text-xl font-bold">CreditView</h1>
        <p className="text-sm text-green-600">{state.message}</p>
        <a
          href="/login"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white"
        >
          Sign in
        </a>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold">CreditView</h1>
      <p className="text-sm text-zinc-500">Enter your new password</p>

      <input type="hidden" name="token" value={token} />

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">New Password</span>
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
        {pending ? "Resetting..." : "Reset password"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        <a href="/login" className="text-zinc-900 underline">
          Back to sign in
        </a>
      </p>
    </form>
  )
}
