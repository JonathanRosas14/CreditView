"use client"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-sm text-zinc-500">
        {error.message || "A server error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  )
}
