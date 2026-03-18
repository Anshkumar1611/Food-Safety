import { memo } from "react";
import Link from "next/link";
import { MessageSquarePlus } from "lucide-react";
import type { Supplier } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "./risk-badge";
import { CertificateBadge } from "./certificate-badge";
import { HighRiskSupplierBadge } from "./high-risk-badge";
import { certificateExpiryLabel } from "@/utils/certificate";
import { cn } from "@/lib/utils";

export const SupplierCard = memo(function SupplierCard({
  supplier,
  highlight,
}: {
  supplier: Supplier;
  highlight?: boolean;
}) {
  const expiryHint = certificateExpiryLabel(
    supplier.certificateStatus,
    supplier.certificateExpiresAt
  );
  const isHigh = supplier.riskRating === "High";

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        highlight && "ring-2 ring-amber-400/60",
        isHigh && "border-red-200/80 dark:border-red-900/50"
      )}
    >
      <CardHeader className="space-y-3 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {supplier.name}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {supplier.primaryCertificateName}
            </p>
          </div>
          {isHigh && <HighRiskSupplierBadge />}
        </div>
        <div className="flex flex-wrap gap-2">
          <RiskBadge rating={supplier.riskRating} />
          <CertificateBadge status={supplier.certificateStatus} />
        </div>
        {expiryHint && (
          <p
            className={cn(
              "text-sm font-medium",
              supplier.certificateStatus === "Expired" ||
                supplier.certificateStatus === "Expiring Soon"
                ? "text-amber-800 dark:text-amber-200"
                : "text-muted-foreground"
            )}
          >
            {expiryHint}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {supplier.openQueryCount}
          </span>{" "}
          open {supplier.openQueryCount === 1 ? "query" : "queries"}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/new-query?supplier=${supplier.id}`}
            className="gap-1.5"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Raise query
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
});
