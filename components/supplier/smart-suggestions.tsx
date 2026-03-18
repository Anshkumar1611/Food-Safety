"use client";

import Link from "next/link";
import { Lightbulb, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SmartSuggestion } from "@/hooks/use-smart-suggestions";
import { cn } from "@/lib/utils";

export function SmartSuggestionsPanel({
  suggestions,
}: {
  suggestions: SmartSuggestion[];
}) {
  if (suggestions.length === 0) return null;

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden />
          Smart suggestions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on certificates and risk — act before issues escalate.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {suggestions.map((s) => (
          <div
            key={s.id}
            className={cn(
              "flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between",
              s.variant === "critical"
                ? "border-red-200 bg-red-50/80 dark:border-red-900 dark:bg-red-950/30"
                : "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20"
            )}
          >
            <div className="flex gap-2">
              <Lightbulb
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  s.variant === "critical"
                    ? "text-red-600"
                    : "text-amber-600"
                )}
                aria-hidden
              />
              <p className="text-sm font-medium leading-snug">{s.message}</p>
            </div>
            <Button size="sm" variant="critical" className="shrink-0" asChild>
              <Link href={`/new-query?supplier=${s.supplierId}`}>
                Raise query
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
