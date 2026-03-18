import { differenceInCalendarDays, parseISO } from "date-fns";
import type { CertificateStatus } from "@/types";

export function daysUntilExpiry(isoDate: string): number {
  return differenceInCalendarDays(parseISO(isoDate), new Date());
}

export function certificateExpiryLabel(
  status: CertificateStatus,
  expiresAt: string
): string | null {
  if (status === "Expired") return "Certificate expired";
  const days = daysUntilExpiry(expiresAt);
  if (days < 0) return "Certificate expired";
  if (days <= 30 && status === "Expiring Soon")
    return days === 0
      ? "Expires today"
      : days === 1
        ? "Expires tomorrow"
        : `Expires in ${days} days`;
  if (days <= 7) return `Expires in ${days} days`;
  return null;
}

export function deriveCertificateStatus(
  expiresAt: string
): CertificateStatus {
  const days = daysUntilExpiry(expiresAt);
  if (days < 0) return "Expired";
  if (days <= 30) return "Expiring Soon";
  return "Valid";
}
