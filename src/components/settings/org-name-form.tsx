"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updateOrgName } from "@/app/actions/settings";

export function OrgNameForm({
  initialName,
  canEdit,
}: {
  initialName: string;
  canEdit: boolean;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await updateOrgName(name);
        toast({ title: "Saved", description: "Organization name updated." });
      } catch {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Could not update the organization name.",
        });
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="orgName">Organization name</Label>
        <Input
          id="orgName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!canEdit}
          maxLength={120}
        />
        {!canEdit && (
          <p className="text-xs text-muted-foreground">
            Only admins can change the organization name.
          </p>
        )}
      </div>
      {canEdit && (
        <Button
          onClick={handleSave}
          disabled={isPending || !name.trim() || name === initialName}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </Button>
      )}
    </div>
  );
}
