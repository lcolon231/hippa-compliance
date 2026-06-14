import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, cn } from "@/lib/utils";

export const CATEGORY_STYLES: Record<string, string> = {
  // HIPAA Security Rule
  ADMINISTRATIVE: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  PHYSICAL: "bg-green-100 text-green-800 hover:bg-green-100",
  TECHNICAL: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  ORGANIZATIONAL: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  POLICIES: "bg-red-100 text-red-800 hover:bg-red-100",
  // HIPAA Privacy Rule
  PRIVACY_PRACTICES: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  PRIVACY_USES: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  PRIVACY_WORKFORCE: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  // NIST CSF
  CSF_IDENTIFY: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  CSF_PROTECT: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  CSF_DETECT: "bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-100",
  CSF_RESPOND: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  CSF_RECOVER: "bg-amber-100 text-amber-800 hover:bg-amber-100",
};

export const CATEGORY_BAR_COLORS: Record<string, string> = {
  ADMINISTRATIVE: "bg-blue-500",
  PHYSICAL: "bg-green-500",
  TECHNICAL: "bg-purple-500",
  ORGANIZATIONAL: "bg-orange-500",
  POLICIES: "bg-red-500",
  PRIVACY_PRACTICES: "bg-teal-500",
  PRIVACY_USES: "bg-cyan-500",
  PRIVACY_WORKFORCE: "bg-sky-500",
  CSF_IDENTIFY: "bg-indigo-500",
  CSF_PROTECT: "bg-violet-500",
  CSF_DETECT: "bg-fuchsia-500",
  CSF_RESPOND: "bg-rose-500",
  CSF_RECOVER: "bg-amber-500",
};

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-transparent", CATEGORY_STYLES[category])}
    >
      {CATEGORY_LABELS[category] ?? category}
    </Badge>
  );
}
