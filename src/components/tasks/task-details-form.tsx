"use client";

import { useState, useTransition } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { updateTaskDetails, setTaskRecurrence } from "@/app/actions/tasks";
import { RECURRENCE_OPTIONS } from "@/lib/recurrence";
import { Loader2, RefreshCw } from "lucide-react";

const UNASSIGNED = "UNASSIGNED";

interface TaskDetailsFormProps {
  taskId: string;
  notes: string | null;
  dueDate: Date | null;
  assigneeId: string | null;
  recurrenceMonths: number | null;
  members: { id: string; name: string | null; email: string }[];
}

export function TaskDetailsForm({
  taskId,
  notes: initialNotes,
  dueDate: initialDueDate,
  assigneeId: initialAssigneeId,
  recurrenceMonths: initialRecurrence,
  members,
}: TaskDetailsFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [recurrencePending, startRecurrenceTransition] = useTransition();

  const [notes, setNotes] = useState(initialNotes ?? "");
  const [dueDate, setDueDate] = useState(
    initialDueDate ? initialDueDate.toISOString().slice(0, 10) : ""
  );
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId ?? UNASSIGNED);
  const [recurrence, setRecurrence] = useState(String(initialRecurrence ?? 0));

  function handleSave() {
    startTransition(async () => {
      try {
        await updateTaskDetails(taskId, {
          notes: notes || null,
          dueDate: dueDate || null,
          assigneeId: assigneeId === UNASSIGNED ? null : assigneeId,
        });
        toast({ title: "Saved", description: "Task details updated." });
      } catch {
        toast({
          variant: "destructive",
          title: "Save failed",
          description: "Could not save task details. Please try again.",
        });
      }
    });
  }

  function handleRecurrenceChange(value: string) {
    setRecurrence(value);
    startRecurrenceTransition(async () => {
      try {
        await setTaskRecurrence(taskId, Number(value));
        toast({
          title: "Recurrence updated",
          description:
            Number(value) > 0
              ? "This task will reopen automatically each cycle."
              : "This task is now one-time.",
        });
      } catch {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Could not update the recurrence.",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Assignee</Label>
          <Select value={assigneeId} onValueChange={setAssigneeId}>
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name ?? m.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          Recurrence
        </Label>
        <Select value={recurrence} onValueChange={handleRecurrenceChange}>
          <SelectTrigger disabled={recurrencePending}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RECURRENCE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={String(o.value)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Recurring tasks (annual risk assessment, quarterly access reviews)
          reopen automatically when the next cycle comes due.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={4}
          placeholder="Implementation notes, links to policies, who you talked to..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save details
      </Button>
    </div>
  );
}
