import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, cn } from "@/lib/utils";

export const CATEGORY_STYLES: Record<string, string> = {
  ADMINISTRATIVE: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  PHYSICAL: "bg-green-100 text-green-800 hover:bg-green-100",
  TECHNICAL: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  ORGANIZATIONAL: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  POLICIES: "bg-red-100 text-red-800 hover:bg-red-100",
};

export const CATEGORY_BAR_COLORS: Record<string, string> = {
  ADMINISTRATIVE: "bg-blue-500",
  PHYSICAL: "bg-green-500",
  TECHNICAL: "bg-purple-500",
  ORGANIZATIONAL: "bg-orange-500",
  POLICIES: "bg-red-500",
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
