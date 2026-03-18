"use client";

import { memo, useMemo } from "react";
import { format, parseISO } from "date-fns";
import type { QueryStatus, StatusHistoryEntry } from "@/types";
import { cn } from "@/lib/utils";
import { Check, Circle, X } from "lucide-react";

export const QueryTimeline = memo(function QueryTimeline({
  currentStatus,
  statusHistory,
}: {
  currentStatus: QueryStatus;
  statusHistory: StatusHistoryEntry[];
}) {
  const steps = useMemo(() => {
    const pendingAt =
      statusHistory.find((h) => h.status === "Pending")?.at ?? "";
    const reviewAt = statusHistory.find((h) => h.status === "In Review")?.at;
    const resolvedAt = statusHistory.find((h) => h.status === "Resolved")?.at;
    const rejectedAt = statusHistory.find((h) => h.status === "Rejected")?.at;

    const outcome =
      currentStatus === "Resolved" || resolvedAt
        ? ("resolved" as const)
        : currentStatus === "Rejected" || rejectedAt
          ? ("rejected" as const)
          : ("pending" as const);

    return [
      {
        id: "submitted",
        label: "Submitted",
        description: "Query received",
        complete: true,
        at: pendingAt,
        icon: Circle as typeof Circle,
        tone: "done" as const,
      },
      {
        id: "review",
        label: "In review",
        description: "Under assessment",
        complete:
          currentStatus !== "Pending" ||
          !!reviewAt ||
          outcome !== "pending",
        active: currentStatus === "In Review",
        at: reviewAt,
        icon: Circle,
        tone:
          currentStatus === "In Review"
            ? ("active" as const)
            : currentStatus === "Pending"
              ? ("todo" as const)
              : ("done" as const),
      },
      {
        id: outcome === "resolved" ? "resolved" : "rejected",
        label: outcome === "resolved" ? "Resolved" : "Rejected",
        description:
          outcome === "resolved"
            ? "Closed — satisfactory"
            : outcome === "rejected"
              ? "Closed — needs resubmission"
              : "Awaiting outcome",
        complete: outcome !== "pending",
        at: resolvedAt ?? rejectedAt,
        icon: outcome === "resolved" ? Check : outcome === "rejected" ? X : Circle,
        tone:
          outcome === "resolved"
            ? ("success" as const)
            : outcome === "rejected"
              ? ("reject" as const)
              : ("todo" as const),
      },
    ];
  }, [currentStatus, statusHistory]);

  return (
    <ol className="relative">
      <div
        className="absolute left-[15px] top-8 bottom-8 w-px bg-border"
        aria-hidden
      />
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        return (
          <li
            key={step.id}
            className={cn("relative flex gap-4", !isLast && "pb-8")}
          >
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-card",
                step.tone === "done" &&
                  "border-primary text-primary",
                step.tone === "active" &&
                  "border-amber-500 text-amber-600 ring-2 ring-amber-500/20",
                step.tone === "success" &&
                  "border-emerald-600 text-emerald-600",
                step.tone === "reject" &&
                  "border-destructive text-destructive",
                step.tone === "todo" &&
                  "border-muted-foreground/25 text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="font-semibold leading-tight">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
              {step.at && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {format(parseISO(step.at), "MMM d, yyyy · HH:mm")}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
