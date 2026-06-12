import { prisma } from "@creditview/database"

export async function logAuditEvent(params: {
  userId: string
  entity: string
  entityId: string
  action: string
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
}) {
  await prisma.auditLog.create({ data: params as never })
}
