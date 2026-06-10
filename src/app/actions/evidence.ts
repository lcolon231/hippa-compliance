"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const EVIDENCE_BUCKET = "evidence";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const SIGNED_URL_EXPIRY_SECONDS = 60;

const uploadSchema = z.object({
  taskId: z.string().min(1),
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(ALLOWED_MIME_TYPES as [string, ...string[]]),
  sizeBytes: z.number().int().positive().max(MAX_FILE_SIZE),
});

/**
 * Validates the file and returns a signed upload URL for the private
 * evidence bucket, plus the storage path to record after upload completes.
 */
export async function getUploadUrl(input: {
  taskId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const user = await requireUser();
  const parsed = uploadSchema.parse(input);

  const task = await prisma.complianceTask.findFirst({
    where: { id: parsed.taskId, organizationId: user.organizationId },
    select: { id: true },
  });
  if (!task) throw new Error("Task not found");

  const safeName = parsed.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${user.organizationId}/${task.id}/${Date.now()}-${safeName}`;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    throw new Error(`Could not create upload URL: ${error?.message}`);
  }

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    storagePath,
  };
}

const recordSchema = uploadSchema.extend({
  storagePath: z.string().min(1),
});

export async function recordEvidence(input: {
  taskId: string;
  fileName: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
}) {
  const user = await requireUser();
  const parsed = recordSchema.parse(input);

  const task = await prisma.complianceTask.findFirst({
    where: { id: parsed.taskId, organizationId: user.organizationId },
    select: { id: true },
  });
  if (!task) throw new Error("Task not found");

  // The path prefix encodes org + task; reject anything that doesn't match.
  if (!parsed.storagePath.startsWith(`${user.organizationId}/${task.id}/`)) {
    throw new Error("Invalid storage path");
  }

  await prisma.evidence.create({
    data: {
      taskId: task.id,
      uploadedById: user.id,
      fileName: parsed.fileName,
      storagePath: parsed.storagePath,
      mimeType: parsed.mimeType,
      sizeBytes: parsed.sizeBytes,
    },
  });

  revalidatePath(`/tasks/${parsed.taskId}`);
}

export async function getEvidenceDownloadUrl(evidenceId: string) {
  const user = await requireUser();

  const evidence = await prisma.evidence.findFirst({
    where: {
      id: evidenceId,
      task: { organizationId: user.organizationId },
    },
    select: { storagePath: true },
  });
  if (!evidence) throw new Error("Evidence not found");

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(EVIDENCE_BUCKET)
    .createSignedUrl(evidence.storagePath, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) {
    throw new Error(`Could not create download URL: ${error?.message}`);
  }

  return data.signedUrl;
}

export async function deleteEvidence(evidenceId: string) {
  const admin = await requireAdmin();

  const evidence = await prisma.evidence.findFirst({
    where: {
      id: evidenceId,
      task: { organizationId: admin.organizationId },
    },
    select: { id: true, taskId: true, storagePath: true },
  });
  if (!evidence) throw new Error("Evidence not found");

  const supabase = createAdminClient();
  await supabase.storage.from(EVIDENCE_BUCKET).remove([evidence.storagePath]);

  await prisma.evidence.delete({ where: { id: evidence.id } });

  revalidatePath(`/tasks/${evidence.taskId}`);
}
