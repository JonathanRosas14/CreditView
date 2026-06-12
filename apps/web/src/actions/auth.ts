"use server"

import { signIn, signOut } from "@/lib/auth"

export async function loginAction(_prevState: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    })
    return { success: true, error: null }
  } catch {
    return { success: false, error: "Invalid email or password" }
  }
}

export async function logoutAction() {
  await signOut({ redirect: true })
}
