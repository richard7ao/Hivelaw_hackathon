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

Yours faithfully

Natalie Clemmingtime`;

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

export type CounterReference = {
  id: string;
  argument: string;
  basis: string;
  detail: string;
  highlightLinks: string[];
};

export const MOCK_COUNTER_REFERENCES: CounterReference[] = [
  {
    id: "cr1",
    argument: "Tenant signed a satisfaction form after prior works",
    basis: "Contractual estoppel / waiver argument",
    detail: "The landlord will rely on the signed contractor works form dated March 2026 in which the tenant confirmed previous remedial works were 'carried out to my satisfaction.' This creates an evidential hurdle: the tenant acknowledged the problem was fixed, weakening the argument of continuous disrepair. However, this does not prevent a fresh claim if the damp recurred after the form was signed — the form only evidences the state at that date, not a waiver of future rights.",
    highlightLinks: ["signed satisfaction form dated March 2026"],
  },
  {
    id: "cr2",
    argument: "No independent survey to rule out condensation damp",
    basis: "Causation defence — lifestyle vs. structural",
    detail: "The landlord's most likely defence is that the damp is caused by condensation from the tenant's lifestyle (inadequate ventilation, drying clothes indoors) rather than a structural defect. Without an independent damp survey establishing the cause, the tenant cannot rebut this defence. The burden of proving the defect is structural falls on the tenant. A Type III survey (destructive investigation) may be needed if the cause is disputed.",
    highlightLinks: ["obtain an independent damp survey", "landlord's defence that the issue is lifestyle-related"],
  },
  {
    id: "cr3",
    argument: "Photographic evidence alone may be insufficient",
    basis: "Evidential weight — expert evidence preferred",
    detail: "Photographs show the visible presence of mould but do not establish its cause, severity under HHSRS, or the landlord's knowledge of a structural defect. A court would expect expert evidence (e.g., a chartered surveyor's report) to establish the hazard category and causation. Photographs are supporting evidence, not primary proof.",
    highlightLinks: ["failed to carry out meaningful inspection or repair"],
  },
];

export type LawyerProfile = {
  id: string;
  name: string;
  firm: string;
  specialisation: string;
  experience: string;
  qualifications: string[];
  rating: number;
  casesWon: number;
  imageUrl: string;
  profileUrl: string;
};

/**
 * The Steelman — chains of argument.
 * Each chain models ONE argument the other side will make, as a sequence:
 *   1. opponentArgument — their headline (the accordion card header / node 1)
 *   2. sourceQuote      — the gut-punch: they quote the tenant's OWN words back
 *   3. reply            — the strongest HONEST reply, grounded in statute
 *   4. unresolvedNote   — why it stays contested, NOT won
 *
 * Chain 1 (signed satisfaction form) is the verified hero used in the demo.
 * Chains 2-3 are illustrative housing-disrepair defences — plausible, but the
 * quotes/statute should be grounded against the real file before relying on them.
 */
export type SteelmanChain = {
  id: string;
  opponentArgument: string;
  sourceQuote: string;
  quoteCaption: string;
  reply: string;
  statute: string;
  verdict: "arguable" | "strong-for-them";
  unresolvedNote: string;
};

export const STEELMAN_CHAINS: SteelmanChain[] = [
  {
    id: "sc1",
    opponentArgument:
      "The repairing obligation was discharged — the previous works were completed and signed off as satisfactory.",
    sourceQuote: "I confirm that the above works have been carried out to my satisfaction.",
    quoteCaption: "From your signed contractor works form, March 2026",
    reply:
      "One satisfaction note for one set of works does not extinguish an ongoing statutory duty. The repairing covenant and the duty to keep the home fit for habitation are continuing obligations — if the damp has recurred since March, the duty re-engages.",
    statute: "LTA 1985 s.11 (repairing covenant) & s.9A (fitness for human habitation)",
    verdict: "arguable",
    unresolvedNote:
      "Contested, not won. The signed form is the first thing a judge will look at, and it remains a material risk until an independent survey shows the defect recurred.",
  },
  {
    id: "sc2",
    opponentArgument:
      "The damp is condensation from how the flat is used, not a structural defect we are obliged to fix.",
    sourceQuote: "Occupier reports drying laundry indoors; trickle vents observed closed at inspection.",
    quoteCaption: "From the council inspection report",
    reply:
      "Even where lifestyle is a factor, a landlord must still address inadequate ventilation, heating or insulation that makes condensation unavoidable — those are design defects, and persistent condensation dampness can still render a home unfit.",
    statute: "LTA 1985 s.9A & Housing Act 2004 Pt 1 (HHSRS)",
    verdict: "strong-for-them",
    unresolvedNote:
      "This is the other side's strongest card. Without an independent damp survey establishing a structural or design cause, the burden sits on you and this argument may carry.",
  },
  {
    id: "sc3",
    opponentArgument:
      "Your photographs show mould but prove nothing about its cause, severity, or our knowledge of any defect.",
    sourceQuote: "Mould Photo — Month 1; Mould Photo — Month 3; Mould Photo — Month 8.",
    quoteCaption: "From your uploaded evidence",
    reply:
      "The photographs are not the whole case — they corroborate a timeline of worsening, recurring mould across eight months, which supports both ongoing disrepair and the reasonableness of expert investigation.",
    statute: "Pre-Action Protocol for Housing Conditions Claims",
    verdict: "arguable",
    unresolvedNote:
      "Contested, not won. A court will expect a surveyor's report on cause and HHSRS hazard category; the photos support that case but cannot stand in for it.",
  },
];

export const MOCK_LAWYERS: LawyerProfile[] = [
  {
    id: "l1",
    name: "Katherine Jackson",
    firm: "Lawhive",
    specialisation: "Housing disrepair & tenant claims",
    experience: "Experienced in damp & mould disrepair claims against local authorities and private landlords. Specialises in pre-action protocol compliance and tenant representation.",
    qualifications: ["SQE qualified", "Housing Law Practitioners Association", "Legal Aid accredited"],
    rating: 4.9,
    casesWon: 312,
    imageUrl: "/lawyers/katherine-jackson.png",
    profileUrl: "https://lawhive.co.uk/our-lawyers/katherine-jackson",
  },
  {
    id: "l2",
    name: "Daniel Tang",
    firm: "Lawhive",
    specialisation: "HHSRS enforcement & fitness for habitation",
    experience: "Specialises in Category 1 hazard enforcement and s.9A fitness claims. Expert in housing conditions litigation and single joint expert instructions.",
    qualifications: ["LLB (Hons)", "SQE qualified", "CILEX Fellow"],
    rating: 4.8,
    casesWon: 245,
    imageUrl: "/lawyers/daniel-tang.png",
    profileUrl: "https://lawhive.co.uk/our-lawyers/daniel-tang",
  },
  {
    id: "l3",
    name: "Rachelle Man Hiu Lam",
    firm: "Lawhive",
    specialisation: "Pre-action protocol & deposit disputes",
    experience: "Expert in housing conditions protocol compliance, letter of claim drafting, and tenancy deposit penalty claims under the Housing Act 2004.",
    qualifications: ["LLM Housing Law", "SQE qualified", "Legal Aid accredited"],
    rating: 4.7,
    casesWon: 158,
    imageUrl: "/lawyers/rachelle-lam.png",
    profileUrl: "https://lawhive.co.uk/our-lawyers/rachelle-man-hiu-lam",
  },
];
