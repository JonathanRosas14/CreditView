import type { Metadata } from "next"
import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/reset-password-form"

export const metadata: Metadata = { title: "Reset Password" }

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-sm" style={{ color: "#72787C" }}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
