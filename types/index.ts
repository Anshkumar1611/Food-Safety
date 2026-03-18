export type RiskRating = "Low" | "Medium" | "High";

export type CertificateStatus = "Valid" | "Expired" | "Expiring Soon";

export interface Certificate {
  id: string;
  name: string;
  expiresAt: string;
  status: CertificateStatus;
}

export interface Supplier {
  id: string;
  name: string;
  riskRating: RiskRating;
  certificateStatus: CertificateStatus;
  certificateExpiresAt: string;
  primaryCertificateName: string;
  openQueryCount: number;
}

export type QueryType =
  | "Allergen Info"
  | "HACCP"
  | "Certificate Expiry"
  | "Traceability"
  | "Microbiological"
  | "Other";

export type QueryPriority = "High" | "Medium" | "Low";

export type QueryStatus = "Pending" | "In Review" | "Resolved" | "Rejected";

export interface QueryComment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface QueryAttachment {
  id: string;
  name: string;
  sizeLabel: string;
}

export interface StatusHistoryEntry {
  status: QueryStatus;
  at: string;
}

export interface FoodSafetyQuery {
  id: string;
  supplierId: string;
  supplierName: string;
  type: QueryType;
  priority: QueryPriority;
  status: QueryStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  comments: QueryComment[];
  attachments: QueryAttachment[];
  statusHistory: StatusHistoryEntry[];
}
