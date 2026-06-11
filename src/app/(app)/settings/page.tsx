import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrgNameForm } from "@/components/settings/org-name-form";
import { TeamSection } from "@/components/settings/team-section";
import { BillingCard } from "@/components/settings/billing-card";
import { FrameworksSection } from "@/components/settings/frameworks-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const isAdmin = user.role === "ADMIN";

  const [members, allFrameworks, enabledFrameworks] = await Promise.all([
    prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.framework.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { templates: true } } },
    }),
    prisma.orgFramework.findMany({
      where: { organizationId: user.organizationId },
      select: { frameworkId: true },
    }),
  ]);

  const enabledIds = enabledFrameworks.map((f) => f.frameworkId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization, frameworks, and team
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organization</CardTitle>
          <CardDescription>
            This name appears on your compliance reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrgNameForm
            initialName={user.organization.name}
            canEdit={isAdmin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Frameworks</CardTitle>
          <CardDescription>
            Enable frameworks to add their task checklists to your dashboard.
            Disabling a framework hides its tasks but preserves your progress
            data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FrameworksSection
            allFrameworks={allFrameworks}
            enabledIds={enabledIds}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team</CardTitle>
          <CardDescription>
            {isAdmin
              ? "Invite staff by email. They'll join as members and can work tasks and upload evidence."
              : "Your organization's team members."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamSection
            members={members}
            currentUserId={user.id}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Billing</CardTitle>
          <CardDescription>
            Manage your subscription, payment method, and invoices through
            Stripe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingCard
            subscriptionStatus={user.organization.subscriptionStatus}
            currentPeriodEnd={user.organization.currentPeriodEnd}
            hasCustomer={Boolean(user.organization.stripeCustomerId)}
            isAdmin={isAdmin}
          />
        </CardContent>
      </Card>
    </div>
  );
}
