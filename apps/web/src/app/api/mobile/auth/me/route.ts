import { NextResponse } from "next/server"
import { verifyMobileToken, unauthorized } from "../../lib/auth"

export async function GET(request: Request) {
  try {
    const payload = await verifyMobileToken(request)
    return NextResponse.json({ id: payload.sub, email: payload.email, name: payload.name })
  } catch (e) {
    if (e instanceof Response) return e
    return unauthorized()
  }
}
