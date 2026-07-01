import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { recurrenceLabel } from "@/lib/recurrence";
import { StatusSelect } from "@/components/tasks/status-select";
import { TaskDetailsForm } from "@/components/tasks/task-details-form";
import { EvidenceSection } from "@/components/evidence/evidence-section";
import { CategoryBadge } from "@/components/category-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const [task, members] = await Promise.all([
    prisma.complianceTask.findFirst({
      where: { id, organizationId: user.organizationId },
      include: {
        template: true,
        assignee: { select: { id: true, name: true, email: true } },
        evidence: {
          include: {
            uploadedBy: { select: { name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!task) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to tasks
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={task.template.category} />
            <Badge variant="outline" className="font-mono text-xs">
              45 CFR § {task.template.citation}
            </Badge>
            {task.recurrenceMonths && (
              <Badge
                variant="secondary"
                className="gap-1 bg-primary/10 text-primary"
              >
                <RefreshCw className="h-3 w-3" />
                {recurrenceLabel(task.recurrenceMonths)}
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {task.template.title}
          </h1>
          {task.completedAt && (
            <p className="text-sm text-muted-foreground">
              {task.recurrenceMonths ? "Last completed" : "Completed"}{" "}
              {formatDate(task.completedAt)}
              {task.recurrenceMonths && task.dueDate && (
                <> · next due {formatDate(task.dueDate)}</>
              )}
            </p>
          )}
        </div>
        <StatusSelect taskId={task.id} status={task.status} />
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            What this requirement means
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
            {task.template.description}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Details</CardTitle>
          <CardDescription>
            Assign an owner, set a due date, and keep notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskDetailsForm
            taskId={task.id}
            notes={task.notes}
            dueDate={task.dueDate}
            assigneeId={task.assigneeId}
            recurrenceMonths={task.recurrenceMonths}
            members={members}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Evidence</CardTitle>
          <CardDescription>
            Attach the documents an auditor would ask for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EvidenceSection
            taskId={task.id}
            evidence={task.evidence}
            isAdmin={user.role === "ADMIN"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
