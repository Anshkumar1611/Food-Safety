"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

export type DashboardFilter = "highRisk" | "expired" | "pendingQueries";

const labels: Record<DashboardFilter, string> = {
  highRisk: "High risk",
  expired: "Expired certificates",
  pendingQueries: "Pending queries",
};

export const FilterChips = memo(function FilterChips({
  active,
  onToggle,
}: {
  active: Set<DashboardFilter>;
  onToggle: (key: DashboardFilter) => void;
}) {
  const keys: DashboardFilter[] = [
    "highRisk",
    "expired",
    "pendingQueries",
  ];
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
      {keys.map((key) => {
        const isOn = active.has(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              isOn
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-pressed={isOn}
          >
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
});
