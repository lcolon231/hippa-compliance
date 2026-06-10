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
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Audit-ready PDF snapshots of your compliance status
          </p>
        </div>
        <GenerateReportButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Past Reports</CardTitle>
          <CardDescription>
            Every export is recorded — a built-in audit trail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center">
              <FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
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
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
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
                          ? "bg-green-100 text-green-800"
                          : report.scoreAtExport >= 50
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
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
