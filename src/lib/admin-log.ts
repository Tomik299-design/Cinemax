import { prisma } from "./prisma";
import { AdminAction } from "@prisma/client";

export async function logAdminAction(
  action: AdminAction,
  entity: string,
  adminId: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  await prisma.adminLog.create({
    data: { action, entity, adminId, entityId, details },
  });
}
