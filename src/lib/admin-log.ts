import { prisma } from "./prisma";
import { AdminAction, Prisma } from "@prisma/client";
export async function logAdminAction(
  action: AdminAction,
  entity: string,
  adminId: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  await prisma.adminLog.create({
    data: {
      action,
      entity,
      adminId,
      entityId,
      details: details as Prisma.InputJsonValue | undefined,
    },
  });
}
