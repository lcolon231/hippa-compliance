import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Circle,
  Loader2,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";
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

  const STATUS_TILE_META: Record<
    string,
    { icon: typeof Circle; tint: string; iconColor: string }
  > = {
    NOT_STARTED: {
      icon: Circle,
      tint: "bg-secondary",
      iconColor: "text-muted-foreground",
    },
    IN_PROGRESS: {
      icon: Loader2,
      tint: "bg-amber-500/10",
      iconColor: "text-amber-600",
    },
    COMPLETE: {
      icon: CheckCircle2,
      tint: "bg-emerald-600/10",
      iconColor: "text-emerald-700",
    },
    NOT_APPLICABLE: {
      icon: MinusCircle,
      tint: "bg-muted",
      iconColor: "text-muted-foreground/70",
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">
          Compliance overview
        </p>
        <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          {user.organization.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {enabledFrameworks.length} framework
          {enabledFrameworks.length === 1 ? "" : "s"} tracked
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score ring — overall across all enabled frameworks */}
        <Card
          className={cn(
            "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-none py-8 lg:row-span-2",
            "bg-gradient-to-br from-primary/[0.07] via-card to-card",
            "shadow-[0_1px_2px_hsl(var(--primary)/0.06),0_16px_32px_-16px_hsl(var(--primary)/0.28)]"
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <CardHeader className="relative pb-2 text-center">
            <CardTitle className="text-lg">Overall compliance</CardTitle>
            <CardDescription>All active frameworks</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ScoreRing score={overallScore} />
          </CardContent>
        </Card>

        {/* Per-framework breakdown */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">By framework</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {frameworkStats.map((fw, i) => (
              <div key={fw.framework.id}>
                {i > 0 && <Separator className="mb-6" />}
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">{fw.framework.name}</p>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {fw.score}% — {fw.taskCount} tasks
                  </span>
                </div>
                <div className="space-y-3">
                  {fw.categories.map((cat) => (
                    <div key={cat.category}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {CATEGORY_LABELS[cat.category]}
                        </span>
                        <span className="tabular-nums text-muted-foreground">
                          {cat.complete}/{cat.total}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width] duration-500 ease-out",
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
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Task status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statusCounts.map(({ status, count }) => {
                const meta = STATUS_TILE_META[status];
                const Icon = meta.icon;
                return (
                  <div
                    key={status}
                    className={cn(
                      "rounded-xl p-4 text-center transition-transform duration-200 hover:-translate-y-0.5",
                      meta.tint
                    )}
                  >
                    <Icon className={cn("mx-auto mb-1.5 h-4 w-4", meta.iconColor)} />
                    <p className="text-3xl font-bold tabular-nums">{count}</p>
                    <p className="text-xs text-muted-foreground">
                      {STATUS_LABELS[status]}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overdue */}
      <Card className="rounded-2xl">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Overdue tasks
            </CardTitle>
            <CardDescription>
              Past their due date and not yet complete
            </CardDescription>
          </div>
          <Link
            href="/tasks"
            className="group flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            All tasks
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {overdueTasks.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-10 text-center">
              <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-600/70" />
              <p className="text-sm font-medium">All caught up</p>
              <p className="text-sm text-muted-foreground">
                Nothing overdue right now.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {overdueTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg border-l-2 border-transparent py-3 pl-3 transition-colors hover:border-destructive/60 hover:bg-accent/60"
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
