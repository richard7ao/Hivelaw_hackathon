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

export type CaseFile = {
  name: string;
  path: string;
  type: "pdf" | "image" | "text";
  size: string;
};

export const CASE_07_FILES: CaseFile[] = [
  { name: "Tenancy Agreement", path: "/case-07/tenancy_agreement.pdf", type: "pdf", size: "320 KB" },
  { name: "Contractor Works Form", path: "/case-07/contractor_works_form.pdf", type: "pdf", size: "185 KB" },
  { name: "Council Inspection Report", path: "/case-07/council_inspection_report.pdf", type: "pdf", size: "290 KB" },
  { name: "Email Chain with Council", path: "/case-07/email_chain_with_council.pdf", type: "pdf", size: "156 KB" },
  { name: "GP Letter", path: "/case-07/gp_letter.pdf", type: "pdf", size: "98 KB" },
  { name: "Phone Call Log", path: "/case-07/phone_call_log.pdf", type: "pdf", size: "112 KB" },
  { name: "Mould Photo — Month 1", path: "/case-07/month_1_photo_1.jpg", type: "image", size: "1.2 MB" },
  { name: "Mould Photo — Month 3", path: "/case-07/month_3_photo_1.jpg", type: "image", size: "1.4 MB" },
  { name: "Mould Photo — Month 8", path: "/case-07/month_8_photo_1.jpg", type: "image", size: "1.6 MB" },
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

export type ExtendedReference = {
  id: string;
  shortLabel: string;
  citation: string;
  summary: string;
  fullText: string;
  url: string;
  relevance: "high" | "moderate" | "low";
  highlightLinks: string[];
  application: string;
};

export const MOCK_EXTENDED_REFERENCES: ExtendedReference[] = [
  {
    id: "ref1",
    shortLabel: "LTA 1985, s.11",
    citation: "Landlord and Tenant Act 1985, Section 11",
    summary: "Implies a covenant to keep in repair the structure and exterior of the dwelling.",
    fullText:
      "In a lease to which this section applies there is implied a covenant by the lessor — (a) to keep in repair the structure and exterior of the dwelling-house (including drains, gutters and external pipes), (b) to keep in repair and proper working order the installations in the dwelling-house for the supply of water, gas and electricity and for sanitation (including basins, sinks, baths and sanitary conveniences), (c) to keep in repair and proper working order the installations in the dwelling-house for space heating and heating water.",
    url: "https://www.legislation.gov.uk/ukpga/1985/70/section/11",
    relevance: "high",
    highlightLinks: ["implied obligation to keep the structure and exterior in repair"],
    application: "The landlord's failure to address penetrating damp over 6+ months is a clear breach of the s.11 covenant. The tenant notified in writing three times — sufficient notice for the obligation to crystallise.",
  },
  {
    id: "ref2",
    shortLabel: "Fitness Act 2018",
    citation: "Homes (Fitness for Human Habitation) Act 2018",
    summary: "Requires landlords to ensure properties are fit for habitation, including freedom from damp.",
    fullText:
      "The Homes (Fitness for Human Habitation) Act 2018 amends the Landlord and Tenant Act 1985 to require that residential rented accommodation is provided and maintained in a state of fitness for human habitation. Fitness is assessed by reference to the matters set out in section 10 of the 1985 Act, which include repair, freedom from damp, natural lighting, ventilation, water supply, drainage and sanitary conveniences, and facilities for the preparation and cooking of food.",
    url: "https://www.legislation.gov.uk/ukpga/2018/34/enacted",
    relevance: "high",
    highlightLinks: ["prima facie evidence of a breach"],
    application: "Persistent damp and mould renders the property unfit for habitation. The landlord's duty is ongoing — the signed satisfaction form does not extinguish it if the problem recurred.",
  },
  {
    id: "ref3",
    shortLabel: "HA 2004, Pt 1",
    citation: "Housing Act 2004, Part 1 — Housing Health and Safety Rating System",
    summary: "Damp and mould growth is a prescribed hazard. Category 1 hazards trigger a duty to act.",
    fullText:
      "Part 1 of the Housing Act 2004 introduces the Housing Health and Safety Rating System (HHSRS), replacing the housing fitness standard. Under HHSRS, 29 categories of hazard are prescribed, including damp and mould growth. Each hazard is assessed for likelihood of occurrence and probable severity of outcome. A Category 1 hazard (scoring 1000+) imposes a duty on the local housing authority to take appropriate enforcement action, which may include an improvement notice, prohibition order, or emergency remedial action.",
    url: "https://www.legislation.gov.uk/ukpga/2004/34/part/1",
    relevance: "high",
    highlightLinks: ["obtain an independent damp survey"],
    application: "If a damp survey classifies this as a Category 1 hazard, the local authority has a mandatory duty to act. This strengthens the tenant's position significantly and may trigger enforcement independently of a civil claim.",
  },
  {
    id: "ref4",
    shortLabel: "Pre-Action Protocol",
    citation: "Pre-Action Protocol for Housing Conditions Claims (England)",
    summary: "Requires written notification and reasonable time for repair before court proceedings.",
    fullText:
      "The Pre-Action Protocol for Housing Conditions Claims sets out the steps that the court would normally expect prospective parties to take before starting a claim. The tenant must notify the landlord in writing of the defects, giving the landlord a reasonable opportunity to inspect and carry out any necessary works. 'Reasonable' will depend on the nature and urgency of the defect, but should generally be at least 20 working days for non-urgent matters. The protocol encourages early disclosure of documents and expert evidence to support negotiation.",
    url: "https://www.justice.gov.uk/courts/procedure-rules/civil/protocol/prot_hou",
    relevance: "moderate",
    highlightLinks: ["notified in writing on three occasions"],
    application: "Three written notifications over 6 months exceeds the protocol's 'reasonable opportunity' threshold. The tenant has complied with pre-action requirements and may now proceed to formal proceedings.",
  },
  {
    id: "ref5",
    shortLabel: "DPA 1972, s.4",
    citation: "Defective Premises Act 1972, Section 4",
    summary: "Landlord owes duty of care to persons affected by defects where they have a repair obligation.",
    fullText:
      "Where premises are let under a tenancy which puts on the landlord an obligation to the tenant for the maintenance or repair of the premises, the landlord owes to all persons who might reasonably be expected to be affected by defects in the state of the premises a duty to take such care as is reasonable in all the circumstances to see that they are reasonably safe from personal injury or from damage to their property caused by a relevant defect.",
    url: "https://www.legislation.gov.uk/ukpga/1972/35/section/4",
    relevance: "low",
    highlightLinks: ["landlord's defence that the issue is lifestyle-related"],
    application: "If the landlord's repair obligation is established via s.11, this section extends the duty of care to all occupants. Relevant if children or vulnerable persons are affected by the mould.",
  },
];
