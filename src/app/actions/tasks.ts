"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { TaskStatus } from "@prisma/client";
import { logAudit } from "@/lib/audit";

const statusSchema = z.nativeEnum(TaskStatus);

export async function updateTaskStatus(taskId: string, status: string) {
  const user = await requireUser();
  const parsedStatus = statusSchema.parse(status);

  // Scope by organizationId — never trust the client for org membership.
  const task = await prisma.complianceTask.findFirst({
    where: { id: taskId, organizationId: user.organizationId },
    select: { id: true },
  });
  if (!task) throw new Error("Task not found");

  await prisma.complianceTask.update({
    where: { id: task.id },
    data: {
      status: parsedStatus,
      completedAt: parsedStatus === "COMPLETE" ? new Date() : null,
    },
  });

  await logAudit({
    organizationId: user.organizationId,
    actorId: user.id,
    action: "task.status_change",
    targetType: "ComplianceTask",
    targetId: task.id,
    metadata: { status: parsedStatus },
  });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/dashboard");
}

const detailsSchema = z.object({
  notes: z.string().max(10_000).nullable().optional(),
  dueDate: z.string().nullable().optional(), // yyyy-mm-dd or null to clear
  assigneeId: z.string().nullable().optional(),
});

export async function updateTaskDetails(
  taskId: string,
  details: z.infer<typeof detailsSchema>
) {
  const user = await requireUser();
  const parsed = detailsSchema.parse(details);

  const task = await prisma.complianceTask.findFirst({
    where: { id: taskId, organizationId: user.organizationId },
    select: { id: true },
  });
  if (!task) throw new Error("Task not found");

  // Assignee must belong to the same organization.
  if (parsed.assigneeId) {
    const assignee = await prisma.user.findFirst({
      where: { id: parsed.assigneeId, organizationId: user.organizationId },
      select: { id: true },
    });
    if (!assignee) throw new Error("Assignee not found");
  }

  await prisma.complianceTask.update({
    where: { id: task.id },
    data: {
      ...(parsed.notes !== undefined && { notes: parsed.notes }),
      ...(parsed.dueDate !== undefined && {
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
      }),
      ...(parsed.assigneeId !== undefined && {
        assigneeId: parsed.assigneeId,
      }),
    },
  });

  // Log which fields changed, not their content (notes may hold sensitive text).
  await logAudit({
    organizationId: user.organizationId,
    actorId: user.id,
    action: "task.details_change",
    targetType: "ComplianceTask",
    targetId: task.id,
    metadata: { fieldsChanged: Object.keys(parsed) },
  });

  revalidatePath("/tasks");
  revalidatePath(`/tasks/${taskId}`);
  revalidatePath("/dashboard");
}
