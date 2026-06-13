"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSupabaseUser, getCurrentUser } from "@/lib/auth";

const schema = z.object({
  orgName: z.string().trim().min(1).max(120),
  npi: z.string().trim().max(20).optional(),
  // Comma-separated list of framework IDs to enable
  frameworkIds: z.string().optional(),
});

export async function createOrganization(formData: FormData) {
  const supabaseUser = await getSupabaseUser();
  if (!supabaseUser) throw new Error("Unauthorized");

  const existing = await getCurrentUser();
  if (existing) redirect("/dashboard");

  const parsed = schema.safeParse({
    orgName: formData.get("orgName"),
    npi: formData.get("npi") || undefined,
    frameworkIds: formData.get("frameworkIds") || undefined,
  });
  if (!parsed.success) {
    throw new Error("Please enter a valid organization name");
  }

  const requestedFrameworkIds = parsed.data.frameworkIds
    ? parsed.data.frameworkIds.split(",").filter(Boolean)
    : [];

  // Always ensure at least one framework (HIPAA Security Rule) is selected.
  let frameworkIds = requestedFrameworkIds;
  if (frameworkIds.length === 0) {
    const defaultFw = await prisma.framework.findUnique({
      where: { slug: "hipaa-security" },
      select: { id: true },
    });
    if (defaultFw) frameworkIds = [defaultFw.id];
  }

  const templates = await prisma.taskTemplate.findMany({
    where: { frameworkId: { in: frameworkIds } },
    select: { id: true },
  });

  // Guard against an unseeded database: without framework/template data we
  // would otherwise create an empty organization with zero tasks, leaving the
  // dashboard permanently blank. Fail loudly instead so the misconfiguration
  // is obvious (run `prisma db seed`).
  if (frameworkIds.length === 0 || templates.length === 0) {
    throw new Error(
      "No compliance frameworks are available. The database has not been seeded — run `prisma db seed` before onboarding."
    );
  }

  await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: parsed.data.orgName,
        npi: parsed.data.npi || null,
      },
    });

    await tx.user.create({
      data: {
        supabaseId: supabaseUser.id,
        email: supabaseUser.email!,
        name:
          (supabaseUser.user_metadata?.name as string | undefined) ??
          (supabaseUser.user_metadata?.full_name as string | undefined) ??
          null,
        role: "ADMIN",
        organizationId: org.id,
      },
    });

    // Record which frameworks the org enrolled in.
    if (frameworkIds.length > 0) {
      await tx.orgFramework.createMany({
        data: frameworkIds.map((fwId) => ({
          organizationId: org.id,
          frameworkId: fwId,
        })),
        skipDuplicates: true,
      });
    }

    if (templates.length > 0) {
      await tx.complianceTask.createMany({
        data: templates.map((t) => ({
          organizationId: org.id,
          templateId: t.id,
        })),
      });
    }
  });

  redirect("/dashboard");
}
