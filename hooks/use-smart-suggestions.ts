"use client";

import { useMemo } from "react";
import type { Supplier } from "@/types";
import { daysUntilExpiry } from "@/utils/certificate";

export type SmartSuggestion = {
  id: string;
  supplierId: string;
  supplierName: string;
  message: string;
  action: "raise-query";
  variant: "critical" | "warning";
};

export function useSmartSuggestions(suppliers: Supplier[]): SmartSuggestion[] {
  return useMemo(() => {
    const out: SmartSuggestion[] = [];
    for (const s of suppliers) {
      const days = daysUntilExpiry(s.certificateExpiresAt);
      if (s.certificateStatus === "Expired" || days < 0) {
        out.push({
          id: `cert-exp-${s.id}`,
          supplierId: s.id,
          supplierName: s.name,
          message: `${s.name}: certificate expired — raise a certificate query.`,
          action: "raise-query",
          variant: "critical",
        });
      } else if (s.certificateStatus === "Expiring Soon" && days <= 14) {
        out.push({
          id: `cert-soon-${s.id}`,
          supplierId: s.id,
          supplierName: s.name,
          message: `${s.name}: certificate expires in ${days} day${days === 1 ? "" : "s"}.`,
          action: "raise-query",
          variant: days <= 7 ? "critical" : "warning",
        });
      }
      if (s.riskRating === "High" && s.openQueryCount === 0) {
        const exists = out.some((o) => o.supplierId === s.id && o.variant === "critical");
        if (!exists) {
          out.push({
            id: `high-risk-${s.id}`,
            supplierId: s.id,
            supplierName: s.name,
            message: `${s.name} is high risk with no open queries — consider a compliance check.`,
            action: "raise-query",
            variant: "warning",
          });
        }
      }
    }
    return out.slice(0, 6);
  }, [suppliers]);
}
