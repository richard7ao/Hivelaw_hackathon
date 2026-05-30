import type { ExtendedReference } from "@/lib/demo-data";
import { MOCK_EXTENDED_REFERENCES } from "@/lib/demo-data";

import type { IntakeReferenceSelection } from "./types";

// The closed catalog of real statutes the intake agent may cite. The agent
// selects entries by id and writes a per-case `application`; it never invents
// statute text or URLs. The housing-disrepair set is the real legislation
// already curated in demo-data; we add the deposit-protection provisions so the
// catalog also covers the other common consumer-housing matter.
const DEPOSIT_REFERENCES: ExtendedReference[] = [
  {
    id: "ha2004-s213",
    shortLabel: "HA 2004, s.213",
    citation: "Housing Act 2004, Section 213 — Tenancy deposit schemes",
    summary:
      "A deposit must be protected in an authorised scheme and the prescribed information given to the tenant within 30 days of receipt.",
    fullText:
      "Where a landlord receives a tenancy deposit in connection with a shorthold tenancy, the deposit must be dealt with in accordance with an authorised scheme from the time it is received. The landlord must, within 30 days of receiving the deposit, give the tenant the prescribed information about the applicable scheme and how the deposit is protected.",
    url: "https://www.legislation.gov.uk/ukpga/2004/34/section/213",
    relevance: "high",
    highlightLinks: [],
    application:
      "Where a deposit was taken but cannot be found in any authorised scheme and no prescribed information was given within 30 days, the landlord is in breach of s.213.",
  },
  {
    id: "ha2004-s214",
    shortLabel: "HA 2004, s.214",
    citation: "Housing Act 2004, Section 214 — Proceedings and the 1–3× penalty",
    summary:
      "Where s.213 is breached the court must order repayment of the deposit and a penalty of between one and three times its value.",
    fullText:
      "Where the deposit is not being held in an authorised scheme, or the prescribed information has not been given, the court must order the landlord to repay the deposit (or pay it into a scheme) and to pay the tenant a sum of between one and three times the amount of the deposit.",
    url: "https://www.legislation.gov.uk/ukpga/2004/34/section/214",
    relevance: "high",
    highlightLinks: [],
    application:
      "If non-protection is established, s.214(4) entitles the tenant to the deposit back plus a penalty of one to three times the deposit.",
  },
];

export const REFERENCE_CATALOG: ExtendedReference[] = [
  ...MOCK_EXTENDED_REFERENCES,
  ...DEPOSIT_REFERENCES,
];

// Resolve the agent's id-based selections into full ExtendedReference objects,
// overriding only the case-specific relevance + application. Unknown ids are
// dropped (the agent may only cite from the catalog).
export function resolveReferences(selections: IntakeReferenceSelection[]): ExtendedReference[] {
  return selections
    .map((selection) => {
      const base = REFERENCE_CATALOG.find((ref) => ref.id === selection.id);
      if (!base) return null;
      return {
        ...base,
        relevance: selection.relevance ?? base.relevance,
        application: selection.application?.trim() ? selection.application : base.application,
      };
    })
    .filter((ref): ref is ExtendedReference => ref !== null);
}
