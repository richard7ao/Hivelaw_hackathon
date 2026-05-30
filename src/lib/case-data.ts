import type { ReportData, AnalysisData } from "./demo-context";
import type { ExtendedReference, CounterReference, SteelmanChain } from "./demo-data";

export type CaseData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  prospects: "strong" | "arguable" | "weak";
  recommendation: "self-serve" | "escalate-to-solicitor" | "reconsider-pursuing";
  recommendationDetail: string;
  report: ReportData;
  analysis: AnalysisData;
  references: ExtendedReference[];
  counterReferences: CounterReference[];
  // Live intake fills these; curated cases omit them and the report page falls
  // back to its built-in Steelman chains.
  steelman?: SteelmanChain[];
  status: "complete" | "in-progress" | "new";
  date: string;
};

export const CASE_01: CaseData = {
  id: "case-01",
  title: "Deposit dispute — Jamie vs P Sullivan",
  subtitle: "Tenancy deposit non-protection claim under Housing Act 2004, s.213–214",
  description: "Landlord failed to protect £980.77 deposit within 30 days. Tenant-run searches show nil across all three statutory schemes.",
  prospects: "strong",
  recommendation: "self-serve",
  recommendationDetail: "Textbook tenancy deposit claim suited to the small-claims track. Close the one real gap first (authoritative scheme confirmation and a written request to the landlord), then bring a county court claim yourself.",
  status: "complete",
  date: "27 May 2026",
  report: {
    title: "Deposit Non-Protection — Jamie vs P Sullivan",
    subtitle: "Housing Act 2004 s.213–214 deposit penalty claim",
    paragraphs: [
      {
        text: "Jamie paid a £980.77 deposit to a private landlord on 13 April 2024 but it appears in none of the three statutory schemes and he was never given the prescribed information about where it was held. On the documents — the bank statement proving payment, the three 'No deposit found' searches and the tenancy agreement's own blank Schedule 1 — this is a clear breach of the landlord's obligations under s.213 of the Housing Act 2004.",
        highlights: [
          { text: "appears in none of the three statutory schemes", type: "support" },
          { text: "never given the prescribed information", type: "support" },
          { text: "tenancy agreement's own blank Schedule 1", type: "support" },
        ],
      },
      {
        text: "The breach entitles Jamie to return of the deposit and a penalty of between one and three times its value under s.214(4). The documentary record — proof of payment, three nil searches, and the landlord's own incomplete Schedule 1 — points squarely to non-protection and non-provision of prescribed information.",
        highlights: [
          { text: "penalty of between one and three times its value", type: "support" },
        ],
      },
      {
        text: "However, the landlord can argue he substantially complied by setting out almost all the prescribed information in Schedule 1 of the signed agreement at the outset, with only the scheme name to follow on registration. The agreement expressly committed him to protecting the deposit within 30 days.",
        highlights: [
          { text: "substantially complied by setting out almost all the prescribed information", type: "flag" },
          { text: "expressly committed him to protecting the deposit within 30 days", type: "flag" },
        ],
      },
      {
        text: "The three tenant-run self-service searches are not conclusive proof — some scheme search tools only match on exact reference/postcode details, and insured-scheme deposits may not show up. Authoritative confirmation from each scheme administrator is needed before issuing proceedings.",
        highlights: [
          { text: "not conclusive proof", type: "flag" },
          { text: "insured-scheme deposits may not show up", type: "flag" },
        ],
      },
    ],
  },
  analysis: {
    forPoints: [
      "Bank statement proves £980.77 deposit paid to 'P SULLIVAN' on 13 April 2024",
      "Three statutory scheme searches all return 'No deposit found'",
      "Tenancy agreement Schedule 1 is blank — no scheme name, no prescribed information provided",
      "Breach of s.213 is a strict-liability offence: the deposit either was protected within 30 days or it wasn't",
    ],
    counterPoints: [
      "Tenant-run self-service searches are not conclusive — insured schemes may not appear in tenant searches",
      "Landlord can argue substantial compliance via the pre-filled Schedule 1 template",
      "Even if liable, landlord will push for minimum 1× penalty citing otherwise good compliance record",
    ],
    summary: "Jamie has a strong case for a deposit penalty claim. The documentary evidence is clear: payment proved, three nil scheme searches, and a blank Schedule 1. The main gap is authoritative confirmation from the scheme administrators (not tenant self-service). If that confirms non-protection, this is a textbook s.214(4) claim worth £980–£2,940 plus deposit return. Self-serve on the small-claims track.",
  },
  references: [
    {
      id: "c01-ref1",
      shortLabel: "HA 2004, s.213",
      citation: "Housing Act 2004, Section 213 — Requirements relating to tenancy deposits",
      summary: "Landlord must protect deposit in an authorised scheme within 30 days of receipt.",
      fullText: "Where a landlord receives a tenancy deposit in connection with an assured tenancy, the initial requirements of an authorised scheme must be complied with by the landlord in relation to the deposit within the period of 30 days beginning with the date on which it is received.",
      url: "https://www.legislation.gov.uk/ukpga/2004/34/section/213",
      relevance: "high",
      highlightLinks: ["appears in none of the three statutory schemes"],
      application: "The deposit was paid on 13 April 2024. If it was not protected in any scheme within 30 days (by 13 May 2024), s.213 is breached. The three nil searches strongly suggest non-compliance.",
    },
    {
      id: "c01-ref2",
      shortLabel: "HA 2004, s.214(4)",
      citation: "Housing Act 2004, Section 214(4) — Proceedings relating to tenancy deposits",
      summary: "Court must order landlord to pay 1×–3× the deposit amount as a penalty.",
      fullText: "The court must order the landlord to pay to the applicant a sum of money not less than the amount of the deposit and not more than three times the amount of the deposit within the period of 14 days beginning with the date of the making of the order.",
      url: "https://www.legislation.gov.uk/ukpga/2004/34/section/214",
      relevance: "high",
      highlightLinks: ["penalty of between one and three times its value"],
      application: "On proven non-protection, the court has no discretion to award less than 1× the deposit (£980.77). The quantum within the 1×–3× range depends on the landlord's conduct — deliberate non-protection warrants a higher multiplier.",
    },
    {
      id: "c01-ref3",
      shortLabel: "HA 2004, s.213(6)",
      citation: "Housing Act 2004, Section 213(6) — Prescribed information",
      summary: "Prescribed information must be given to the tenant within 30 days of deposit receipt.",
      fullText: "The information required by subsection (5) must be given to the tenant and any relevant person — (a) in the prescribed form or in a form substantially to the same effect, and (b) within the period of 30 days beginning with the date on which the deposit is received by the landlord.",
      url: "https://www.legislation.gov.uk/ukpga/2004/34/section/213",
      relevance: "high",
      highlightLinks: ["never given the prescribed information"],
      application: "Even if the deposit was protected, failing to provide the prescribed information within 30 days is a separate breach that also triggers the s.214(4) penalty. The blank Schedule 1 evidences this failure.",
    },
  ],
  counterReferences: [
    {
      id: "c01-cr1",
      argument: "Tenant-run searches are not conclusive proof of non-protection",
      basis: "Evidential sufficiency — insured schemes may not appear in self-service searches",
      detail: "Some scheme search tools only match on exact reference, postcode, or surname details. Insured-scheme deposits in particular may not show up in tenant self-service portals. The landlord can demand authoritative written confirmation from each scheme administrator that no deposit is held before accepting liability. A court would likely expect this too.",
      highlightLinks: ["not conclusive proof", "insured-scheme deposits may not show up"],
    },
    {
      id: "c01-cr2",
      argument: "Landlord substantially complied via Schedule 1 template",
      basis: "s.213(6) — 'substantially to the same effect' defence",
      detail: "The landlord can argue that by including a pre-filled Schedule 1 in the tenancy agreement — which sets out most of the prescribed information except the scheme name — he substantially complied with s.213(6)(a). The scheme name was to follow on registration. This is a weak argument (the scheme name is the critical piece) but will be run to reduce the penalty multiplier.",
      highlightLinks: ["substantially complied by setting out almost all the prescribed information"],
    },
    {
      id: "c01-cr3",
      argument: "Minimum 1× penalty, not 3× — good compliance record elsewhere",
      basis: "s.214(4) quantum discretion",
      detail: "Even if liability is established, the landlord will argue for the minimum 1× penalty rather than 3×. He'll point to otherwise good compliance — gas safety certificate, EICR, smoke/CO alarms, and How to Rent guide all in order — to characterise the deposit failure as an innocent administrative oversight rather than a deliberate breach deserving the maximum penalty.",
      highlightLinks: ["expressly committed him to protecting the deposit within 30 days"],
    },
  ],
};

export const CASE_07: CaseData = {
  id: "case-07",
  title: "Damp & mould — Crystal vs Council",
  subtitle: "Pre-action assessment under the Housing Conditions Protocol",
  description: "Persistent damp and mould in council property, 15 emails over 8 months, Category 1 hazard on inspection. Works failed and mould recurred within a month.",
  prospects: "arguable",
  recommendation: "escalate-to-solicitor",
  recommendationDetail: "Housing disrepair/fitness claim with a possible personal-injury element for a child. A specialist housing disrepair solicitor will usually take this on a conditional ('no win, no fee') basis.",
  status: "complete",
  date: "28 May 2026",
  report: {
    title: "Damp & Mould Disrepair — Crystal vs Council",
    subtitle: "Pre-action assessment under the Housing Conditions Protocol",
    paragraphs: [
      {
        text: "Crystal is a secure council tenant with overwhelming evidence that she repeatedly put the Council on notice of damp and black mould — 15 emails over eight months, a phone log, photos and a GP letter — and that the problem worsened and recurred after the Council's own remedial works failed.",
        highlights: [
          { text: "15 emails over eight months", type: "support" },
          { text: "worsened and recurred after the Council's own remedial works failed", type: "support" },
        ],
      },
      {
        text: "The Council's own inspection report records a Category 1 damp-and-mould hazard and recommended a specialist damp inspection on recurrence that never happened. This supports breach of the landlord's repairing covenant (s.11) and the fitness-for-human-habitation covenant (s.9A), the latter being a continuing duty that bites where mould returns within a month.",
        highlights: [
          { text: "Category 1 damp-and-mould hazard", type: "support" },
          { text: "specialist damp inspection on recurrence that never happened", type: "support" },
        ],
      },
      {
        text: "However, the Council will say the damp is lifestyle condensation, not a structural defect, relying on its inspector's diagnosis and Crystal's drying of clothes indoors. The cause is provisionally assessed as condensation due to insufficient ventilation rather than ingress of water.",
        highlights: [
          { text: "lifestyle condensation, not a structural defect", type: "flag" },
          { text: "Crystal's drying of clothes indoors", type: "flag" },
        ],
      },
      {
        text: "The Council will point to the works-completion form Crystal signed, stating 'I confirm that the above works have been carried out to my satisfaction.' This document is weakened by the form's own statutory-obligations saving and by s.9A(4) which voids any term excluding the fitness covenant — but the opponent will still run it.",
        highlights: [
          { text: "works-completion form Crystal signed", type: "flag" },
          { text: "carried out to my satisfaction", type: "flag" },
        ],
      },
      {
        text: "Crystal has not yet complied with the pre-action steps — no formal complaint and no Letter of Claim. An independent damp survey is the single most important evidence gap and directly answers the Council's condensation defence.",
        highlights: [
          { text: "no formal complaint and no Letter of Claim", type: "flag" },
          { text: "independent damp survey is the single most important evidence gap", type: "support" },
        ],
      },
    ],
  },
  analysis: {
    forPoints: [
      "15 emails over eight months establish clear and repeated notice of disrepair",
      "Council's own inspection records a Category 1 damp-and-mould hazard",
      "Mould recurred within one month of Council's remedial works — works demonstrably failed",
      "GP letter links child's respiratory symptoms to the conditions",
      "Council recommended a specialist damp inspection on recurrence but never carried it out",
    ],
    counterPoints: [
      "Council's inspector diagnosed condensation from lifestyle (drying clothes indoors), not structural damp",
      "Crystal signed a works-completion form confirming satisfaction with the repairs",
      "No independent expert evidence of a structural cause — burden is on the tenant",
      "Crystal has not yet sent a formal complaint or Letter of Claim (pre-action protocol non-compliance)",
    ],
    summary: "Crystal has an arguable case grounded in exceptional documentation (15 emails, phone log, photos, GP letter) and the Council's own Category 1 hazard finding. The principal risk is the condensation defence — without an independent survey establishing structural cause, the Council can blame lifestyle. The signed satisfaction form is a secondary risk but weakened by s.9A(4). Recommendation: escalate to a housing disrepair solicitor who can commission the survey and draft the Letter of Claim on a no-win-no-fee basis.",
  },
  references: [
    {
      id: "c07-ref1",
      shortLabel: "LTA 1985, s.11",
      citation: "Landlord and Tenant Act 1985, Section 11",
      summary: "Implies a covenant to keep in repair the structure and exterior of the dwelling.",
      fullText: "In a lease to which this section applies there is implied a covenant by the lessor — (a) to keep in repair the structure and exterior of the dwelling-house (including drains, gutters and external pipes), (b) to keep in repair and proper working order the installations in the dwelling-house for the supply of water, gas and electricity and for sanitation (including basins, sinks, baths and sanitary conveniences), (c) to keep in repair and proper working order the installations in the dwelling-house for space heating and heating water.",
      url: "https://www.legislation.gov.uk/ukpga/1985/70/section/11",
      relevance: "high",
      highlightLinks: ["worsened and recurred after the Council's own remedial works failed"],
      application: "The Council's failure to address persistent damp after repeated notice and failed remedial works is a clear breach of the s.11 repairing covenant.",
    },
    {
      id: "c07-ref2",
      shortLabel: "LTA 1985, s.9A",
      citation: "Landlord and Tenant Act 1985, Section 9A — Fitness for human habitation",
      summary: "Dwelling must be fit for habitation throughout the tenancy. Continuing duty.",
      fullText: "There is implied a covenant by the lessor that the dwelling — (a) is fit for human habitation at the time the lease is granted or otherwise created or, if later, at the beginning of the term of the lease, and (b) will remain fit for human habitation during the term of the lease.",
      url: "https://www.legislation.gov.uk/ukpga/1985/70/section/9A",
      relevance: "high",
      highlightLinks: ["Category 1 damp-and-mould hazard"],
      application: "A Category 1 hazard finding by the Council's own inspector is powerful evidence of unfitness. s.9A is a continuing duty — the mould returning within a month shows the dwelling is not being maintained fit.",
    },
    {
      id: "c07-ref3",
      shortLabel: "Pre-Action Protocol",
      citation: "Pre-Action Protocol for Housing Conditions Claims (England)",
      summary: "Requires written notification and Letter of Claim before court proceedings.",
      fullText: "The tenant must send a Letter of Claim containing: (a) the tenant's name, the address of the property, the tenant's address if different, the tenant's telephone number and when access is available; (b) details of the defects, including any defects outstanding, in the form of a schedule; (c) history of the defects, including any attempts to rectify them; (d) details of any notification previously given to the landlord. The landlord should normally reply within 20 working days.",
      url: "https://www.justice.gov.uk/courts/procedure-rules/civil/protocol/prot_hou",
      relevance: "moderate",
      highlightLinks: ["independent damp survey is the single most important evidence gap"],
      application: "Crystal's 15 emails constitute adequate notification, but a formal Letter of Claim is still required before issuing. The protocol also provides for a single joint expert — the mechanism to get the independent damp survey.",
    },
  ],
  counterReferences: [
    {
      id: "c07-cr1",
      argument: "Council says damp is lifestyle condensation, not structural",
      basis: "Causation defence — s.9A(3) tenant-attributable unfitness",
      detail: "The Council's inspector provisionally assessed the cause as condensation due to insufficient ventilation and tenant's drying of clothes indoors. Under s.9A(3), the implied covenant does not impose liability if the unfitness is wholly or mainly attributable to the tenant's own breach of covenant. Without an independent survey disproving this, the Council's diagnosis stands.",
      highlightLinks: ["lifestyle condensation, not a structural defect", "Crystal's drying of clothes indoors"],
    },
    {
      id: "c07-cr2",
      argument: "Tenant signed satisfaction form after works completed",
      basis: "Contractual estoppel / waiver of further claims",
      detail: "Crystal signed a form stating 'I confirm that the above works have been carried out to my satisfaction' which also says the tenant 'waives any further claim arising from the items specified in this works order.' The Council will argue this bars claims about the works that were done. However, s.9A(4) voids any term that purports to exclude the fitness covenant, and the form's own footnote preserves 'the Council's ongoing statutory obligations.'",
      highlightLinks: ["works-completion form Crystal signed", "carried out to my satisfaction"],
    },
    {
      id: "c07-cr3",
      argument: "No independent expert evidence of structural cause",
      basis: "Evidential burden — tenant must prove structural defect",
      detail: "The Council's external inspection found no obvious defect in the brickwork or rainwater goods (though no roof access was obtained). The burden is on Crystal to prove the damp flows from a structural cause within s.11. Without an independent surveyor's report, her belief that it is penetrating damp is unproven and the Council's condensation diagnosis is unrebutted.",
      highlightLinks: ["lifestyle condensation, not a structural defect"],
    },
    {
      id: "c07-cr4",
      argument: "Tenant has not complied with pre-action protocol",
      basis: "Costs and case-management consequences",
      detail: "Crystal has not made a formal complaint or sent a Letter of Claim. A court expects pre-action protocol compliance and can impose costs sanctions for failure to follow it. The Council will argue any proceedings are premature and should be stayed until the protocol steps are completed.",
      highlightLinks: ["no formal complaint and no Letter of Claim"],
    },
  ],
};

export const ALL_CASES: Record<string, CaseData> = {
  "case-01": CASE_01,
  "case-07": CASE_07,
};
