"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { createIncident } from "@/app/actions/incidents";
import { INCIDENT_SEVERITY_LABELS } from "@/lib/utils";

export function ReportIncidentDialog() {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [occurredAt, setOccurredAt] = useState("");
  const [phiInvolved, setPhiInvolved] = useState(false);

  function reset() {
    setTitle("");
    setDescription("");
    setSeverity("MEDIUM");
    setOccurredAt("");
    setPhiInvolved(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    startTransition(async () => {
      try {
        const { id } = await createIncident({
          title,
          description,
          severity,
          occurredAt: occurredAt || null,
          phiInvolved,
        });
        toast({ title: "Incident logged", description: "Recorded to the log." });
        setOpen(false);
        reset();
        router.push(`/incidents/${id}`);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Could not log incident",
          description:
            err instanceof Error ? err.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Report incident
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Report a security incident</DialogTitle>
            <DialogDescription>
              Log what happened. You can add the breach analysis afterward.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">What happened?</Label>
              <Input
                id="title"
                placeholder="Lost laptop, phishing email, misdirected fax..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Details</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="When, where, what systems or records were involved, what you've done so far..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INCIDENT_SEVERITY_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occurredAt">When did it occur?</Label>
                <Input
                  id="occurredAt"
                  type="date"
                  value={occurredAt}
                  onChange={(e) => setOccurredAt(e.target.value)}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={phiInvolved}
                onChange={(e) => setPhiInvolved(e.target.checked)}
              />
              PHI may have been involved
            </label>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !description.trim()}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Log incident
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
