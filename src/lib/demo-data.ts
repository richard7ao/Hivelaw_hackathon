import type { ResearchItem, ReportData, AnalysisData } from "./demo-context";

export const MOCK_ASSISTANT_REPLY =
  "Thank you for sharing the details of your situation. Based on what you’ve described — persistent damp and mould in your rented property, multiple reports to the landlord without adequate response — there are several provisions that may be relevant. Let me research the applicable law and your landlord’s obligations.";

export const MOCK_RESEARCH: ResearchItem[] = [
  {
    id: "r1",
    snippet:
      "Landlord and Tenant Act 1985, s.11 — implies a covenant to keep in repair the structure and exterior, and to keep in repair and proper working order installations for sanitation, heating and hot water.",
    source: "Landlord and Tenant Act 1985",
    relevance: "high",
    selected: false,
  },
  {
    id: "r2",
    snippet:
      "Homes (Fitness for Human Habitation) Act 2018 — requires landlords to ensure properties are fit for human habitation at the start of and throughout the tenancy, including freedom from damp.",
    source: "Homes (Fitness) Act 2018",
    relevance: "high",
    selected: false,
  },
  {
    id: "r3",
    snippet:
      "Housing Act 2004, Part 1 (HHSRS) — damp and mould growth is a prescribed hazard. A Category 1 hazard imposes a duty on the local authority to take enforcement action.",
    source: "Housing Act 2004",
    relevance: "high",
    selected: false,
  },
  {
    id: "r4",
    snippet:
      "Pre-Action Protocol for Housing Conditions Claims — requires the tenant to notify the landlord in writing, allow a reasonable period for inspection and repair, before issuing proceedings.",
    source: "Pre-Action Protocol",
    relevance: "moderate",
    selected: false,
  },
  {
    id: "r5",
    snippet:
      "Defective Premises Act 1972, s.4 — where the landlord has an obligation to repair, they owe a duty of care to all persons who might reasonably be expected to be affected by defects.",
    source: "Defective Premises Act 1972",
    relevance: "low",
    selected: false,
  },
];

export const MOCK_FILE_RESULTS = [
  { id: "f1", label: "Tenancy agreement — s.11 repair obligation identified", selected: false },
  { id: "f2", label: "Email chain — 3 written reports to landlord since January", selected: false },
  { id: "f3", label: "Photographs — visible mould growth, bedroom ceiling", selected: false },
];

export const MOCK_REPORT: ReportData = {
  title: "Damp & Mould Disrepair — 12 Ardwick Court",
  subtitle: "Pre-action assessment under the Housing Conditions Protocol",
  paragraphs: [
    {
      text: "The tenant has reported persistent damp and mould in the bedroom and bathroom of the property at 12 Ardwick Court since January 2026. The landlord was notified in writing on three occasions and has failed to carry out meaningful inspection or repair.",
      highlights: [
        { text: "notified in writing on three occasions", type: "support" },
        { text: "failed to carry out meaningful inspection or repair", type: "support" },
      ],
    },
    {
      text: "Under s.11 of the Landlord and Tenant Act 1985, the landlord is under an implied obligation to keep the structure and exterior in repair. The presence of penetrating damp is prima facie evidence of a breach. The property is also likely unfit for human habitation within the meaning of the Homes (Fitness for Human Habitation) Act 2018.",
      highlights: [
        { text: "implied obligation to keep the structure and exterior in repair", type: "support" },
        { text: "prima facie evidence of a breach", type: "support" },
      ],
    },
    {
      text: "However, the landlord may argue that the tenant’s own conduct contributed to condensation — specifically, the signed satisfaction form dated March 2026 stating that previous remedial works were completed satisfactorily. This document significantly weakens the tenant’s position on the question of notice and ongoing disrepair.",
      highlights: [
        { text: "signed satisfaction form dated March 2026", type: "flag" },
        { text: "significantly weakens the tenant’s position", type: "flag" },
      ],
    },
    {
      text: "The tenant should obtain an independent damp survey to establish the cause (structural vs. condensation) and severity of the hazard under the HHSRS. Without this, the landlord’s defence that the issue is lifestyle-related cannot be effectively rebutted.",
      highlights: [
        { text: "obtain an independent damp survey", type: "support" },
        { text: "landlord’s defence that the issue is lifestyle-related", type: "flag" },
      ],
    },
  ],
};

export const MOCK_ANALYSIS: AnalysisData = {
  forPoints: [
    "Three written reports to the landlord establish clear notice of disrepair",
    "Visible mould growth consistent with a Category 1 hazard under the HHSRS",
    "Landlord’s failure to inspect within a reasonable period after notification",
    "Property likely unfit for human habitation under the 2018 Act",
  ],
  counterPoints: [
    "Signed satisfaction form may be taken as evidence that prior works resolved the issue",
    "No independent damp survey to rule out tenant-caused condensation",
    "Photographs alone may not establish structural cause without expert evidence",
  ],
  summary:
    "The tenant has an arguable case for disrepair, grounded in three documented reports and a visible ongoing hazard. The principal risk is the signed satisfaction form, which the landlord will use to argue that the issue was previously remedied. An independent survey would materially strengthen the claim. Recommendation: escalate to a solicitor with the prepared file, but obtain the survey first.",
};

export const MOCK_SUBMISSION_PREVIEW = `RE: DISREPAIR AT 12 ARDWICK COURT

Dear Sir or Madam,

We write in accordance with the Pre-Action Protocol for Housing Conditions Claims regarding persistent damp and mould at the above property.

The tenant has reported this issue in writing on three occasions since January 2026. No adequate inspection or remedial works have been carried out.

The property is in breach of the landlord’s repairing obligation under s.11 of the Landlord and Tenant Act 1985 and is likely unfit for human habitation under the Homes (Fitness for Human Habitation) Act 2018.

We require a written response within 20 working days setting out your proposals for inspection and repair. Failure to respond may result in proceedings being issued without further notice.

Yours faithfully`;
