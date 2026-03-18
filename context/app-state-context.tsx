"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  FoodSafetyQuery,
  QueryPriority,
  QueryStatus,
  QueryType,
  Supplier,
} from "@/types";
import { MOCK_QUERIES, MOCK_SUPPLIERS } from "@/utils/mock-data";
import { formatISO } from "date-fns";

type AppStateContextValue = {
  suppliers: Supplier[];
  queries: FoodSafetyQuery[];
  /** Memoized list with open query counts derived from queries */
  suppliersWithCounts: Supplier[];
  getQueryById: (id: string) => FoodSafetyQuery | undefined;
  addQuery: (input: {
    supplierId: string;
    type: QueryType;
    priority: QueryPriority;
    description: string;
    fileName?: string | null;
  }) => string;
  addComment: (queryId: string, body: string) => void;
  updateQueryStatus: (queryId: string, status: QueryStatus) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function countOpenQueriesForSupplier(
  queries: FoodSafetyQuery[],
  supplierId: string
): number {
  return queries.filter(
    (q) =>
      q.supplierId === supplierId &&
      (q.status === "Pending" || q.status === "In Review")
  ).length;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [queries, setQueries] = useState<FoodSafetyQuery[]>(() => [
    ...MOCK_QUERIES,
  ]);
  const suppliers = MOCK_SUPPLIERS;

  const suppliersWithCounts = useMemo((): Supplier[] => {
    return suppliers.map((s) => ({
      ...s,
      openQueryCount: countOpenQueriesForSupplier(queries, s.id),
    }));
  }, [suppliers, queries]);

  const getQueryById = useCallback(
    (id: string) => queries.find((q) => q.id === id),
    [queries]
  );

  const addQuery = useCallback(
    (input: {
      supplierId: string;
      type: QueryType;
      priority: QueryPriority;
      description: string;
      fileName?: string | null;
    }) => {
      const supplier = suppliers.find((s) => s.id === input.supplierId);
      const name = supplier?.name ?? "Unknown";
      const id = `q-${Date.now()}`;
      const now = formatISO(new Date());
      const newQuery: FoodSafetyQuery = {
        id,
        supplierId: input.supplierId,
        supplierName: name,
        type: input.type,
        priority: input.priority,
        status: "Pending",
        description: input.description.trim(),
        createdAt: now,
        updatedAt: now,
        comments: [
          {
            id: `c-${Date.now()}`,
            author: "You",
            body: "Query submitted.",
            createdAt: now,
          },
        ],
        attachments: input.fileName
          ? [
              {
                id: `a-${Date.now()}`,
                name: input.fileName,
                sizeLabel: "Uploaded",
              },
            ]
          : [],
        statusHistory: [{ status: "Pending", at: now }],
      };
      setQueries((prev) => [newQuery, ...prev]);
      return id;
    },
    [suppliers]
  );

  const addComment = useCallback((queryId: string, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    const now = formatISO(new Date());
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id !== queryId) return q;
        return {
          ...q,
          updatedAt: now,
          comments: [
            ...q.comments,
            {
              id: `c-${Date.now()}`,
              author: "You",
              body: trimmed,
              createdAt: now,
            },
          ],
        };
      })
    );
  }, []);

  const updateQueryStatus = useCallback((queryId: string, status: QueryStatus) => {
    const now = formatISO(new Date());
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id !== queryId) return q;
        return {
          ...q,
          status,
          updatedAt: now,
          statusHistory: [...q.statusHistory, { status, at: now }],
        };
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      suppliers,
      queries,
      suppliersWithCounts,
      getQueryById,
      addQuery,
      addComment,
      updateQueryStatus,
    }),
    [
      suppliers,
      queries,
      suppliersWithCounts,
      getQueryById,
      addQuery,
      addComment,
      updateQueryStatus,
    ]
  );

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
