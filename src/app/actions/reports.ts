"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateComplianceScore } from "@/lib/utils";
import { renderReportPdf } from "@/lib/pdf/report";

const REPORTS_BUCKET = "reports";
const SIGNED_URL_EXPIRY_SECONDS = 60;

export async function generateReport() {
  const user = await requireUser();

  const enabledFrameworks = await prisma.orgFramework.findMany({
    where: { organizationId: user.organizationId },
    include: { framework: { select: { id: true, name: true, slug: true } } },
    orderBy: { framework: { sortOrder: "asc" } },
  });
  const enabledFrameworkIds = enabledFrameworks.map((f) => f.frameworkId);

  const tasks = await prisma.complianceTask.findMany({
    where: {
      organizationId: user.organizationId,
      template: { frameworkId: { in: enabledFrameworkIds } },
    },
    include: {
      template: {
        include: {
          framework: { select: { id: true, name: true, slug: true } },
        },
      },
      _count: { select: { evidence: true } },
    },
    orderBy: { template: { sortOrder: "asc" } },
  });

  const score = calculateComplianceScore(tasks);

  const pdfBuffer = await renderReportPdf({
    orgName: user.organization.name,
    generatedAt: new Date(),
    score,
    frameworks: enabledFrameworks.map((f) => f.framework),
    tasks: tasks.map((t) => ({
      title: t.template.title,
      citation: t.template.citation,
      category: t.template.category,
      status: t.status,
      completedAt: t.completedAt,
      evidenceCount: t._count.evidence,
      frameworkName: t.template.framework?.name ?? "—",
      frameworkSlug: t.template.framework?.slug ?? "",
    })),
  });

  const storagePath = `${user.organizationId}/report-${Date.now()}.pdf`;
  const supabase = createAdminClient();

  const { error: uploadError } = await supabase.storage
    .from(REPORTS_BUCKET)
    .upload(storagePath, pdfBuffer, { contentType: "application/pdf" });

  if (uploadError) {
    throw new Error(`Could not save report: ${uploadError.message}`);
  }

  await prisma.report.create({
    data: {
      organizationId: user.organizationId,
      scoreAtExport: score,
      storagePath,
    },
  });

  const { data: signed, error: signError } = await supabase.storage
    .from(REPORTS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS);

  if (signError || !signed) {
    throw new Error(`Could not sign report URL: ${signError?.message}`);
  }

  revalidatePath("/reports");

  return { downloadUrl: signed.signedUrl, score };
}

export async function getReportDownloadUrl(reportId: string) {
  const user = await requireUser();

  const report = await prisma.report.findFirst({
    where: { id: reportId, organizationId: user.organizationId },
    select: { storagePath: true },
  });
  if (!report) throw new Error("Report not found");

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(REPORTS_BUCKET)
    .createSignedUrl(report.storagePath, SIGNED_URL_EXPIRY_SECONDS);

  if (error || !data) {
    throw new Error(`Could not sign report URL: ${error?.message}`);
  }

  return data.signedUrl;
}
