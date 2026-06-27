import { NextResponse } from "next/server"
import { prisma } from "@creditview/database"
import { verifyMobileToken, unauthorized } from "../../lib/auth"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await verifyMobileToken(request)
    const { id } = await params

    const budget = await prisma.budget.findUnique({ where: { id } })
    if (!budget || budget.userId !== payload.sub) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    await prisma.budget.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof Response) return e
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
