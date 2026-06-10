import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** score = COMPLETE / (total - NOT_APPLICABLE) * 100, rounded */
export function calculateComplianceScore(tasks: { status: string }[]): number {
  const applicable = tasks.filter((t) => t.status !== "NOT_APPLICABLE");
  if (applicable.length === 0) return 0;
  const complete = applicable.filter((t) => t.status === "COMPLETE").length;
  return Math.round((complete / applicable.length) * 100);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  ADMINISTRATIVE: "Administrative Safeguards",
  PHYSICAL: "Physical Safeguards",
  TECHNICAL: "Technical Safeguards",
  ORGANIZATIONAL: "Organizational (BAAs)",
  POLICIES: "Policies & Documentation",
};

export const CATEGORY_CITATIONS: Record<string, string> = {
  ADMINISTRATIVE: "§ 164.308",
  PHYSICAL: "§ 164.310",
  TECHNICAL: "§ 164.312",
  ORGANIZATIONAL: "§ 164.314",
  POLICIES: "§ 164.316",
};

export const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete",
  NOT_APPLICABLE: "N/A",
};

export const CATEGORY_ORDER = [
  "ADMINISTRATIVE",
  "PHYSICAL",
  "TECHNICAL",
  "ORGANIZATIONAL",
  "POLICIES",
] as const;
