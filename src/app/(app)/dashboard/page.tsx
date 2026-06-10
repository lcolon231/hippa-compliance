import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateComplianceScore,
  formatDate,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  STATUS_LABELS,
  cn,
} from "@/lib/utils";
import { ScoreRing } from "@/components/score-ring";
import { StatusBadge } from "@/components/status-badge";
import { CATEGORY_BAR_COLORS } from "@/components/category-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();

  const tasks = await prisma.complianceTask.findMany({
    where: { organizationId: user.organizationId },
    include: {
      template: {
        select: { title: true, citation: true, category: true, sortOrder: true },
      },
      assignee: { select: { name: true, email: true } },
    },
    orderBy: { template: { sortOrder: "asc" } },
  });

  const score = calculateComplianceScore(tasks);

  const categoryStats = CATEGORY_ORDER.map((category) => {
    const catTasks = tasks.filter((t) => t.template.category === category);
    const applicable = catTasks.filter((t) => t.status !== "NOT_APPLICABLE");
    const complete = applicable.filter((t) => t.status === "COMPLETE").length;
    return {
      category,
      complete,
      total: applicable.length,
      score: calculateComplianceScore(catTasks),
    };
  });

  const now = new Date();
  const overdueTasks = tasks
    .filter(
      (t) =>
        t.dueDate &&
        t.dueDate < now &&
        t.status !== "COMPLETE" &&
        t.status !== "NOT_APPLICABLE"
    )
    .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());

  const statusCounts = (["NOT_STARTED", "IN_PROGRESS", "COMPLETE", "NOT_APPLICABLE"] as const).map(
    (status) => ({
      status,
      count: tasks.filter((t) => t.status === status).length,
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user.organization.name} — HIPAA Security Rule compliance at a glance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score ring */}
        <Card className="flex flex-col items-center justify-center py-8 lg:row-span-2">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-lg">Compliance Score</CardTitle>
            <CardDescription>
              Complete ÷ applicable tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreRing score={score} />
          </CardContent>
        </Card>

        {/* Category bars */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">By Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {CATEGORY_LABELS[cat.category]}
                  </span>
                  <span className="text-muted-foreground">
                    {cat.complete}/{cat.total} · {cat.score}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      CATEGORY_BAR_COLORS[cat.category]
                    )}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Status counts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statusCounts.map(({ status, count }) => (
                <div
                  key={status}
                  className="rounded-lg border p-4 text-center"
                >
                  <p className="text-3xl font-bold tabular-nums">{count}</p>
                  <p className="text-xs text-muted-foreground">
                    {STATUS_LABELS[status]}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Overdue Tasks
            </CardTitle>
            <CardDescription>
              Past their due date and not yet complete
            </CardDescription>
          </div>
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            All tasks <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {overdueTasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nothing overdue. Nice work staying on top of it.
            </p>
          ) : (
            <ul className="divide-y">
              {overdueTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-between gap-4 py-3 hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {task.template.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        § {task.template.citation} · due{" "}
                        {formatDate(task.dueDate)}
                        {task.assignee &&
                          ` · ${task.assignee.name ?? task.assignee.email}`}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
