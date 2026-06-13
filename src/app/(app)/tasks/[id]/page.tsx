import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ClipboardCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { StatusSelect } from "@/components/tasks/status-select";
import { TaskDetailsForm } from "@/components/tasks/task-details-form";
import { EvidenceSection } from "@/components/evidence/evidence-section";
import { CategoryBadge } from "@/components/category-badge";
import { Markdown } from "@/components/markdown";
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
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
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
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {task.template.title}
          </h1>
          {task.completedAt && (
            <p className="text-sm text-muted-foreground">
              Completed {formatDate(task.completedAt)}
            </p>
          )}
        </div>
        <StatusSelect taskId={task.id} status={task.status} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-primary" />
            What this requirement means
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {task.template.description}
          </p>
        </CardContent>
      </Card>

      {task.template.guide && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              How to comply
            </CardTitle>
            <CardDescription>
              A step-by-step walkthrough for this requirement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Markdown>{task.template.guide}</Markdown>
          </CardContent>
        </Card>
      )}

      <Card>
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
            members={members}
          />
        </CardContent>
      </Card>

      <Card>
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
