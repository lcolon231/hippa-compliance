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

// ── Category metadata ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  // HIPAA Security Rule
  ADMINISTRATIVE: "Administrative Safeguards",
  PHYSICAL: "Physical Safeguards",
  TECHNICAL: "Technical Safeguards",
  ORGANIZATIONAL: "Organizational (BAAs)",
  POLICIES: "Policies & Documentation",
  // HIPAA Privacy Rule
  PRIVACY_PRACTICES: "Patient Rights & Notices",
  PRIVACY_USES: "Uses & Disclosures",
  PRIVACY_WORKFORCE: "Workforce Requirements",
  // NIST CSF
  CSF_IDENTIFY: "Identify",
  CSF_PROTECT: "Protect",
  CSF_DETECT: "Detect",
  CSF_RESPOND: "Respond",
  CSF_RECOVER: "Recover",
};

export const CATEGORY_CITATIONS: Record<string, string> = {
  ADMINISTRATIVE: "§ 164.308",
  PHYSICAL: "§ 164.310",
  TECHNICAL: "§ 164.312",
  ORGANIZATIONAL: "§ 164.314",
  POLICIES: "§ 164.316",
  PRIVACY_PRACTICES: "§ 164.520–528",
  PRIVACY_USES: "§ 164.502–514",
  PRIVACY_WORKFORCE: "§ 164.530",
  CSF_IDENTIFY: "ID",
  CSF_PROTECT: "PR",
  CSF_DETECT: "DE",
  CSF_RESPOND: "RS",
  CSF_RECOVER: "RC",
};

/** Ordered category lists per framework slug */
export const FRAMEWORK_CATEGORY_ORDER: Record<string, readonly string[]> = {
  "hipaa-security": [
    "ADMINISTRATIVE",
    "PHYSICAL",
    "TECHNICAL",
    "ORGANIZATIONAL",
    "POLICIES",
  ],
  "hipaa-privacy": [
    "PRIVACY_PRACTICES",
    "PRIVACY_USES",
    "PRIVACY_WORKFORCE",
  ],
  "nist-csf": [
    "CSF_IDENTIFY",
    "CSF_PROTECT",
    "CSF_DETECT",
    "CSF_RESPOND",
    "CSF_RECOVER",
  ],
};

/** All categories in display order (used by task filters etc.) */
export const CATEGORY_ORDER = [
  "ADMINISTRATIVE",
  "PHYSICAL",
  "TECHNICAL",
  "ORGANIZATIONAL",
  "POLICIES",
  "PRIVACY_PRACTICES",
  "PRIVACY_USES",
  "PRIVACY_WORKFORCE",
  "CSF_IDENTIFY",
  "CSF_PROTECT",
  "CSF_DETECT",
  "CSF_RESPOND",
  "CSF_RECOVER",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete",
  NOT_APPLICABLE: "N/A",
};
