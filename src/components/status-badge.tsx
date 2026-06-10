import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  COMPLETE: "bg-green-100 text-green-800 hover:bg-green-100",
  NOT_APPLICABLE: "bg-slate-100 text-slate-500 hover:bg-slate-100",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", STATUS_STYLES[status])}
    >
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
