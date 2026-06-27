import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@creditview/database"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signToken } from "../../lib/jwt"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { limited } = await checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 })
  if (limited) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const { email, password } = parsed.data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = await signToken({ sub: user.id, email: user.email, name: user.name })

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
