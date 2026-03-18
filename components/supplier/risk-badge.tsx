import { memo } from "react";
import type { RiskRating } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const riskConfig: Record<
  RiskRating,
  { label: string; className: string }
> = {
  Low: {
    label: "Low risk",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950 dark:text-emerald-200",
  },
  Medium: {
    label: "Medium risk",
    className: "bg-amber-100 text-amber-900 border-amber-200/80 dark:bg-amber-950 dark:text-amber-200",
  },
  High: {
    label: "High risk",
    className: "bg-red-100 text-red-800 border-red-200/80 dark:bg-red-950 dark:text-red-200",
  },
};

export const RiskBadge = memo(function RiskBadge({
  rating,
  className,
}: {
  rating: RiskRating;
  className?: string;
}) {
  const c = riskConfig[rating];
  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", c.className, className)}
    >
      {c.label}
    </Badge>
  );
});
