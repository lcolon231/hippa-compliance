"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, CATEGORY_ORDER, STATUS_LABELS } from "@/lib/utils";
import { X } from "lucide-react";

const ALL = "ALL";

interface Framework {
  id: string;
  name: string;
}

interface Member {
  id: string;
  name: string | null;
  email: string;
}

interface TaskFiltersProps {
  frameworks: Framework[];
  members: Member[];
}

export function TaskFilters({ frameworks, members }: TaskFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const framework = searchParams.get("framework") ?? ALL;
  const category = searchParams.get("category") ?? ALL;
  const status = searchParams.get("status") ?? ALL;
  const assignee = searchParams.get("assignee") ?? ALL;
  const hasFilters =
    framework !== ALL || category !== ALL || status !== ALL || assignee !== ALL;

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // Changing the framework filter also clears category (different categories per framework)
    if (key === "framework") params.delete("category");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      {frameworks.length > 1 && (
        <Select
          value={framework}
          onValueChange={(v) => setParam("framework", v)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All frameworks</SelectItem>
            {frameworks.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={category} onValueChange={(v) => setParam("category", v)}>
        <SelectTrigger className="w-full sm:w-[220px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All categories</SelectItem>
          {CATEGORY_ORDER.map((c) => (
            <SelectItem key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => setParam("status", v)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={assignee} onValueChange={(v) => setParam("assignee", v)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Anyone</SelectItem>
          <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name ?? m.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.replace(pathname)}
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
