import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  calculateComplianceScore,
  formatDate,
  CATEGORY_LABELS,
  FRAMEWORK_CATEGORY_ORDER,
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
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
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
        select: {
          title: true,
          citation: true,
          category: true,
          sortOrder: true,
          frameworkId: true,
        },
      },
      assignee: { select: { name: true, email: true } },
    },
    orderBy: { template: { sortOrder: "asc" } },
  });

  const overallScore = calculateComplianceScore(tasks);

  // Per-framework breakdown
  const frameworkStats = enabledFrameworks.map(({ framework }) => {
    const fwTasks = tasks.filter(
      (t) => t.template.frameworkId === framework.id
    );
    const categoryOrder = FRAMEWORK_CATEGORY_ORDER[framework.slug] ?? [];
    const categories = categoryOrder
      .map((cat) => {
        const catTasks = fwTasks.filter((t) => t.template.category === cat);
        return {
          category: cat,
          score: calculateComplianceScore(catTasks),
          complete: catTasks.filter((t) => t.status === "COMPLETE").length,
          total: catTasks.filter((t) => t.status !== "NOT_APPLICABLE").length,
        };
      })
      .filter((c) => c.total > 0);

    return {
      framework,
      score: calculateComplianceScore(fwTasks),
      taskCount: fwTasks.length,
      categories,
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

  const statusCounts = (
    ["NOT_STARTED", "IN_PROGRESS", "COMPLETE", "NOT_APPLICABLE"] as const
  ).map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user.organization.name} — {enabledFrameworks.length} framework
          {enabledFrameworks.length === 1 ? "" : "s"} tracked
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score ring — overall across all enabled frameworks */}
        <Card className="flex flex-col items-center justify-center py-8 lg:row-span-2">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-lg">Overall Compliance</CardTitle>
            <CardDescription>All active frameworks</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreRing score={overallScore} />
          </CardContent>
        </Card>

        {/* Per-framework breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">By Framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {frameworkStats.map((fw, i) => (
              <div key={fw.framework.id}>
                {i > 0 && <Separator className="mb-6" />}
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">{fw.framework.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {fw.score}% — {fw.taskCount} tasks
                  </span>
                </div>
                <div className="space-y-2">
                  {fw.categories.map((cat) => (
                    <div key={cat.category}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {CATEGORY_LABELS[cat.category]}
                        </span>
                        <span className="text-muted-foreground">
                          {cat.complete}/{cat.total}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            CATEGORY_BAR_COLORS[cat.category] ?? "bg-primary"
                          )}
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
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
                <div key={status} className="rounded-lg border p-4 text-center">
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
                        {task.template.citation} · due{" "}
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
