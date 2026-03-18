import { memo } from "react";
import type { QueryStatus } from "@/types";
import { cn } from "@/lib/utils";

const phases: { key: string; label: string; match: (s: QueryStatus) => boolean }[] = [
  { key: "p", label: "Submitted", match: () => true },
  {
    key: "r",
    label: "Review",
    match: (s) => s === "In Review" || s === "Resolved" || s === "Rejected",
  },
  {
    key: "o",
    label: "Done",
    match: (s) => s === "Resolved" || s === "Rejected",
  },
];

export const QueryMiniTimeline = memo(function QueryMiniTimeline({
  status,
}: {
  status: QueryStatus;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="img"
      aria-label={`Status progress: ${status}`}
    >
      {phases.map((phase, i) => {
        const active = phase.match(status);
        const isRejected = status === "Rejected" && phase.key === "o";
        return (
          <div key={phase.key} className="flex items-center gap-1.5">
            {i > 0 && (
              <div
                className={cn(
                  "h-0.5 w-6 rounded-full",
                  active ? "bg-primary" : "bg-muted"
                )}
              />
            )}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2",
                  active
                    ? isRejected
                      ? "border-destructive bg-destructive"
                      : phase.key === "o" && status === "Resolved"
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-primary bg-primary"
                    : "border-muted-foreground/30 bg-background"
                )}
              />
              <span className="hidden text-[10px] text-muted-foreground sm:block">
                {phase.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});
