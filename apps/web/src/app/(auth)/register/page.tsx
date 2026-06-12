import type { Metadata } from "next"
import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = { title: "Register" }

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm />
    </div>
  )
}
