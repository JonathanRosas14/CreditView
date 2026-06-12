import type { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = { title: "Login" }

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  )
}
