import type { QueryType } from "@/types";

export const QUERY_TYPE_TEMPLATES: Record<QueryType, string> = {
  "Allergen Info":
    "Please provide:\n- Allergen management policy\n- Cross-contact risk assessment for relevant lines\n- Declaration alignment with our SKU requirements",
  HACCP:
    "Please confirm:\n- List of CCPs and critical limits\n- Monitoring frequency and responsible roles\n- Verification records for the last audit cycle",
  "Certificate Expiry":
    "Our records show the certificate may be expiring or expired. Please provide:\n- Current valid certificate copy\n- Scope of certification\n- Expected renewal date if applicable",
  Traceability:
    "Traceability exercise request:\n- Product / lot: [specify]\n- One-up one-down within 4 hours where possible",
  Microbiological:
    "Please share:\n- Latest COA for specified batch\n- Sampling plan reference\n- Lab accreditation summary if not on file",
  Other: "Describe your request clearly. Include any relevant SKU, lot, or deadline.",
};
