# Proposal (Draft): Salesforce Sponsor Bank Onboarding, Governance & Compliance Collaboration Platform

**Client:** Comenity Servicing LLC (Bread Financial)  
**Provider:** Aethereus  
**Source Document:** `aethereus_sow.md`  
**SOW Effective Date:** Mar 16, 2025 *(note: milestone table references March 16, 2026 — see Open Item)*  
**SOW Term:** 3 months  
**SOW End Date:** Jun 12, 2026  

---

## 1) Executive Summary
Bread Financial acts as the **Sponsor Bank** for multiple FinTech partners. To support partner onboarding, governance, and regulatory compliance, Bread wants a **collaboration platform** where Bread and each FinTech can:
- Collect due diligence information and evidence (documents + comments)
- Track compliance stages: **Due Diligence → Pre-Launch Testing → First Events Validation**
- Run ongoing monitoring through automatically generated testing schedules
- Track policy changes with an audit trail/workflow
- Centralize policies, SOPs, training/enablement content, audits, and due diligence artifacts
- Provide secure access so each external partner only sees their own information
- Provide dashboards for progress, overdue items, and task completion
- Manage **complaints** via intake, routing, and resolution workflow
- Provide analytics dashboards (CRMA) for Complaints, Applications, Transactions
- Ingest application data from **Snowflake** into **Salesforce Data Cloud**, calculate insights, and trigger alerts when applications/loans fall outside agreed parameters

This proposal translates the SOW into a structured delivery plan, highlights key decisions and dependencies, and defines discovery sessions and gaps that must be confirmed before build.

---

## 2) What’s Included (Based on SOW)
### A) Core Collaboration Platform (Portal)
- External-facing portal experience for FinTech users
- Onboarding & governance tracking (stages, tasks, evidence)
- Document upload and comments tied to due diligence questionnaire items
- Central repository (“hub”) for policies, SOPs, training/enablement content, audits, artifacts
- Fine-grained access so partners only see their own records/content
- Vanity URL / branded portal URL
- Accessibility: new external functionality must be **WCAG 2.0 AA** compliant

### B) Compliance Tracking & Monitoring
- Track **Pre-launch testing** and **First Events Validation**
- Automatically generate testing schedules (monitoring compliance)
- Workflow to track and report on policy changes

### C) Complaints Management
- Create complaint records (support tickets)
- Route complaints to the right internal teams
- Resolution workflow and reporting

### D) Analytics & Data
- Build **1 analytics dashboard** (CRMA) with **3–4 widgets** (SOW assumption)
- Ingest Snowflake application data into **Data Cloud** (reuse existing connection)
- Create calculated metrics and automations to trigger alerts for applications/loans outside agreed parameters (3–4 parameters to be provided by Bread during discovery)

### E) Quality & Delivery
- 2-week sprints; sprint planning on Day 1 and review/retro on Day 10
- Unit testing, manual testing, integration testing
- Test automation using **Cypress** (and Cypress Cloud per SOW)
- Support SIT and UAT; defect remediation incl. security scan/performance issues found by Comenity
- Validation of functionality and migrated data (scope and approach to be confirmed)
- Knowledge transfer to Comenity Salesforce support team
- Support change management and training **(note: training material development is out of scope in SOW, see clarification)**

---

## 3) What’s Explicitly Out of Scope (SOW)
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

## 4) Proposed Solution Approach (Mapped to Salesforce Capabilities)
*(Plain English first; technical mapping in parentheses.)*

### A) FinTech Collaboration Portal
- Provide a secure online workspace per FinTech for onboarding and compliance collaboration.
- Each FinTech can upload evidence, add comments, and complete assigned tasks.
- Bread users can review, approve, request rework, and report progress.

**Salesforce mapping:** External portal (Experience Cloud) + secure partner access model. Use record-level sharing so each partner only sees their own items. Use a custom domain / branded URL for the portal.

### B) Compliance Stage Tracking & Tasking
- Create a consistent checklist per stage (Due Diligence, Pre-Launch Testing, First Events Validation).
- Auto-create tasks and schedules for recurring compliance monitoring.
- Track due dates, completion, and overdue work.

**Salesforce mapping:** Work tracking using tasks and stage records; automation using Salesforce Flow.

### C) Policy Change Management
- Users submit policy change requests.
- Route for review/approval.
- Track version history and audit trail.

**Salesforce mapping:** Approval-style workflow + audit fields and reporting.

### D) Complaints Intake → Routing → Resolution
- Standardize complaint intake, categorization, assignment, escalation, and closure.
- Provide management reporting and aging.

**Salesforce mapping:** Support ticket workflow (Service Cloud) with routing/escalation and dashboards.

### E) Data Cloud + Snowflake + Alerts
- Reuse existing Snowflake connectivity to bring in application data.
- Define 3–4 “out of bounds” parameters and build automated alerting when new data violates thresholds.

**Salesforce mapping:** Data ingestion (Data Cloud) → calculated metrics (Calculated Insights) → automation triggers (Data Cloud-triggered Flows) to create alerts/tasks/notifications.

---

## 5) Discovery Findings (From SOW)
### Confirmed facts (explicitly stated)
- Bread needs a portal collaboration platform for multiple FinTech partners.
- Compliance stages: Due Diligence, Pre-Launch Testing, First Events Validation.
- Document upload and comments are required per questionnaire item.
- Complaint management workflow is required.
- Analytics dashboard: 1 CRMA dashboard with 3–4 widgets.
- Snowflake to Data Cloud ingestion required; existing connection will be reused.
- Alerts based on 3–4 parameters provided during discovery.
- Access control for internal vs external users is required.
- Sprint cadence: 2-week sprints.
- Test automation via Cypress/Cypress Cloud.
- New external functionality must meet WCAG 2.0 AA.

### Items implied but not defined
- Exact due diligence questionnaire structure, ownership, and scoring.
- Who can see what (partner-by-partner access rules, internal role split).
- What constitutes “testing schedules” (frequency, templates, evidence required).
- What “policy changes” look like (types, approvals, versioning expectations).
- Complaints channels (portal, email, phone), categories, SLAs.
- Data volumes, refresh frequency, and alert recipients.

---

## 6) Gaps & Assumptions (Must Confirm in Discovery)
| Area | Gap / Open Question | Why it matters | Current Assumption (until confirmed) |
|---|---|---|---|
| Timeline | SOW Effective Date shows **Mar 16, 2025** but milestone table uses **Mar 16, 2026** | Impacts schedule, staffing, and invoicing | Use milestone table dates unless corrected |
| Users | Number of internal users and external FinTech users | Licensing, performance, sharing model | 50–200 external users total |
| Portal access | How FinTech users will log in (Okta/SSO vs usernames) | Identity approach, security | Okta SSO available (SOW assumption) |
| FinTech segmentation | How many FinTech partners, and do they need separate “workspaces”? | Data separation & reporting | One workspace per FinTech |
| Questionnaire | Due diligence question set, answer types, evidence rules | Data model and UX | Bread provides standard template |
| Document handling | Allowed file types, size limits, retention, e-sign needs | Compliance and storage | Standard file upload + retention policy TBD |
| Testing schedules | Recurrence rules, required artifacts, exception handling | Automation design | Monthly/quarterly schedules by template |
| Policy change workflow | Approval steps, versioning rules, audit needs | Governance | Simple submit → review → approve → publish |
| Complaints | Intake channels, SLAs, escalations, reporting needs | Service process design | Complaints entered via portal + internal entry |
| Analytics | Metrics definition for the 3–4 widgets | Build correct dashboards | Progress + overdue + completion + complaint aging |
| Snowflake ingestion | Which tables/fields, refresh frequency, data quality | Data Cloud setup | Daily refresh; Bread provides mapping |
| Alerts | Exact 3–4 parameters, thresholds, recipients | Automation and compliance | Bread provides thresholds during discovery |
| Migration | “Validation of functionality and data migrated” but migration scope is out-of-scope for existing FinTechs | Avoid scope creep | Only validate new build + any agreed seed data |
| Training | SOW includes “Support change management and training” but training materials are out-of-scope | Set expectations | Enablement support = demos/KT only |

---

## 7) Proposed Discovery & Session Plan (3 Weeks, fits W1–W3)
**Goal:** Confirm requirements, data, security, and success measures so sprint scope is stable.

### Session 1 — Program Vision & Success Measures (90 min)
**Participants:** Sponsor bank program owner, product owner, compliance leadership, portal owner  
**Outputs:** goals, KPIs, in-scope confirmation, timeline confirmation (resolve date mismatch)

### Session 2 — Due Diligence & Onboarding Process Walkthrough (2 hours)
**Participants:** compliance SMEs, onboarding ops, a FinTech representative (if allowed)  
**Outputs:** step-by-step process, questionnaire structure, evidence requirements, stage exit criteria

### Session 3 — Portal Security & Access Rules (90 min)
**Participants:** security/identity (Okta), risk/compliance, portal owner  
**Outputs:** login method, who sees what, partner segregation rules, audit requirements

### Session 4 — Complaints Process & Routing (90 min)
**Participants:** complaints ops, customer service manager, compliance  
**Outputs:** intake channels, categories, routing rules, escalations, reporting, exception scenarios

### Session 5 — Data & Alerts (Snowflake → Data Cloud) (2 hours)
**Participants:** data engineering (Snowflake), analytics, compliance, product owner  
**Outputs:** source tables/fields, refresh frequency, data volume, 3–4 alert parameters, recipients

### Session 6 — Reporting, UAT, and Go-Live Readiness (90 min)
**Participants:** UAT lead, support team, product owner, reporting users  
**Outputs:** dashboard widget definitions, UAT entry/exit criteria, cutover plan outline, KT plan

---

## 8) Delivery Plan (Aligned to SOW)
- **Week 1–3:** Discovery (sessions above) + backlog/user story definition
- **Week 4–5:** Design (security model, portal structure, data mappings, test strategy)
- **Week 6–11:** Development (2-week sprints; incremental demos each sprint)
- **Week 12:** UAT + penetration testing (performed by Comenity) + remediation
- **Week 13:** Warranty / stabilization

**Environments:** DEV → SIT → UAT → Production (deployment by Comenity support team per SOW)

---

## 9) Quality & Acceptance (From SOW)
- 100% unit tests pass
- 99% functional test execution
- 95% functional test pass
- 80% automation coverage (where automatable)
- No open critical/high defects at end of UAT
- Deliverables accepted within 10 business days unless rejected with written deviations

---

## 10) Key Risks & Mitigations (Initial)
| Risk | Impact | Mitigation |
|---|---|---|
| Timeline/date mismatch (2025 vs 2026) | High | Confirm in Session 1 and baseline schedule |
| External user access model not defined early | High | Run Session 3 early; prototype permissions |
| Alert parameters not provided early | Medium | Make parameters a discovery deliverable with due date |
| Data quality issues from Snowflake | Medium | Run data profiling early; define exception handling |
| Training expectations mismatch | Medium | Confirm enablement scope vs training materials |

---

## 11) Open Items (Need Client Confirmation)
1. Confirm actual project dates and milestone calendar (2025 vs 2026).
2. Confirm number of FinTech partners and estimated external user counts.
3. Confirm login approach (Okta SSO) and external user invitation/registration process.
4. Provide due diligence questionnaire template and stage exit criteria.
5. Identify complaint intake channels + SLAs.
6. Provide Snowflake data dictionary + the 3–4 alert parameters/thresholds.

---

## Appendix A — Research References (to be expanded)
This draft is aligned to common Salesforce patterns for:
- External portals (Experience Cloud) including custom domains/URLs and secure external access
- Complaints/support workflows (Service Cloud) including routing and escalation
- Data ingestion and calculated metrics (Data Cloud) including automation triggers

Next step: I will add a short reference list with direct URLs from Salesforce documentation (and a small number of reputable implementation blogs) once the web research deep-dive completes.
