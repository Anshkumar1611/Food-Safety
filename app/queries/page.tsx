"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { compareDesc, parseISO } from "date-fns";
import { ArrowUpDown, Filter, Inbox } from "lucide-react";
import { useAppState } from "@/context/app-state-context";
import type { FoodSafetyQuery, QueryPriority } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QueryListRow } from "@/components/query/query-list-row";

type SortKey = "newest" | "oldest" | "priority";

const priorityOrder: Record<QueryPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function sortQueries(
  list: FoodSafetyQuery[],
  sort: SortKey
): FoodSafetyQuery[] {
  const copy = [...list];
  if (sort === "newest") {
    copy.sort((a, b) =>
      compareDesc(parseISO(a.createdAt), parseISO(b.createdAt))
    );
  } else if (sort === "oldest") {
    copy.sort((a, b) =>
      compareDesc(parseISO(b.createdAt), parseISO(a.createdAt))
    );
  } else {
    copy.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }
  return copy;
}

function filterByTab(
  queries: FoodSafetyQuery[],
  tab: string
): FoodSafetyQuery[] {
  if (tab === "all") return queries;
  if (tab === "pending")
    return queries.filter((q) => q.status === "Pending");
  if (tab === "review")
    return queries.filter((q) => q.status === "In Review");
  if (tab === "resolved")
    return queries.filter(
      (q) => q.status === "Resolved" || q.status === "Rejected"
    );
  return queries;
}

function useFilteredQueries(
  queries: FoodSafetyQuery[],
  tab: string,
  sort: SortKey,
  priorityFilter: QueryPriority | "all"
) {
  return useMemo(() => {
    let list = filterByTab(queries, tab);
    if (priorityFilter !== "all") {
      list = list.filter((q) => q.priority === priorityFilter);
    }
    return sortQueries(list, sort);
  }, [queries, tab, sort, priorityFilter]);
}

function QueryListSection({
  queries,
  emptyHint,
}: {
  queries: FoodSafetyQuery[];
  emptyHint: string;
}) {
  if (queries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <Inbox className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="font-medium">No queries here</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {emptyHint}
        </p>
        <Button asChild className="mt-4">
          <Link href="/new-query">Raise query</Link>
        </Button>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {queries.map((q) => (
        <li key={q.id}>
          <QueryListRow query={q} />
        </li>
      ))}
    </ul>
  );
}

export default function QueriesPage() {
  const { queries } = useAppState();
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [priorityFilter, setPriorityFilter] = useState<
    QueryPriority | "all"
  >("all");

  const listAll = useFilteredQueries(queries, "all", sort, priorityFilter);
  const listPending = useFilteredQueries(
    queries,
    "pending",
    sort,
    priorityFilter
  );
  const listReview = useFilteredQueries(
    queries,
    "review",
    sort,
    priorityFilter
  );
  const listResolved = useFilteredQueries(
    queries,
    "resolved",
    sort,
    priorityFilter
  );

  const counts = useMemo(() => {
    return {
      all: queries.length,
      pending: queries.filter((q) => q.status === "Pending").length,
      review: queries.filter((q) => q.status === "In Review").length,
      resolved: queries.filter(
        (q) => q.status === "Resolved" || q.status === "Rejected"
      ).length,
    };
  }, [queries]);

  const cyclePriority = useCallback(() => {
    setPriorityFilter((p) => {
      if (p === "all") return "High";
      if (p === "High") return "Medium";
      if (p === "Medium") return "Low";
      return "all";
    });
  }, []);

  const emptySecondary =
    priorityFilter === "all"
      ? "Submit a query from the dashboard or Raise query."
      : "Try clearing the priority filter or another tab.";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Query tracking
          </h1>
          <p className="mt-1 text-muted-foreground">
            Filter by status, sort by date or priority.
          </p>
        </div>
        <Button asChild className="shrink-0 font-semibold">
          <Link href="/new-query">Raise query</Link>
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/80 p-1">
            <TabsTrigger value="all" className="gap-1.5">
              All
              <span className="rounded-full bg-background/80 px-1.5 text-xs tabular-nums">
                {counts.all}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              Pending
              <span className="rounded-full bg-background/80 px-1.5 text-xs tabular-nums">
                {counts.pending}
              </span>
            </TabsTrigger>
            <TabsTrigger value="review" className="gap-1.5">
              In review
              <span className="rounded-full bg-background/80 px-1.5 text-xs tabular-nums">
                {counts.review}
              </span>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-1.5">
              Resolved
              <span className="rounded-full bg-background/80 px-1.5 text-xs tabular-nums">
                {counts.resolved}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={cyclePriority}
            >
              <Filter className="h-4 w-4" />
              Priority:{" "}
              {priorityFilter === "all" ? "Any" : priorityFilter}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort("newest")}>
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("oldest")}>
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("priority")}>
                  Priority (high first)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <QueryListSection
            queries={listAll}
            emptyHint={
              tab === "all"
                ? "No queries yet. " + emptySecondary
                : emptySecondary
            }
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <QueryListSection
            queries={listPending}
            emptyHint={
              "No pending queries. " + emptySecondary
            }
          />
        </TabsContent>
        <TabsContent value="review" className="mt-6">
          <QueryListSection
            queries={listReview}
            emptyHint={
              "Nothing in review. " + emptySecondary
            }
          />
        </TabsContent>
        <TabsContent value="resolved" className="mt-6">
          <QueryListSection
            queries={listResolved}
            emptyHint={
              "No resolved or rejected queries here. " + emptySecondary
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
