import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/nav/sidebar";
import { SubscriptionBanner } from "@/components/subscription-banner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Authenticated in Supabase but no app user yet → finish onboarding.
  if (!user) redirect("/onboarding");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        user={{ name: user.name, email: user.email, role: user.role }}
        orgName={user.organization.name}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SubscriptionBanner
          status={user.organization.subscriptionStatus}
          isAdmin={user.role === "ADMIN"}
        />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <div className="container max-w-6xl py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
