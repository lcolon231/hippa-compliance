import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentUser, getSupabaseUser } from "@/lib/auth";
import { createOrganization } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Set up your office" };

export default async function OnboardingPage() {
  const supabaseUser = await getSupabaseUser();
  if (!supabaseUser) redirect("/login");

  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="h-7 w-7 text-primary" />
        HIPAA Tracker
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Set up your office</CardTitle>
          <CardDescription>
            We&apos;ll create your compliance checklist — all 50 HIPAA
            Security Rule tasks — as soon as you name your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createOrganization} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Practice / office name</Label>
              <Input
                id="orgName"
                name="orgName"
                placeholder="Smith Family Medicine"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="npi">
                NPI number{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="npi"
                name="npi"
                placeholder="1234567890"
                maxLength={20}
              />
            </div>
            <Button type="submit" className="w-full">
              Create my checklist
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
