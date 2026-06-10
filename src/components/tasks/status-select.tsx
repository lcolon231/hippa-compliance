"use client";

import { useOptimistic, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { updateTaskStatus } from "@/app/actions/tasks";
import { STATUS_LABELS, cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETE",
  "NOT_APPLICABLE",
] as const;

const TRIGGER_STYLES: Record<string, string> = {
  NOT_STARTED: "text-gray-700",
  IN_PROGRESS: "text-yellow-700",
  COMPLETE: "text-green-700",
  NOT_APPLICABLE: "text-slate-500",
};

interface StatusSelectProps {
  taskId: string;
  status: string;
  className?: string;
}

export function StatusSelect({ taskId, status, className }: StatusSelectProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);

  function handleChange(newStatus: string) {
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      try {
        await updateTaskStatus(taskId, newStatus);
      } catch {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: "Could not update the task status. Please try again.",
        });
      }
    });
  }

  return (
    <Select value={optimisticStatus} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "h-8 w-[140px] text-xs font-medium",
          TRIGGER_STYLES[optimisticStatus],
          isPending && "opacity-70",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
