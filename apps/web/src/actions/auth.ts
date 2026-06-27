"use server"

import { redirect, unstable_rethrow } from "next/navigation"
import { signIn, signOut } from "@/lib/auth"
import { loginSchema, registerSchema } from "@/lib/validation"
import { prisma } from "@creditview/database"
import bcrypt from "bcryptjs"
import { logAuditEvent } from "@/lib/audit"
import { getActionIp, checkRateLimit } from "@/lib/rate-limit"

export async function loginAction(_prevState: unknown, formData: FormData) {
  const ip = await getActionIp()
  const { limited } = await checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
  if (limited) {
    return { success: false, error: "Too many requests. Try again later." }
  }

  const parsed = loginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: "Invalid email or password" }
  }
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const ip = await getActionIp()
  const { limited } = await checkRateLimit(ip, { maxRequests: 3, windowMs: 60_000 })
  if (limited) {
    return { success: false, error: "Too many requests. Try again later." }
  }

  const parsed = registerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { success: false, error: "Email already registered" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  await logAuditEvent({
    userId: "",
    entity: "User",
    entityId: email,
    action: "REGISTER",
  })

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch {
    redirect("/login")
  }

  redirect("/dashboard")
}

export async function logoutAction() {
  await signOut({ redirect: false })
  redirect("/login")
}
