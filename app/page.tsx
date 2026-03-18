"use client";

import { useMemo, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SupplierCard } from "@/components/supplier/supplier-card";
import {
  FilterChips,
  type DashboardFilter,
} from "@/components/supplier/filter-chips";
import { SmartSuggestionsPanel } from "@/components/supplier/smart-suggestions";
import { useSmartSuggestions } from "@/hooks/use-smart-suggestions";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardContent() {
  const { suppliersWithCounts, queries } = useAppState();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Set<DashboardFilter>>(new Set());

  const toggleFilter = useCallback((key: DashboardFilter) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const pendingSupplierIds = useMemo(() => {
    const ids = new Set<string>();
    for (const q of queries) {
      if (q.status === "Pending") ids.add(q.supplierId);
    }
    return ids;
  }, [queries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return suppliersWithCounts.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q)) return false;
      if (filters.has("highRisk") && s.riskRating !== "High") return false;
      if (filters.has("expired") && s.certificateStatus !== "Expired")
        return false;
      if (filters.has("pendingQueries") && !pendingSupplierIds.has(s.id))
        return false;
      return true;
    });
  }, [suppliersWithCounts, search, filters, pendingSupplierIds]);

  const suggestions = useSmartSuggestions(suppliersWithCounts);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Supplier dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Risk, certificates, and open queries at a glance.
          </p>
        </div>
        <Button size="lg" className="shrink-0 font-semibold shadow-sm" asChild>
          <Link href="/new-query">Raise query</Link>
        </Button>
      </div>

      <SmartSuggestionsPanel suggestions={suggestions} />

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers…"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search suppliers"
          />
        </div>
        <FilterChips active={filters} onToggle={toggleFilter} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <p className="font-medium text-foreground">No suppliers match</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try clearing filters or search, or raise a query from the button
            above.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setFilters(new Set());
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <li key={s.id}>
              <SupplierCard
                supplier={s}
                highlight={
                  s.certificateStatus === "Expiring Soon" ||
                  s.certificateStatus === "Expired"
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
