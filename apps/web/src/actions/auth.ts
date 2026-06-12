"use server"

import { redirect } from "next/navigation"
import { signIn, signOut } from "@/lib/auth"
import { loginSchema } from "@/lib/validation"

export async function loginAction(_prevState: unknown, formData: FormData) {
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
    if (error instanceof Error && error.message?.includes("NEXT_REDIRECT")) {
      throw error
    }
    return { success: false, error: "Invalid email or password" }
  }
}

export async function logoutAction() {
  await signOut({ redirect: true })
}
