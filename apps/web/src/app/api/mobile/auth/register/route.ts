import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@creditview/database"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { signToken } from "../../lib/jwt"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { limited } = await checkRateLimit(ip, { maxRequests: 3, windowMs: 60_000 })
  if (limited) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const token = await signToken({ sub: user.id, email: user.email, name: user.name })

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
