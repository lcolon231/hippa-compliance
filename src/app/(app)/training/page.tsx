import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trainingExpiryStatus } from "@/lib/utils";
import { TrainingSection } from "@/components/training/training-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Training" };

export default async function TrainingPage() {
  const user = await requireUser();

  const records = await prisma.trainingRecord.findMany({
    where: { organizationId: user.organizationId },
    orderBy: [{ completedAt: "desc" }],
  });

  const now = new Date();
  const expired = records.filter(
    (r) => trainingExpiryStatus(r.expiresAt, now) === "expired"
  ).length;
  const expiring = records.filter(
    (r) => trainingExpiryStatus(r.expiresAt, now) === "expiring"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training</h1>
        <p className="text-muted-foreground">
          Workforce HIPAA-training records (§164.308(a)(5))
        </p>
      </div>

      {(expired > 0 || expiring > 0) && (
        <div className="flex flex-wrap gap-3">
          {expired > 0 && (
            <div className="rounded-xl border border-red-600/20 bg-red-600/5 px-4 py-2 text-sm">
              <span className="font-semibold text-red-700">{expired}</span>{" "}
              <span className="text-muted-foreground">
                record{expired === 1 ? "" : "s"} expired
              </span>
            </div>
          )}
          {expiring > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-sm">
              <span className="font-semibold text-amber-700">{expiring}</span>{" "}
              <span className="text-muted-foreground">
                expiring within 30 days
              </span>
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Training records</CardTitle>
          <CardDescription>
            Track each staff member&apos;s completed HIPAA training and renewal
            dates. Anyone can add records; admins can remove them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrainingSection
            records={records}
            isAdmin={user.role === "ADMIN"}
          />
        </CardContent>
      </Card>
    </div>
  );
}
