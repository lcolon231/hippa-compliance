"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  IncidentSeverity,
  IncidentStatus,
  BreachDetermination,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10_000),
  severity: z.nativeEnum(IncidentSeverity),
  occurredAt: z.string().nullable().optional(),
  phiInvolved: z.boolean(),
});

export async function createIncident(input: {
  title: string;
  description: string;
  severity: string;
  occurredAt: string | null;
  phiInvolved: boolean;
}) {
  // Any team member can report an incident — low-friction reporting matters.
  const user = await requireUser();
  const parsed = createSchema.parse(input);

  const incident = await prisma.incident.create({
    data: {
      organizationId: user.organizationId,
      reportedById: user.id,
      title: parsed.title,
      description: parsed.description,
      severity: parsed.severity,
      phiInvolved: parsed.phiInvolved,
      occurredAt: parsed.occurredAt ? new Date(parsed.occurredAt) : null,
    },
  });

  await logAudit({
    organizationId: user.organizationId,
    actorId: user.id,
    action: "incident.create",
    targetType: "Incident",
    targetId: incident.id,
    metadata: { severity: parsed.severity, phiInvolved: parsed.phiInvolved },
  });

  revalidatePath("/incidents");
  return { id: incident.id };
}

const updateSchema = z.object({
  status: z.nativeEnum(IncidentStatus).optional(),
  severity: z.nativeEnum(IncidentSeverity).optional(),
  determination: z.nativeEnum(BreachDetermination).optional(),
  individualsAffected: z.number().int().min(0).max(100_000_000).nullable().optional(),
  phiInvolved: z.boolean().optional(),
  notifiedAt: z.string().nullable().optional(),
});

export async function updateIncident(
  incidentId: string,
  input: z.infer<typeof updateSchema>
) {
  // Editing the investigation/breach analysis is an admin action.
  const admin = await requireAdmin();
  const parsed = updateSchema.parse(input);

  const incident = await prisma.incident.findFirst({
    where: { id: incidentId, organizationId: admin.organizationId },
    select: { id: true },
  });
  if (!incident) throw new Error("Incident not found");

  const resolving =
    parsed.status === "RESOLVED" || parsed.status === "CLOSED";

  await prisma.incident.update({
    where: { id: incident.id },
    data: {
      ...(parsed.status !== undefined && { status: parsed.status }),
      ...(parsed.severity !== undefined && { severity: parsed.severity }),
      ...(parsed.determination !== undefined && {
        determination: parsed.determination,
      }),
      ...(parsed.individualsAffected !== undefined && {
        individualsAffected: parsed.individualsAffected,
      }),
      ...(parsed.phiInvolved !== undefined && {
        phiInvolved: parsed.phiInvolved,
      }),
      ...(parsed.notifiedAt !== undefined && {
        notifiedAt: parsed.notifiedAt ? new Date(parsed.notifiedAt) : null,
      }),
      ...(resolving && { resolvedAt: new Date() }),
    },
  });

  await logAudit({
    organizationId: admin.organizationId,
    actorId: admin.id,
    action: "incident.update",
    targetType: "Incident",
    targetId: incident.id,
    metadata: { fieldsChanged: Object.keys(parsed) },
  });

  revalidatePath("/incidents");
  revalidatePath(`/incidents/${incidentId}`);
}
