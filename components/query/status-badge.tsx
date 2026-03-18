import { memo } from "react";
import type { QueryStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap: Record<
  QueryStatus,
  { variant: React.ComponentProps<typeof Badge>["variant"]; label: string }
> = {
  Pending: { variant: "warning", label: "Pending" },
  "In Review": { variant: "secondary", label: "In review" },
  Resolved: { variant: "success", label: "Resolved" },
  Rejected: { variant: "destructive", label: "Rejected" },
};

export const QueryStatusBadge = memo(function QueryStatusBadge({
  status,
  className,
}: {
  status: QueryStatus;
  className?: string;
}) {
  const m = statusMap[status];
  return (
    <Badge variant={m.variant} className={cn(className)}>
      {m.label}
    </Badge>
  );
});
