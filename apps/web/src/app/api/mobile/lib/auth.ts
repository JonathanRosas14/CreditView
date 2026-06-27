import { NextResponse } from "next/server"
import { verifyToken, type JwtPayload } from "./jwt"

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function verifyMobileToken(request: Request): Promise<JwtPayload> {
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) throw unauthorized()

  const token = authHeader.slice(7)
  const payload = await verifyToken(token)
  if (!payload) throw unauthorized()

  return payload
}
