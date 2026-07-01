"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

export async function updateOrgName(name: string) {
  const admin = await requireAdmin();
  const parsed = z.string().trim().min(1).max(120).parse(name);

  await prisma.organization.update({
    where: { id: admin.organizationId },
    data: { name: parsed },
  });

  await logAudit({
    organizationId: admin.organizationId,
    actorId: admin.id,
    action: "organization.rename",
    targetType: "Organization",
    targetId: admin.organizationId,
    metadata: { name: parsed },
  });

  revalidatePath("/settings");
  revalidatePath("/", "layout");
}

export async function inviteTeamMember(email: string) {
  const admin = await requireAdmin();
  const parsedEmail = z.string().email().parse(email.trim().toLowerCase());

  const existing = await prisma.user.findUnique({
    where: { email: parsedEmail },
    select: { id: true },
  });
  if (existing) {
    throw new Error("A user with that email already exists");
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    parsedEmail,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    }
  );

  if (error || !data.user) {
    throw new Error(`Could not send invite: ${error?.message}`);
  }

  // Pre-create the app user so they land in this org as a MEMBER on first login.
  const created = await prisma.user.create({
    data: {
      supabaseId: data.user.id,
      email: parsedEmail,
      role: "MEMBER",
      organizationId: admin.organizationId,
    },
  });

  await logAudit({
    organizationId: admin.organizationId,
    actorId: admin.id,
    action: "team.invite",
    targetType: "User",
    targetId: created.id,
    metadata: { email: parsedEmail },
  });

  revalidatePath("/settings");
}

export async function removeTeamMember(userId: string) {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    throw new Error("You cannot remove yourself");
  }

  const member = await prisma.user.findFirst({
    where: { id: userId, organizationId: admin.organizationId },
    select: { id: true, supabaseId: true, email: true },
  });
  if (!member) throw new Error("Member not found");

  await prisma.user.delete({ where: { id: member.id } });

  // Best-effort: also remove the Supabase auth account.
  const supabase = createAdminClient();
  await supabase.auth.admin.deleteUser(member.supabaseId).catch(() => {});

  await logAudit({
    organizationId: admin.organizationId,
    actorId: admin.id,
    action: "team.remove",
    targetType: "User",
    targetId: member.id,
    metadata: { email: member.email },
  });

  revalidatePath("/settings");
}
