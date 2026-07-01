"use client";

import { useState, useTransition } from "react";
import { GraduationCap, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  createTrainingRecord,
  deleteTrainingRecord,
} from "@/app/actions/training";
import { formatDate, trainingExpiryStatus, cn } from "@/lib/utils";

export interface TrainingItem {
  id: string;
  personName: string;
  courseName: string;
  completedAt: Date;
  expiresAt: Date | null;
}

const EXPIRY_BADGE: Record<
  ReturnType<typeof trainingExpiryStatus>,
  { label: string; className: string } | null
> = {
  expired: { label: "Expired", className: "bg-red-600/10 text-red-700" },
  expiring: {
    label: "Expiring soon",
    className: "bg-amber-500/10 text-amber-700",
  },
  valid: { label: "Current", className: "bg-emerald-600/10 text-emerald-700" },
  none: null,
};

export function TrainingSection({
  records,
  isAdmin,
}: {
  records: TrainingItem[];
  isAdmin: boolean;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  const [personName, setPersonName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [completedAt, setCompletedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  function resetForm() {
    setPersonName("");
    setCourseName("");
    setCompletedAt("");
    setExpiresAt("");
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!personName.trim() || !courseName.trim() || !completedAt) return;
    startTransition(async () => {
      try {
        await createTrainingRecord({
          personName,
          courseName,
          completedAt,
          expiresAt: expiresAt || null,
          notes: null,
        });
        toast({ title: "Added", description: "Training record saved." });
        resetForm();
        setShowForm(false);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Could not save",
          description: err instanceof Error ? err.message : "Please try again.",
        });
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteTrainingRecord(id);
        toast({ title: "Deleted", description: "Training record removed." });
      } catch {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Could not delete the record.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {showForm ? (
        <form
          onSubmit={handleAdd}
          className="space-y-4 rounded-xl border bg-muted/40 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="personName">Staff member</Label>
              <Input
                id="personName"
                placeholder="Full name"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseName">Training</Label>
              <Input
                id="courseName"
                placeholder="Annual HIPAA Security Awareness"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                maxLength={200}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedAt">Completed on</Label>
              <Input
                id="completedAt"
                type="date"
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">
                Expires{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={
                isPending ||
                !personName.trim() ||
                !courseName.trim() ||
                !completedAt
              }
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save record
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Add training record
        </Button>
      )}

      {records.length === 0 ? (
        <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed py-12 text-center">
          <GraduationCap className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">No training records yet</p>
          <p className="text-sm text-muted-foreground">
            Log each staff member&apos;s HIPAA training so you can prove
            workforce compliance at audit time.
          </p>
        </div>
      ) : (
        <ul className="divide-y rounded-xl border">
          {records.map((r) => {
            const badge = EXPIRY_BADGE[trainingExpiryStatus(r.expiresAt)];
            return (
              <li
                key={r.id}
                className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.personName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.courseName} · completed {formatDate(r.completedAt)}
                    {r.expiresAt && ` · expires ${formatDate(r.expiresAt)}`}
                  </p>
                </div>
                {badge && (
                  <Badge
                    variant="secondary"
                    className={cn("border-transparent", badge.className)}
                  >
                    {badge.label}
                  </Badge>
                )}
                {isAdmin && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete training record?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {r.personName}&apos;s &quot;{r.courseName}&quot;
                          record will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(r.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
