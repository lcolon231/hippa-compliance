import { FileText } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { GenerateReportButton } from "@/components/reports/generate-report-button";
import { DownloadReportButton } from "@/components/reports/download-report-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const user = await requireUser();

  const reports = await prisma.report.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary/80">
            Audit trail
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-muted-foreground">
            Audit-ready PDF snapshots of your compliance status
          </p>
        </div>
        <GenerateReportButton />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Past Reports</CardTitle>
          <CardDescription>
            Every export is recorded — a built-in audit trail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed py-12 text-center">
              <FileText className="mb-3 h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No reports yet. Generate your first compliance status report
                above.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Compliance Status Report
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(report.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={
                        report.scoreAtExport >= 80
                          ? "bg-emerald-600/10 text-emerald-700"
                          : report.scoreAtExport >= 50
                            ? "bg-amber-500/10 text-amber-700"
                            : "bg-red-600/10 text-red-700"
                      }
                    >
                      {report.scoreAtExport}%
                    </Badge>
                    <DownloadReportButton reportId={report.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
