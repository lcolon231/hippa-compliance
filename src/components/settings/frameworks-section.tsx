"use client";

import { useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { enableFramework, disableFramework } from "@/app/actions/frameworks";

interface Framework {
  id: string;
  name: string;
  description: string;
  _count: { templates: number };
}

interface FrameworksSectionProps {
  allFrameworks: Framework[];
  enabledIds: string[];
  isAdmin: boolean;
}

export function FrameworksSection({
  allFrameworks,
  enabledIds,
  isAdmin,
}: FrameworksSectionProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function toggleFramework(fw: Framework) {
    const isEnabled = enabledIds.includes(fw.id);
    startTransition(async () => {
      try {
        if (isEnabled) {
          await disableFramework(fw.id);
          toast({
            title: "Framework disabled",
            description: `${fw.name} removed from your active checklist. Existing task data is preserved.`,
          });
        } else {
          await enableFramework(fw.id);
          toast({
            title: "Framework enabled",
            description: `${fw.name} added — ${fw._count.templates} tasks created.`,
          });
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description:
            err instanceof Error ? err.message : "Could not update framework.",
        });
      }
    });
  }

  return (
    <ul className="divide-y rounded-xl border">
      {allFrameworks.map((fw) => {
        const enabled = enabledIds.includes(fw.id);
        return (
          <li
            key={fw.id}
            className="flex items-start gap-4 p-4 transition-colors hover:bg-accent/40"
          >
            <div className="mt-0.5">
              {enabled ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{fw.name}</p>
                {enabled && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-600/10 text-emerald-700"
                  >
                    Active
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {fw.description.split("—")[0].trim()} · {fw._count.templates}{" "}
                tasks
              </p>
            </div>
            {isAdmin && (
              <Button
                variant={enabled ? "outline" : "default"}
                size="sm"
                disabled={isPending}
                onClick={() => toggleFramework(fw)}
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {enabled ? "Disable" : "Enable"}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
