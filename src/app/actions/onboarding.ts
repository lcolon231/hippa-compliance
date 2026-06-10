"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSupabaseUser, getCurrentUser } from "@/lib/auth";

const schema = z.object({
  orgName: z.string().trim().min(1).max(120),
  npi: z.string().trim().max(20).optional(),
});

export async function createOrganization(formData: FormData) {
  const supabaseUser = await getSupabaseUser();
  if (!supabaseUser) throw new Error("Unauthorized");

  // Already onboarded → nothing to do.
  const existing = await getCurrentUser();
  if (existing) redirect("/dashboard");

  const parsed = schema.safeParse({
    orgName: formData.get("orgName"),
    npi: formData.get("npi") || undefined,
  });
  if (!parsed.success) {
    throw new Error("Please enter a valid organization name");
  }

  const templates = await prisma.taskTemplate.findMany({
    select: { id: true },
  });

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
