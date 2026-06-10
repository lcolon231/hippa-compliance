import Link from "next/link";
import { Suspense } from "react";
import { Paperclip } from "lucide-react";
import { Prisma, TaskStatus, Category } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  CATEGORY_LABELS,
  CATEGORY_CITATIONS,
  CATEGORY_ORDER,
  formatDate,
} from "@/lib/utils";
import { StatusSelect } from "@/components/tasks/status-select";
import { TaskFilters } from "@/components/tasks/task-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Tasks" };

interface TasksPageProps {
  searchParams: Promise<{
    category?: string;
    status?: string;
    assignee?: string;
  }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const where: Prisma.ComplianceTaskWhereInput = {
    organizationId: user.organizationId,
  };

  if (params.status && params.status in TaskStatus) {
    where.status = params.status as TaskStatus;
  }
  if (params.category && params.category in Category) {
    where.template = { category: params.category as Category };
  }
  if (params.assignee === "UNASSIGNED") {
    where.assigneeId = null;
  } else if (params.assignee) {
    where.assigneeId = params.assignee;
  }

  const [tasks, members] = await Promise.all([
    prisma.complianceTask.findMany({
      where,
      include: {
        template: true,
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { evidence: true } },
      },
      orderBy: { template: { sortOrder: "asc" } },
    }),
    prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    tasks: tasks.filter((t) => t.template.category === category),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Your HIPAA Security Rule checklist — {tasks.length} task
            {tasks.length === 1 ? "" : "s"} shown
          </p>
        </div>
        <Suspense>
          <TaskFilters members={members} />
        </Suspense>
      </div>

      {grouped.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No tasks match these filters.
          </CardContent>
        </Card>
      ) : (
        grouped.map((group) => (
          <Card key={group.category}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {CATEGORY_LABELS[group.category]}
                <span className="text-sm font-normal text-muted-foreground">
                  {CATEGORY_CITATIONS[group.category]}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y border-t">
                {group.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-accent/40"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/tasks/${task.id}`}
                        className="block truncate text-sm font-medium hover:underline"
                      >
                        {task.template.title}
                      </Link>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge
                          variant="outline"
                          className="rounded px-1.5 py-0 font-mono text-[10px]"
                        >
                          § {task.template.citation}
                        </Badge>
                        {task.assignee && (
                          <span>
                            {task.assignee.name ?? task.assignee.email}
                          </span>
                        )}
                        {task.dueDate && (
                          <span>due {formatDate(task.dueDate)}</span>
                        )}
                        {task._count.evidence > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Paperclip className="h-3 w-3" />
                            {task._count.evidence}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusSelect taskId={task.id} status={task.status} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
