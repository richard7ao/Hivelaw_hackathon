# Identify the Players — UK Citizens Seeking Legal Help for Daily-Life Issues

> Stakeholder analysis (England & Wales). Generated via the `/identify-the-players`
> skill. Problem statement: *"UK citizens look for law help with their daily life issue."*

## Problem Restatement

How does an ordinary person in **England & Wales** get reliable, affordable help to resolve an everyday legal problem (housing, employment, debt, consumer, family, benefits) — given that most such problems never reach a lawyer and the system splits "free information" from regulated, paid "advice"? This is fundamentally an **access-to-justice** question, not a single substantive area of law.

---

## The 5 Key Stakeholders

### 1. The Citizen with the Problem (litigant-in-person / self-helper)
- **Who they are**: A member of the public facing a civil legal issue in daily life — a tenant, employee, consumer, debtor, separating parent, or benefits claimant. Increasingly a **litigant-in-person (LiP)** because they cannot afford or access representation.
- **Role in the problem**: The affected party — the user a hackathon product is built *for*.
- **What they need**: To understand whether they *have* a legal problem at all, what their rights are, what the realistic remedy is, and how to take the next step (a letter, a claim, a complaint) without being fleeced or misled.
- **Pain points**: Doesn't know the law exists or applies; can't tell information from advice; fear of cost ("will a question start the meter?"); fear of retaliation (e.g. eviction); time and literacy burden; procedural complexity of courts/tribunals; the "legal aid desert" left after **LASPO 2012** removed most civil legal aid.
- **Legal levers they hold**: The substantive rights of their area (e.g. s.11 Landlord and Tenant Act 1985 for repairs; Employment Rights Act 1996; Consumer Rights Act 2015) and the right to **conduct their own litigation** as a LiP. Pre-action protocols give them a structured first move short of court.
- **Why they matter**: They are the demand side. Everything turns on meeting them at the moment of confusion with something trustworthy and actionable.

### 2. Regulated Legal Professionals & Legaltech (solicitors, direct-access barristers, Lawhive)
- **Who they are**: Authorised providers of legal services — solicitor firms, barristers (incl. **Public Access**), CILEX practitioners, and **legaltech intermediaries like Lawhive** that connect clients to regulated lawyers and productise intake.
- **Role in the problem**: Adviser / representative — and the *escalation destination* when a problem outgrows self-help.
- **What they need**: Qualified, well-prepared cases at low acquisition cost; clients who understand scope and fees; to stay inside their regulatory permissions.
- **Pain points**: Small everyday claims are uneconomic to take on; client acquisition is expensive; intake and triage burn fee-earner time; post-LASPO, the paying-client funnel for "small" problems barely exists.
- **Legal levers they hold**: The right to perform **reserved legal activities** under the **Legal Services Act 2007** (rights of audience, conduct of litigation, reserved instrument activities, probate, notarial, oaths) — which unauthorised actors *cannot* lawfully do. Can issue correspondence and conduct litigation that an LiP would struggle with.
- **Why they matter**: A product's most defensible business model is being their **front door** (intake/triage) rather than competing with them — and the reserved-activities line dictates what the product itself may legally do.

### 3. The Free Advice & Funding Safety Net (Citizens Advice, law centres, Legal Aid Agency)
- **Who they are**: The not-for-profit and state-funded layer — **Citizens Advice**, **Law Centres Network**, university pro bono clinics, specialist charities (Shelter, StepChange), and the **Legal Aid Agency (LAA)** as residual public funder.
- **Role in the problem**: Front-line adviser *and* gatekeeper of subsidised help.
- **What they need**: To stretch scarce capacity across overwhelming demand; to triage effectively; to refer on cases they can't fund or staff.
- **Pain points**: Chronic under-capacity and waitlists; **legal aid scope and means tests** (post-**LASPO 2012**) exclude most housing/employment/family matters except narrow categories (e.g. homelessness, possession, domestic abuse); "advice deserts" geographically.
- **Legal levers they hold**: Legal aid eligibility decisions under **LASPO 2012**; the **exceptional case funding** route (s.10 LASPO); ability to give regulated advice within their authorisation/exemptions. Advocacy bodies also shape policy and provide trusted, branded guidance.
- **Why they matter**: They are the incumbent "free help" the citizen tries first — a hackathon product either *integrates with* their referral pathways or risks duplicating an overstretched service.

### 4. Adjudicators (County Court, the tribunals, and ombudsman schemes)
- **Who they are**: The bodies that decide disputes — the **County Court** (most civil claims, incl. money claims via **MCOL**), the **First-tier Tribunal** (Property / Social Entitlement chambers), the **Employment Tribunal**, the **Family Court**, and free **ombudsman schemes** (Housing Ombudsman, Financial Ombudsman Service, Energy Ombudsman).
- **Role in the problem**: Neutral dispute resolver / decision-maker.
- **What they need**: Properly-pleaded claims, complete evidence, and parties who have followed **pre-action protocols** and attempted ADR.
- **Pain points**: Backlogs and delay; complexity that disadvantages LiPs; court fees; a system designed around represented parties.
- **Legal levers they hold**: Binding judgments and remedies (damages, injunctions, possession orders, repair orders); cost orders; the **Civil Procedure Rules** and pre-action protocols that gate access; ombudsman determinations (often free, lower-stakes alternatives to court).
- **Why they matter**: They define the format and evidentiary standard the product's outputs must satisfy — a generated letter or case file is only useful if it survives this forum.

### 5. Legal Services Regulators (SRA, BSB, LSB, Legal Ombudsman)
- **Who they are**: The **Solicitors Regulation Authority** and **Bar Standards Board**, overseen by the **Legal Services Board**, plus the **Legal Ombudsman** for service complaints — operating under the **Legal Services Act 2007**.
- **Role in the problem**: Regulator / enforcer of who may provide legal services and how.
- **What they need**: Consumers protected from unqualified or negligent "advice"; the reserved-activities perimeter respected; clear accountability for regulated providers.
- **Pain points**: Innovation (legaltech, AI) outpaces the regulatory framework; an unclear line between lawful **legal information** and regulated **legal advice**; enforcing against unauthorised practice.
- **Legal levers they hold**: It is a **criminal offence** to carry on a **reserved legal activity** while unauthorised (**Legal Services Act 2007, ss.13–16**); the SRA's authorisation, conduct rules and enforcement; the LSB's oversight; Legal Ombudsman redress.
- **Why they matter**: They are the hard constraint on the *solution itself* — a hackathon product must stay on the **information / not advice** side of the line unless it operates through authorised persons.

---

## Interaction Map

| | 1. Citizen | 2. Lawyers/Legaltech | 3. Advice & Funding Net | 4. Adjudicators | 5. Regulators |
|---|---|---|---|---|---|
| **1. Citizen** | — | Instructs / becomes client; owes fees, owed a duty of care | Seeks free advice; assessed for legal aid eligibility | Brings/defends a claim as LiP; bound by judgment | Protected consumer; can complain to Legal Ombudsman |
| **2. Lawyers/Legaltech** | Owes professional duty of care; performs reserved activities | — | Receives referrals; may deliver legal aid work under LAA contract | Has rights of audience / conducts litigation | Authorised and regulated by SRA/BSB; bound by LSA 2007 |
| **3. Advice & Funding Net** | Triages and advises; grants/refuses legal aid | Refers complex cases on; LAA funds contracted firms | — | Helps prepare cases; supports ombudsman complaints | Operates within authorisation/exemptions; LAA is a public body |
| **4. Adjudicators** | Decides the dispute; can order remedies/costs | Hears represented parties; enforces CPR & protocols | Receives protocol-compliant, advice-supported claims | — | Distinct from legal regulators; courts can sanction misconduct |
| **5. Regulators** | Provide a redress route; police unauthorised practice | Authorise, supervise, discipline | Oversee regulated activity within the sector | Separate function (regulate providers, not adjudicate disputes) | — |

---

## Key Dynamics

- **Information-vs-advice perimeter (the regulatory tightrope)**: The single most important constraint. Under the **Legal Services Act 2007**, giving general legal *information* and drafting *correspondence* is open to anyone, but **conduct of litigation and rights of audience are reserved** — performing them unauthorised is a criminal offence. A product can explain rights and draft a pre-action letter; it cannot run the case. Build on the information side, escalate the reserved side to authorised humans.

- **The access-to-justice / funding gap (post-LASPO)**: The law grants real rights, but **LASPO 2012** stripped legal aid from most everyday civil/family matters, leaving a vast band of people who have a valid claim but no affordable path to a lawyer — and a free-advice sector too overstretched to absorb them. This empty middle is precisely the wedge a self-serve product fills.

- **Power & information asymmetry**: The opposing party (landlord, employer, trader, creditor) is often represented or institutionally sophisticated, while the citizen is a litigant-in-person facing the **Civil Procedure Rules** and pre-action protocols cold. Levelling that asymmetry — producing correctly-formatted, protocol-compliant, evidence-backed outputs — is where the most defensible value sits.

---

## Who to Build For

Build for **the Citizen (Stakeholder 1) as the primary user, with Regulated Legal Professionals/Legaltech (Stakeholder 2) as the integration partner and escalation route** — the Lawhive-style "front door" model. You can reach citizens directly online at their moment of confusion (high access, high impact, feasible in a short cycle), and the most defensible commercial position is being the **intake/triage layer that hands warm, prepared cases to authorised lawyers** rather than competing with them.

**Regulatory constraint to respect from day one (Legal Services Act 2007):** the product must stay firmly on the **legal-information and self-help-document side** of the line. It may explain rights, cite real statute, and draft pre-action correspondence the user sends *themselves*; it must **not** conduct litigation, exercise rights of audience, or hold itself out as giving regulated legal advice — those are **reserved legal activities** that only authorised persons may perform (LSA 2007 ss.12–16). Frame outputs as the user's own documents, surface low-confidence honestly, and route anything reserved (court conduct, possession proceedings, advocacy) to a regulated solicitor. Get the lawyer on the team to spot-check that the wording never crosses from *information* into *advice*.
