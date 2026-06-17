import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar, MobileNav } from "@/components/nav/sidebar";
import { SubscriptionBanner } from "@/components/subscription-banner";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Authenticated in Supabase but no app user yet → finish onboarding.
  if (!user) redirect("/onboarding");

  const navUser = { name: user.name, email: user.email, role: user.role };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={navUser} orgName={user.organization.name} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar — replaces the sidebar below md */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-4 md:hidden">
          <MobileNav user={navUser} orgName={user.organization.name} />
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <span className="truncate text-sm font-semibold">
              HIPAA Tracker
            </span>
          </div>
        </header>
        <SubscriptionBanner
          status={user.organization.subscriptionStatus}
          isAdmin={user.role === "ADMIN"}
        />
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <div className="container max-w-6xl px-4 py-6 sm:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
