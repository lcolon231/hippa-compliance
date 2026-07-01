import Link from "next/link";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  cn,
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_SEVERITY_STYLES,
  INCIDENT_STATUS_LABELS,
  INCIDENT_STATUS_STYLES,
} from "@/lib/utils";
import { ReportIncidentDialog } from "@/components/incidents/report-incident-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Incidents" };

const OPEN_STATUSES = ["OPEN", "INVESTIGATING"] as const;

export default async function IncidentsPage() {
  const user = await requireUser();

  const incidents = await prisma.incident.findMany({
    where: { organizationId: user.organizationId },
    include: { reportedBy: { select: { name: true, email: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const openCount = incidents.filter((i) =>
    OPEN_STATUSES.includes(i.status as (typeof OPEN_STATUSES)[number])
  ).length;
  const breachCount = incidents.filter(
    (i) => i.determination === "BREACH"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground">
            Security-incident and breach log (45 CFR §164.400–414)
          </p>
        </div>
        <ReportIncidentDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{openCount}</p>
              <p className="text-xs text-muted-foreground">Open / investigating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">{breachCount}</p>
              <p className="text-xs text-muted-foreground">
                Determined breaches
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ShieldAlert className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums">
                {incidents.length}
              </p>
              <p className="text-xs text-muted-foreground">Total logged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {incidents.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-14 text-center">
              <ShieldAlert className="mb-2 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm font-medium">No incidents logged</p>
              <p className="text-sm text-muted-foreground">
                When a security event happens, log it here to keep your
                breach-notification records complete.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {incidents.map((incident) => (
                <li key={incident.id}>
                  <Link
                    href={`/incidents/${incident.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/40 sm:px-6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {incident.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Reported {formatDate(incident.createdAt)}
                        {incident.reportedBy &&
                          ` by ${incident.reportedBy.name ?? incident.reportedBy.email}`}
                        {incident.phiInvolved && " · PHI involved"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
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
                    </div>
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
