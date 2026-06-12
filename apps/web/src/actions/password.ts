"use server"

import { prisma } from "@creditview/database"
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation"
import { logAuditEvent } from "@/lib/audit"
import bcrypt from "bcryptjs"
import { randomUUID } from "node:crypto"

type PasswordState = {
  success: boolean
  error: string | null
  message: string | null
  resetLink: string | null
}

export async function forgotPasswordAction(
  _prevState: PasswordState | null,
  formData: FormData,
): Promise<PasswordState> {
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input", message: null, resetLink: null }
  }

  const { email } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return { success: false, error: "If the email exists, a reset link has been sent.", message: null, resetLink: null }
  }

  const token = randomUUID() + randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.resetToken.deleteMany({ where: { userId: user.id, usedAt: null } })
  await prisma.resetToken.create({ data: { userId: user.id, token, expiresAt } })

  await logAuditEvent({
    userId: user.id,
    entity: "User",
    entityId: user.id,
    action: "FORGOT_PASSWORD",
  })

  return {
    success: true,
    error: null,
    message: "Reset link generated (MVP):",
    resetLink: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}`,
  }
}

export async function resetPasswordAction(
  _prevState: PasswordState | null,
  formData: FormData,
): Promise<PasswordState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input", message: null, resetLink: null }
  }

  const { token, password } = parsed.data

  const resetToken = await prisma.resetToken.findUnique({ where: { token } })
  if (!resetToken) {
    return { success: false, error: "Invalid or expired reset token", message: null, resetLink: null }
  }

  if (resetToken.usedAt) {
    return { success: false, error: "This reset token has already been used", message: null, resetLink: null }
  }

  if (resetToken.expiresAt < new Date()) {
    return { success: false, error: "This reset token has expired", message: null, resetLink: null }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  })

  await prisma.resetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  })

  await logAuditEvent({
    userId: resetToken.userId,
    entity: "User",
    entityId: resetToken.userId,
    action: "RESET_PASSWORD",
  })

  return { success: true, error: null, message: "Password reset successfully. You can now sign in.", resetLink: null }
}
