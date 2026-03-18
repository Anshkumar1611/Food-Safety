import { memo } from "react";
import type { CertificateStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const certConfig: Record<
  CertificateStatus,
  { label: string; variant: "success" | "danger" | "warning" }
> = {
  Valid: { label: "Valid", variant: "success" },
  Expired: { label: "Expired", variant: "danger" },
  "Expiring Soon": { label: "Expiring soon", variant: "warning" },
};

export const CertificateBadge = memo(function CertificateBadge({
  status,
  className,
}: {
  status: CertificateStatus;
  className?: string;
}) {
  const c = certConfig[status];
  return (
    <Badge variant={c.variant} className={cn(className)}>
      {c.label}
    </Badge>
  );
});
