import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-sm text-zinc-500">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
