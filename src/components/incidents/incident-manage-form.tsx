"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateIncident } from "@/app/actions/incidents";
import {
  INCIDENT_SEVERITY_LABELS,
  INCIDENT_STATUS_LABELS,
  BREACH_DETERMINATION_LABELS,
} from "@/lib/utils";

interface IncidentManageFormProps {
  incidentId: string;
  status: string;
  severity: string;
  determination: string;
  individualsAffected: number | null;
  phiInvolved: boolean;
  notifiedAt: Date | null;
}

export function IncidentManageForm({
  incidentId,
  status: initialStatus,
  severity: initialSeverity,
  determination: initialDetermination,
  individualsAffected: initialAffected,
  phiInvolved: initialPhi,
  notifiedAt: initialNotifiedAt,
}: IncidentManageFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState(initialStatus);
  const [severity, setSeverity] = useState(initialSeverity);
  const [determination, setDetermination] = useState(initialDetermination);
  const [phiInvolved, setPhiInvolved] = useState(initialPhi);
  const [affected, setAffected] = useState(
    initialAffected != null ? String(initialAffected) : ""
  );
  const [notifiedAt, setNotifiedAt] = useState(
    initialNotifiedAt ? initialNotifiedAt.toISOString().slice(0, 10) : ""
  );

  function handleSave() {
    startTransition(async () => {
      try {
        await updateIncident(incidentId, {
          status: status as never,
          severity: severity as never,
          determination: determination as never,
          phiInvolved,
          individualsAffected: affected ? Number(affected) : null,
          notifiedAt: notifiedAt || null,
        });
        toast({ title: "Saved", description: "Incident updated." });
      } catch {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Could not update the incident.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INCIDENT_STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Severity</Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INCIDENT_SEVERITY_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/40 p-4">
        <p className="mb-3 text-sm font-medium">Breach analysis</p>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={phiInvolved}
              onChange={(e) => setPhiInvolved(e.target.checked)}
            />
            PHI was involved
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Breach determination</Label>
              <Select value={determination} onValueChange={setDetermination}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BREACH_DETERMINATION_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="affected">Individuals affected</Label>
              <Input
                id="affected"
                type="number"
                min={0}
                placeholder="0"
                value={affected}
                onChange={(e) => setAffected(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notifiedAt">
              Notification date{" "}
              <span className="text-muted-foreground">
                (when affected individuals / HHS were notified)
              </span>
            </Label>
            <Input
              id="notifiedAt"
              type="date"
              value={notifiedAt}
              onChange={(e) => setNotifiedAt(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save
      </Button>
    </div>
  );
}
