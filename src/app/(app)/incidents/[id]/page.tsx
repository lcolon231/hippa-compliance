import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  cn,
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_SEVERITY_STYLES,
  INCIDENT_STATUS_LABELS,
  INCIDENT_STATUS_STYLES,
  BREACH_DETERMINATION_LABELS,
} from "@/lib/utils";
import { IncidentManageForm } from "@/components/incidents/incident-manage-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IncidentDetailPageProps {
  params: Promise<{ id: string }>;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

export default async function IncidentDetailPage({
  params,
}: IncidentDetailPageProps) {
  const user = await requireUser();
  const { id } = await params;

  const incident = await prisma.incident.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { reportedBy: { select: { name: true, email: true } } },
  });
  if (!incident) notFound();

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <Link
        href="/incidents"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to incidents
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "border-transparent",
              INCIDENT_SEVERITY_STYLES[incident.severity]
            )}
          >
            {INCIDENT_SEVERITY_LABELS[incident.severity]}
          </Badge>
          <Badge
            variant="secondary"
            className={cn(
              "border-transparent",
              INCIDENT_STATUS_STYLES[incident.status]
            )}
          >
            {INCIDENT_STATUS_LABELS[incident.status]}
          </Badge>
          {incident.determination === "BREACH" && (
            <Badge variant="secondary" className="bg-red-600/10 text-red-700">
              Reportable breach
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{incident.title}</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">What happened</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="max-w-[65ch] whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {incident.description}
          </p>
          <dl className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
            <Field label="Discovered" value={formatDate(incident.discoveredAt)} />
            <Field
              label="Occurred"
              value={incident.occurredAt ? formatDate(incident.occurredAt) : "—"}
            />
            <Field
              label="Reported by"
              value={
                incident.reportedBy
                  ? (incident.reportedBy.name ?? incident.reportedBy.email)
                  : "—"
              }
            />
            <Field
              label="PHI involved"
              value={incident.phiInvolved ? "Yes" : "No"}
            />
            <Field
              label="Determination"
              value={BREACH_DETERMINATION_LABELS[incident.determination]}
            />
            <Field
              label="Individuals affected"
              value={incident.individualsAffected ?? "—"}
            />
            <Field
              label="Notified"
              value={incident.notifiedAt ? formatDate(incident.notifiedAt) : "—"}
            />
            <Field
              label="Resolved"
              value={incident.resolvedAt ? formatDate(incident.resolvedAt) : "—"}
            />
          </dl>
        </CardContent>
      </Card>

      {isAdmin ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Manage & breach analysis</CardTitle>
            <CardDescription>
              Track investigation status and record the breach determination
              and any required notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentManageForm
              incidentId={incident.id}
              status={incident.status}
              severity={incident.severity}
              determination={incident.determination}
              individualsAffected={incident.individualsAffected}
              phiInvolved={incident.phiInvolved}
              notifiedAt={incident.notifiedAt}
            />
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">
          Only admins can update the investigation and breach analysis.
        </p>
      )}
    </div>
  );
}
