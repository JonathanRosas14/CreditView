"use server"

import { redirect, unstable_rethrow } from "next/navigation"
import { headers } from "next/headers"
import { signIn, signOut } from "@/lib/auth"
import { loginSchema, registerSchema } from "@/lib/validation"
import { prisma } from "@creditview/database"
import bcrypt from "bcryptjs"
import { logAuditEvent } from "@/lib/audit"
import { checkRateLimit } from "@/lib/rate-limit"

async function getActionIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return h.get("x-real-ip") ?? "127.0.0.1"
}

export async function loginAction(_prevState: unknown, formData: FormData) {
  const ip = await getActionIp()
  const { limited } = await checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
  if (limited) {
    return { success: false, error: "Too many attempts. Try again later." }
  }

  try {
    const parsed = loginSchema.safeParse(Object.fromEntries(formData))
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
    }

    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
    })

    redirect("/dashboard")
  } catch (error) {
    unstable_rethrow(error)
    return { success: false, error: "Invalid email or password" }
  }
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const ip = await getActionIp()
  const { limited } = await checkRateLimit(ip, { maxRequests: 3, windowMs: 60_000 })
  if (limited) {
    return { success: false, error: "Too many requests. Try again later." }
  }

  try {
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

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    await logAuditEvent({
      userId: user.id,
      entity: "User",
      entityId: user.id,
      action: "REGISTER",
    })

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    redirect("/dashboard")
  } catch (error) {
    unstable_rethrow(error)
    return { success: false, error: "Registration failed" }
  }
}

export async function logoutAction() {
  await signOut({ redirect: true })
}
