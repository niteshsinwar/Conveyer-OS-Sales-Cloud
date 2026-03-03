# Proposal (Enhanced Draft): Salesforce Sponsor Bank Onboarding, Governance & Compliance Collaboration Platform

**Client:** Comenity Servicing LLC (Bread Financial)  
**Provider:** Aethereus  
**Source Document:** `aethereus_sow.md`  

> **Critical note (date conflict):** The SOW states **Effective Date = Mar 16, 2025**, while the milestone/invoice table references **Kickoff = Mar 16, 2026** and Go-Live in June 2026. This draft keeps the **3‑month / ~13-week** delivery shape but flags the calendar as an **Open Item** until you confirm the correct year.

---

## 1) Executive Summary
Bread Financial acts as the **Sponsor Bank** for multiple FinTech partners. Bread needs a secure, auditable collaboration platform to support **partner onboarding, ongoing governance, and regulatory compliance**.

The platform will enable Bread and each FinTech to:
- Collect due diligence information and evidence (**documents + comments**) against a structured questionnaire
- Track onboarding and compliance stages: **Due Diligence → Pre‑Launch Testing → First Events Validation**
- Generate and manage **recurring testing schedules** for ongoing compliance monitoring
- Track **policy changes** with review/approval and audit history
- Centralize policies, SOPs, training/enablement content, audits, and due diligence artifacts
- Provide **segmented access** so each FinTech only sees their own information
- Provide dashboards for progress, overdue items, and task completion
- Manage **complaints** via intake, routing, and resolution workflow
- Provide analytics dashboards (CRMA) for Complaints, Applications, Transactions
- Ingest application data from **Snowflake** into **Salesforce Data Cloud**, calculate metrics, and **trigger alerts** when applications/loans fall outside agreed parameters

This document translates the SOW into a structured delivery approach, clarifies what must be confirmed in discovery, and outlines a practical discovery plan.

---

## 2) Goals (What success looks like)
The SOW is feature-focused; to make the proposal measurable, below are outcome-oriented targets to confirm in discovery:
- **Reduce onboarding cycle time** (example: from X days to Y days)
- **Increase on-time completion** of due diligence/testing items (example: ≥ 95% by due date)
- **Audit readiness**: evidence is complete, searchable, and attributable (who/when/what changed)
- **Complaints control**: clear ownership, tracking, and reporting of aging/backlog
- **Compliance monitoring**: automated alerts are delivered to the right owners, with traceability and remediation tracking

> These become the proposal’s “success metrics” once Bread confirms baseline numbers.

---

## 3) What’s Included (Aligned to SOW)
### A) External Collaboration Portal (FinTech-facing)
- External-facing portal for FinTech users
- Onboarding & governance tracking (stages, tasks, evidence)
- Document upload and comments tied to due diligence questionnaire items
- Central repository (“hub”) for policies, SOPs, training/enablement content, audits, artifacts
- Access controls so each partner only sees their own records/content
- Vanity URL / branded portal URL
- Accessibility: new external functionality must be **WCAG 2.0 AA** compliant

### B) Compliance Stage Tracking & Monitoring
- Track **Pre‑Launch Testing** and **First Events Validation**
- Automatically generate testing schedules (monitoring compliance)
- Workflow to track and report on policy changes

### C) Complaints Management
- Create complaint records (support tickets)
- Route complaints to the right internal teams
- Resolution workflow and reporting

### D) Analytics & Data
- Build **1 analytics dashboard** (CRMA) with **3–4 widgets** (SOW assumption)
- Ingest Snowflake application data into **Data Cloud** (reuse existing connection)
- Create calculated metrics and automations to trigger alerts for applications/loans outside agreed parameters (**3–4 parameters** to be provided by Bread during discovery)

### E) Quality & Delivery
- 2-week sprints; sprint planning Day 1 and review/retro Day 10
- Unit testing, manual testing, integration testing
- Test automation using **Cypress** (and Cypress Cloud per SOW)
- Support SIT and UAT; defect remediation incl. security scan/performance issues found by Comenity
- Knowledge transfer to Comenity Salesforce support team
- Change management/training support **limited to enablement and knowledge transfer** (training material build is out of scope per SOW)

---

## 4) What’s Explicitly Out of Scope (SOW)
- Custom development for legacy browser/device compatibility beyond Salesforce-supported browsers
- Building training materials (external/internal)
- Accessibility requirements beyond Salesforce out-of-box + WCAG 2.0 AA for new external functionality
- Accessibility testing
- Security and performance testing execution (Comenity performs; Aethereus remediates)
- Any change to existing Bread Pay application functionality
- Changes to “Bread Platform”
- Workfront integration
- Installation/setup of AppExchange products
- Data migration for existing FinTechs not considered in scope
- Changes to Account Engagement not considered

---

## 5) Proposed Solution Approach (Plain-English, then Salesforce mapping)
### A) FinTech Collaboration Portal
**Plain English:** Provide a secure online workspace per FinTech for onboarding and compliance collaboration. FinTech users upload evidence, answer due diligence items, and complete assigned tasks. Bread reviewers approve, request changes, and track progress.

**Salesforce mapping:** Experience Cloud portal + segmented access model so partners only see their own records; custom/branded URL.

### B) Compliance Stage Tracking & Tasking
**Plain English:** Standardize each stage into a checklist (due diligence, testing, validation). Auto-create tasks and recurring monitoring schedules. Track due dates, completion, and overdue work.

**Salesforce mapping:** Stage records + tasks + automation.

### C) Policy Change Management
**Plain English:** Submit policy changes, route for review/approval, track who approved what, and keep version/audit history.

**Salesforce mapping:** Approval-style workflow + audit fields + reporting.

### D) Complaints Intake → Routing → Resolution
**Plain English:** Standardize complaint intake, categorization, assignment, escalation, and closure. Report on volume, aging, and trends.

**Salesforce mapping:** Service Cloud complaint workflow (support tickets) + routing/escalation + dashboards.

### E) Snowflake → Data Cloud → Alerts
**Plain English:** Bring application data into Salesforce from Snowflake. Define 3–4 “out of bounds” rules (thresholds). When new/updated data violates rules, automatically notify owners and track follow-up.

**Salesforce mapping:** Data Cloud ingestion + calculated metrics + automation that triggers alerts/tasks/notifications.

---

## 6) Discovery Findings (From SOW)
### Confirmed facts (explicitly stated)
- Portal collaboration platform for multiple FinTech partners
- Compliance stages: Due Diligence, Pre‑Launch Testing, First Events Validation
- Document upload and comments required per questionnaire item
- Complaint management workflow required
- Analytics: 1 CRMA dashboard with 3–4 widgets
- Snowflake → Data Cloud ingestion required; existing connection reused
- Alerts based on 3–4 parameters provided during discovery
- Access control for internal vs external users required
- Sprint cadence: 2-week sprints; Cypress test automation
- New external functionality must meet WCAG 2.0 AA

### Items implied but not defined (must be designed)
- Due diligence questionnaire structure, ownership, and scoring/decisioning (if any)
- Internal role split (who reviews, who approves, who administers)
- What “testing schedules” mean (frequency, templates, evidence required)
- Policy change types, required approvals, versioning expectations
- Complaint channels (portal, email, phone), categories, SLAs, escalations
- Data volumes, refresh frequency, recipients, and exception handling for alerts

---

## 7) Gaps, Assumptions, and Decisions Log (Must Confirm in Discovery)
| Area | Gap / Open Question | Why it matters | Working Assumption (until confirmed) |
|---|---|---|---|
| Timeline | 2025 vs 2026 date mismatch | Staffing, schedule, invoicing, go-live readiness | Follow milestone table unless corrected |
| Users | # of Bread users and # of external FinTech users | Licensing, performance, access model | 50–200 external users total |
| FinTech partners | How many partners; do they require separate workspaces? | Data separation, reporting, admin effort | One workspace per FinTech |
| Login | How FinTech users sign in (SSO vs usernames) | Security and user setup approach | Okta SSO is available (SOW assumption) |
| Questionnaire | What questions, answer types, evidence rules | Data model + user experience | Bread provides template and stage exit criteria |
| Documents | File types/size limits/retention/legal hold | Compliance and storage sizing | Standard upload; retention policy TBD |
| Testing schedules | Frequency, templates, evidence and exceptions | Automation design | Monthly/quarterly schedules by template |
| Policy changes | Approval steps, versioning, audit needs | Governance design | Submit → review → approve → publish |
| Complaints | Intake channels, SLAs, escalations, reporting | Service process design | Portal + internal entry; SLAs TBD |
| Data ingestion | Source tables/fields, refresh, data quality | Data Cloud setup and alert accuracy | Daily refresh; Bread provides mapping |
| Alerts | Rules, thresholds, recipients, what follow-up is required | Compliance traceability | Bread defines 3–4 rules + owners |
| Migration | SOW mentions validating migrated data but migration scope is limited | Prevent scope creep | Validate only agreed seed data/new build |
| Training | Training materials out of scope but enablement implied | Avoid expectation mismatch | Enablement = demos + KT only |

---

## 8) Proposed Discovery & Session Plan (3 Weeks)
**Goal:** Confirm requirements, data, security, volumes, and success measures so sprint scope is stable.

### Session 1 — Program Vision, Success Measures, and Timeline (90 min)
**Participants:** program owner, product owner, compliance leadership, portal owner  
**Outputs:** goals/KPIs, scope confirmation, **resolve date mismatch**

### Session 2 — Due Diligence & Onboarding Walkthrough (2 hours)
**Participants:** compliance SMEs, onboarding ops (and a FinTech representative if allowed)  
**Outputs:** step-by-step process, questionnaire structure, evidence rules, stage exit criteria

### Session 3 — Portal Access Rules & Security (90 min)
**Participants:** security/identity (Okta), risk/compliance, portal owner  
**Outputs:** login method, invitation/registration, “who sees what”, audit requirements

### Session 4 — Complaints Workflow (90 min)
**Participants:** complaints ops, customer service manager, compliance  
**Outputs:** intake channels, categories, routing rules, escalations, reporting needs, exception scenarios

### Session 5 — Data & Alerts (Snowflake → Data Cloud) (2 hours)
**Participants:** data engineering (Snowflake), analytics, compliance, product owner  
**Outputs:** source tables/fields, refresh frequency, data volume, alert rules (3–4), recipients, exception handling

### Session 6 — Reporting, UAT, Go‑Live Readiness (90 min)
**Participants:** UAT lead, support team, product owner, reporting users  
**Outputs:** dashboard widget definitions, UAT entry/exit criteria, cutover outline, KT plan

---

## 9) Delivery Plan (Aligned to SOW shape)
- **Weeks 1–3:** Discovery + backlog/user story definition
- **Weeks 4–5:** Design (security model, portal structure, data mappings, test strategy)
- **Weeks 6–11:** Build (2‑week sprints; incremental demos each sprint)
- **Week 12:** UAT + security/performance testing by Comenity + remediation by Aethereus
- **Week 13:** Warranty / stabilization

**Environments:** DEV → SIT → UAT → Production (deployment by Comenity support team per SOW)

---

## 10) Quality & Acceptance (From SOW)
- 100% unit tests pass
- 99% functional test execution
- 95% functional test pass
- 80% automation coverage (where automatable)
- No open critical/high defects at end of UAT
- Deliverables accepted within 10 business days unless rejected with written deviations

---

## 11) Key Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Date mismatch (2025 vs 2026) | High | Confirm in Session 1; baseline schedule |
| External access model unclear | High | Run Session 3 early; prototype access rules |
| Alert parameters not provided early | Medium | Make alert rules a required discovery deliverable |
| Data quality issues in Snowflake | Medium | Data profiling early; define error/exception handling |
| Training expectations mismatch | Medium | Confirm enablement scope vs material development |

---

## 12) Open Items (Need Client Confirmation)
1. Confirm actual project dates and milestone calendar (2025 vs 2026).
2. Confirm number of FinTech partners and estimated external user counts.
3. Confirm login approach (Okta SSO) and external user invitation/registration process.
4. Provide due diligence questionnaire template and stage exit criteria.
5. Identify complaint intake channels + SLAs.
6. Provide Snowflake data dictionary + the 3–4 alert parameters/thresholds.

---

## Appendix A — Research Pointers (Official Salesforce sources)
Below are the kinds of official Salesforce documentation we align to for this approach (links can be finalized/validated during solution design):
- **Experience Cloud**: custom site URLs / custom domains and SSO login patterns
- **Service Cloud**: support ticket routing/escalation and service process design
- **Data Cloud**: calculated insights and triggering automated actions when Data Cloud data changes

> If you want, I can add a 6–10 item reference list with direct URLs once you confirm whether your reviewers prefer **Salesforce Help**, **Developer Docs**, or **Trailhead** as the primary citation style.
