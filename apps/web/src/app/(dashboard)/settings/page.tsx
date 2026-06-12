import { auth } from "@/lib/auth"

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="max-w-lg rounded-xl border p-4">
        <h2 className="mb-3 font-semibold">Profile</h2>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-zinc-500">Name:</span>
            <span className="ml-2">{session?.user?.name ?? "—"}</span>
          </div>
          <div>
            <span className="text-zinc-500">Email:</span>
            <span className="ml-2">{session?.user?.email ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
