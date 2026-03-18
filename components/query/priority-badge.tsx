import { memo } from "react";
import type { QueryPriority } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const priorityMap: Record<
  QueryPriority,
  { variant: React.ComponentProps<typeof Badge>["variant"]; label: string }
> = {
  High: { variant: "danger", label: "High" },
  Medium: { variant: "warning", label: "Medium" },
  Low: { variant: "muted", label: "Low" },
};

export const PriorityBadge = memo(function PriorityBadge({
  priority,
  className,
}: {
  priority: QueryPriority;
  className?: string;
}) {
  const m = priorityMap[priority];
  return (
    <Badge variant={m.variant} className={cn(className)}>
      {m.label}
    </Badge>
  );
});
