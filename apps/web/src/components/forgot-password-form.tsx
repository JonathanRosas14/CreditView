"use client"

import { useActionState } from "react"
import { forgotPasswordAction } from "@/actions/password"

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null)

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-4 rounded-xl border p-6 shadow-sm"
    >
      <h1 className="text-xl font-bold">CreditView</h1>
      <p className="text-sm text-zinc-500">Reset your password</p>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </label>

      {state?.message && (
        <p className="text-sm text-green-600">{state.message}</p>
      )}

      {state?.resetLink && (
        <div className="rounded-lg bg-zinc-100 p-3 text-xs break-all">
          <p className="font-medium text-zinc-700 mb-1">Reset link (MVP):</p>
          <a href={state.resetLink} className="text-blue-600 underline">
            {state.resetLink}
          </a>
        </div>
      )}

      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Sending..." : "Send reset link"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        <a href="/login" className="text-zinc-900 underline">
          Back to sign in
        </a>
      </p>
    </form>
  )
}
