import { NextResponse } from "next/server"
import { verifyMobileToken, unauthorized } from "../../lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    const { limited } = await checkRateLimit(`mobile:${payload.sub}`, { maxRequests: 30, windowMs: 60_000 })
    if (limited) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }
    return NextResponse.json({ id: payload.sub, email: payload.email, name: payload.name })
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}
