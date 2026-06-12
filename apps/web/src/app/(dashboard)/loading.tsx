export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-zinc-200" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border bg-zinc-50" />
        ))}
      </div>
      <div className="h-6 w-32 rounded bg-zinc-200" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl border bg-zinc-50" />
        ))}
      </div>
    </div>
  )
}
