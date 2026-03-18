import type { FoodSafetyQuery, Supplier } from "@/types";
import { addDays, formatISO, subDays } from "date-fns";

const now = new Date();

function iso(d: Date) {
  return formatISO(d);
}

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "s1",
    name: "Nordic Grain Co.",
    riskRating: "Low",
    certificateStatus: "Valid",
    certificateExpiresAt: iso(addDays(now, 180)),
    primaryCertificateName: "BRC Food Safety v9",
    openQueryCount: 0,
  },
  {
    id: "s2",
    name: "Pacific Spice Imports",
    riskRating: "High",
    certificateStatus: "Expiring Soon",
    certificateExpiresAt: iso(addDays(now, 4)),
    primaryCertificateName: "FSSC 22000",
    openQueryCount: 3,
  },
  {
    id: "s3",
    name: "GreenLeaf Organics",
    riskRating: "Medium",
    certificateStatus: "Valid",
    certificateExpiresAt: iso(addDays(now, 45)),
    primaryCertificateName: "Organic EU",
    openQueryCount: 1,
  },
  {
    id: "s4",
    name: "EuroDairy Ltd",
    riskRating: "Medium",
    certificateStatus: "Expired",
    certificateExpiresAt: iso(subDays(now, 12)),
    primaryCertificateName: "IFS Food",
    openQueryCount: 2,
  },
  {
    id: "s5",
    name: "AsiaPack Materials",
    riskRating: "High",
    certificateStatus: "Expiring Soon",
    certificateExpiresAt: iso(addDays(now, 14)),
    primaryCertificateName: "BRC Packaging",
    openQueryCount: 0,
  },
  {
    id: "s6",
    name: "ColdChain Logistics",
    riskRating: "Low",
    certificateStatus: "Valid",
    certificateExpiresAt: iso(addDays(now, 90)),
    primaryCertificateName: "GDP Certificate",
    openQueryCount: 0,
  },
];

export const MOCK_QUERIES: FoodSafetyQuery[] = [
  {
    id: "q1",
    supplierId: "s2",
    supplierName: "Pacific Spice Imports",
    type: "Allergen Info",
    priority: "High",
    status: "Pending",
    description:
      "Please confirm cross-contact controls for sesame on line 2 for SKU SP-440.",
    createdAt: iso(subDays(now, 2)),
    updatedAt: iso(subDays(now, 2)),
    comments: [
      {
        id: "c1",
        author: "You",
        body: "Raised for upcoming NPD review.",
        createdAt: iso(subDays(now, 2)),
      },
    ],
    attachments: [{ id: "a1", name: "spec_draft.pdf", sizeLabel: "240 KB" }],
    statusHistory: [
      { status: "Pending", at: iso(subDays(now, 2)) },
    ],
  },
  {
    id: "q2",
    supplierId: "s4",
    supplierName: "EuroDairy Ltd",
    type: "Certificate Expiry",
    priority: "High",
    status: "In Review",
    description:
      "IFS certificate shows expired — need updated scope and audit report.",
    createdAt: iso(subDays(now, 5)),
    updatedAt: iso(subDays(now, 1)),
    comments: [
      {
        id: "c2",
        author: "Supplier (EuroDairy)",
        body: "Audit scheduled next week; interim letter attached internally.",
        createdAt: iso(subDays(now, 3)),
      },
      {
        id: "c3",
        author: "QA Team",
        body: "Acknowledged. Awaiting formal certificate.",
        createdAt: iso(subDays(now, 1)),
      },
    ],
    attachments: [],
    statusHistory: [
      { status: "Pending", at: iso(subDays(now, 5)) },
      { status: "In Review", at: iso(subDays(now, 4)) },
    ],
  },
  {
    id: "q3",
    supplierId: "s3",
    supplierName: "GreenLeaf Organics",
    type: "HACCP",
    priority: "Medium",
    status: "Resolved",
    description: "Validate CCP for metal detection on finished packs.",
    createdAt: iso(subDays(now, 20)),
    updatedAt: iso(subDays(now, 8)),
    comments: [
      {
        id: "c4",
        author: "GreenLeaf Organics",
        body: "HACCP plan v3.2 shared with updated CCP table.",
        createdAt: iso(subDays(now, 15)),
      },
      {
        id: "c5",
        author: "You",
        body: "Accepted. File archived.",
        createdAt: iso(subDays(now, 8)),
      },
    ],
    attachments: [
      { id: "a2", name: "haccp_plan.pdf", sizeLabel: "1.2 MB" },
    ],
    statusHistory: [
      { status: "Pending", at: iso(subDays(now, 20)) },
      { status: "In Review", at: iso(subDays(now, 18)) },
      { status: "Resolved", at: iso(subDays(now, 8)) },
    ],
  },
  {
    id: "q4",
    supplierId: "s2",
    supplierName: "Pacific Spice Imports",
    type: "Traceability",
    priority: "Medium",
    status: "Rejected",
    description: "Batch trace exercise for lot L-9921.",
    createdAt: iso(subDays(now, 30)),
    updatedAt: iso(subDays(now, 25)),
    comments: [
      {
        id: "c6",
        author: "QA Team",
        body: "Incomplete chain — please resubmit with full upstream IDs.",
        createdAt: iso(subDays(now, 25)),
      },
    ],
    attachments: [],
    statusHistory: [
      { status: "Pending", at: iso(subDays(now, 30)) },
      { status: "In Review", at: iso(subDays(now, 28)) },
      { status: "Rejected", at: iso(subDays(now, 25)) },
    ],
  },
  {
    id: "q5",
    supplierId: "s4",
    supplierName: "EuroDairy Ltd",
    type: "Microbiological",
    priority: "Low",
    status: "Pending",
    description: "Latest COA format alignment for raw milk powder.",
    createdAt: iso(subDays(now, 1)),
    updatedAt: iso(subDays(now, 1)),
    comments: [],
    attachments: [],
    statusHistory: [{ status: "Pending", at: iso(subDays(now, 1)) }],
  },
];
