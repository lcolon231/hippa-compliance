import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTaskReminderEmail, type ReminderTask } from "@/lib/email";

export const dynamic = "force-dynamic";

const LOOKAHEAD_DAYS = 7;
// Don't re-remind about the same task more often than this.
const REMINDER_COOLDOWN_DAYS = 3;

/**
 * Daily cron (see vercel.json): emails each assignee a digest of their
 * overdue tasks and tasks due within the next 7 days.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const horizon = new Date(now.getTime() + LOOKAHEAD_DAYS * 86_400_000);
  const cooldownCutoff = new Date(
    now.getTime() - REMINDER_COOLDOWN_DAYS * 86_400_000
  );

  const tasks = await prisma.complianceTask.findMany({
    where: {
      status: { in: ["NOT_STARTED", "IN_PROGRESS"] },
      dueDate: { lte: horizon },
      assigneeId: { not: null },
      OR: [
        { reminderSentAt: null },
        { reminderSentAt: { lt: cooldownCutoff } },
      ],
    },
    include: {
      template: { select: { title: true, citation: true } },
      assignee: { select: { id: true, name: true, email: true } },
      organization: { select: { name: true } },
    },
  });

  // One digest email per assignee.
  const byAssignee = new Map<
    string,
    {
      email: string;
      name: string | null;
      orgName: string;
      tasks: ReminderTask[];
      taskIds: string[];
    }
  >();

  for (const task of tasks) {
    if (!task.assignee || !task.dueDate) continue;
    const key = task.assignee.id;
    if (!byAssignee.has(key)) {
      byAssignee.set(key, {
        email: task.assignee.email,
        name: task.assignee.name,
        orgName: task.organization.name,
        tasks: [],
        taskIds: [],
      });
    }
    const entry = byAssignee.get(key)!;
    entry.tasks.push({
      id: task.id,
      title: task.template.title,
      citation: task.template.citation,
      dueDate: task.dueDate,
      overdue: task.dueDate < now,
    });
    entry.taskIds.push(task.id);
  }

  let sent = 0;
  let failed = 0;

  for (const entry of byAssignee.values()) {
    entry.tasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    try {
      await sendTaskReminderEmail({
        to: entry.email,
        recipientName: entry.name,
        orgName: entry.orgName,
        tasks: entry.tasks,
      });
      await prisma.complianceTask.updateMany({
        where: { id: { in: entry.taskIds } },
        data: { reminderSentAt: now },
      });
      sent++;
    } catch (err) {
      console.error(`Reminder email failed for ${entry.email}`, err);
      failed++;
    }
  }

  return NextResponse.json({
    recipients: byAssignee.size,
    sent,
    failed,
    tasksMatched: tasks.length,
  });
}
