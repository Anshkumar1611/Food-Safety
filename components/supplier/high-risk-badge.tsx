import { AlertTriangle } from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";

export const HighRiskSupplierBadge = memo(function HighRiskSupplierBadge({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-red-300 bg-red-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-200",
        className
      )}
    >
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      High risk supplier
    </span>
  );
});
