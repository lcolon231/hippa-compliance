import { redirect } from "next/navigation";
import { ShieldCheck, Check } from "lucide-react";
import { getCurrentUser, getSupabaseUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
import { cn } from "@/lib/utils";

export const metadata = { title: "Set up your office" };

export default async function OnboardingPage() {
  const supabaseUser = await getSupabaseUser();
  if (!supabaseUser) redirect("/login");

  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const frameworks = await prisma.framework.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { templates: true } } },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="h-7 w-7 text-primary" />
        HIPAA Tracker
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Set up your office</CardTitle>
          <CardDescription>
            Choose the compliance frameworks you want to track and name your
            organization. You can add more frameworks later in Settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createOrganization} className="space-y-6">
            {/* Framework selection */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">
                Compliance frameworks
              </legend>
              {frameworks.map((fw) => {
                const defaultChecked = fw.slug === "hipaa-security";
                return (
                  <label
                    key={fw.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent",
                      defaultChecked && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <input
                      type="checkbox"
                      name="framework"
                      value={fw.id}
                      defaultChecked={defaultChecked}
                      className="mt-0.5 h-4 w-4 accent-primary"
                    />
                    <div>
                      <p className="text-sm font-medium">{fw.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {fw.description.split("—")[0].trim()} ·{" "}
                        {fw._count.templates} tasks
                      </p>
                    </div>
                    {defaultChecked && (
                      <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <Check className="h-3 w-3" />
                        Required
                      </span>
                    )}
                  </label>
                );
              })}
            </fieldset>

            {/* Hidden field to collect checked framework IDs (populated by JS) */}
            <input type="hidden" name="frameworkIds" id="frameworkIds" />

            {/* Org details */}
            <div className="space-y-4">
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
            </div>

            <Button type="submit" className="w-full">
              Create my compliance checklist
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Collect checkbox values into the hidden frameworkIds field */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var form = document.querySelector('form');
              form.addEventListener('submit', function() {
                var checked = Array.from(
                  document.querySelectorAll('input[name="framework"]:checked')
                ).map(function(cb) { return cb.value; });
                document.getElementById('frameworkIds').value = checked.join(',');
              });
            })();
          `,
        }}
      />
    </div>
  );
}
