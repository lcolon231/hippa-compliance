import { prisma } from "@/lib/prisma";

/**
 * Records a sensitive action to the audit trail. Best-effort: a logging
 * failure must never block the underlying action, so errors are swallowed
 * (and reported) rather than thrown.
 */
export async function logAudit(entry: {
  organizationId: string;
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: entry.organizationId,
        actorId: entry.actorId ?? null,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId ?? null,
        metadata: entry.metadata,
      },
    });
  } catch (err) {
    console.error(`Failed to write audit log for ${entry.action}`, err);
  }
}
