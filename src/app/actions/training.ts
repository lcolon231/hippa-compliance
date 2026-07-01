"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

const createSchema = z.object({
  personName: z.string().trim().min(1).max(120),
  courseName: z.string().trim().min(1).max(200),
  completedAt: z.string().min(1), // yyyy-mm-dd
  expiresAt: z.string().nullable().optional(),
  notes: z.string().max(2_000).nullable().optional(),
});

export async function createTrainingRecord(input: {
  personName: string;
  courseName: string;
  completedAt: string;
  expiresAt: string | null;
  notes: string | null;
}) {
  const user = await requireUser();
  const parsed = createSchema.parse(input);

  const record = await prisma.trainingRecord.create({
    data: {
      organizationId: user.organizationId,
      personName: parsed.personName,
      courseName: parsed.courseName,
      completedAt: new Date(parsed.completedAt),
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      notes: parsed.notes || null,
    },
  });

  await logAudit({
    organizationId: user.organizationId,
    actorId: user.id,
    action: "training.create",
    targetType: "TrainingRecord",
    targetId: record.id,
    metadata: { personName: parsed.personName, courseName: parsed.courseName },
  });

  revalidatePath("/training");
}

export async function deleteTrainingRecord(recordId: string) {
  const admin = await requireAdmin();

  const record = await prisma.trainingRecord.findFirst({
    where: { id: recordId, organizationId: admin.organizationId },
    select: { id: true, personName: true, courseName: true },
  });
  if (!record) throw new Error("Training record not found");

  await prisma.trainingRecord.delete({ where: { id: record.id } });

  await logAudit({
    organizationId: admin.organizationId,
    actorId: admin.id,
    action: "training.delete",
    targetType: "TrainingRecord",
    targetId: record.id,
    metadata: { personName: record.personName, courseName: record.courseName },
  });

  revalidatePath("/training");
}
