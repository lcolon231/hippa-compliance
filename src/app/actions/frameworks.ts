"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

/**
 * Enables a framework for the current org:
 * - Creates an OrgFramework record.
 * - Instantiates ComplianceTasks for all templates in that framework
 *   (skips any that already exist via skipDuplicates).
 */
export async function enableFramework(frameworkId: string) {
  const admin = await requireAdmin();

  const framework = await prisma.framework.findUniqueOrThrow({
    where: { id: frameworkId },
    include: { templates: { select: { id: true } } },
  });

  await prisma.$transaction(async (tx) => {
    await tx.orgFramework.upsert({
      where: {
        organizationId_frameworkId: {
          organizationId: admin.organizationId,
          frameworkId: framework.id,
        },
      },
      update: {},
      create: {
        organizationId: admin.organizationId,
        frameworkId: framework.id,
      },
    });

    if (framework.templates.length > 0) {
      await tx.complianceTask.createMany({
        data: framework.templates.map((t) => ({
          organizationId: admin.organizationId,
          templateId: t.id,
        })),
        skipDuplicates: true,
      });
    }
  });

  revalidatePath("/settings");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

/**
 * Disables a framework for the current org:
 * - Removes the OrgFramework record.
 * - ComplianceTasks are preserved (don't lose compliance history).
 */
export async function disableFramework(frameworkId: string) {
  const admin = await requireAdmin();

  await prisma.orgFramework.delete({
    where: {
      organizationId_frameworkId: {
        organizationId: admin.organizationId,
        frameworkId: frameworkId,
      },
    },
  });

  revalidatePath("/settings");
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
