import { memo } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { FoodSafetyQuery } from "@/types";
import { QueryStatusBadge } from "./status-badge";
import { PriorityBadge } from "./priority-badge";
import { QueryMiniTimeline } from "./query-mini-timeline";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const QueryListRow = memo(function QueryListRow({
  query,
}: {
  query: FoodSafetyQuery;
}) {
  return (
    <Link
      href={`/queries/${query.id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between"
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">
            {query.supplierName}
          </span>
          <QueryStatusBadge status={query.status} />
          <PriorityBadge priority={query.priority} />
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {query.type} · {query.description.slice(0, 80)}
          {query.description.length > 80 ? "…" : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          Created {format(parseISO(query.createdAt), "MMM d, yyyy")}
        </p>
        <div className="pt-1">
          <QueryMiniTimeline status={query.status} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary opacity-80 group-hover:opacity-100">
        View
        <ChevronRight className="h-4 w-4" />
      </div>
    </Link>
  );
});
