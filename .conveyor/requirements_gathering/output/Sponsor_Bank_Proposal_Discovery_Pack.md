# Proposal + Discovery Pack
**Project:** Aethereus Salesforce Development for Sponsor Bank (Bread Financial / Comenity Servicing LLC)  
**Source document reviewed:** `aethereus_sow.md` (SOW draft)  
**Prepared by:** Salesforce Business Analyst (autonomous synthesis)  
**Date:** 2026-03-03

---

## 1) What I Read (Source Summary)
This proposal pack is based on the SOW for a collaboration and compliance platform to support Bread Financial as a Sponsor Bank onboarding and governing multiple FinTech partners.

### Contract basics (as stated)
- **Customer:** Comenity Servicing LLC (Bread Financial)
- **Provider:** Aethereus
- **Term:** stated as **3 months**
- **Dates shown in SOW:**
  - **SOW Effective Date:** Mar 16, 2025
  - **Invoice milestone dates:** Mar 16, 2026 / May 22, 2026 / Jun 5, 2026 / Jun 12, 2026
  - **SOW End Date:** Jun 12, 2026

> **Note:** The SOW contains date inconsistencies (see “Gaps & Open Questions”).

---

## 2) What I Understand (Business Need & Goal)
Bread Financial (Sponsor Bank) needs a **single, secure collaboration platform** that enables:
1) **FinTech onboarding and governance** (due diligence, testing, first events validation)
2) **Regulatory compliance evidence collection** (documents, audit artifacts, policy tracking)
3) **Ongoing monitoring** (testing schedules, dashboards, alerts on out-of-parameter loans/applications)
4) **Complaint intake and handling** (create, route, resolve complaints)

In plain language: this project creates a “FinTech partner portal + internal control center” so Bread can prove compliance, track progress, and manage exceptions.

---

## 3) Proposed Solution (High-Level)
Based on the SOW, the solution is best delivered as a combination of:

### A) External FinTech Portal (Partner-facing)
- Secure login for FinTech users
- FinTech-specific visibility (each FinTech sees only their own information)
- Document upload and comments per due diligence item
- Progress tracking for onboarding stages
- Central library for policies/SOPs/training/audit artifacts
- Vanity URL + branding

### B) Internal Operations Workspace (Bread/Comenity users)
- Oversight dashboards (progress, overdue work, completion reporting)
- Complaint intake/routing/resolution process
- Policy change tracking and reporting
- Testing schedules automatically generated

### C) Data + Monitoring
- Ingest application data from **Snowflake into Salesforce data layer** (SOW says “Data Cloud”)
- Define calculated metrics and automated alerts to flag exceptions (out-of-parameter loans/applications)
- 1 analytics dashboard with 3–4 widgets for Complaints/Applications/Transactions

### D) Quality & Release Support
- Unit testing + manual testing + automation (Cypress)
- SIT/UAT support and defect remediation
- Deployment support across DEV/SIT/UAT (production deployment handled by Client Support Team)

---

## 4) In-Scope Deliverables (Proposal View)
This section translates the SOW “bullets” into concrete deliverables you can put in a proposal.

### 4.1 FinTech Onboarding & Governance
- **Stage model** for: Due Diligence → Pre-Launch Testing → First Events Validation
- **Due diligence questionnaire tracking**:
  - each item has owner, status, due date, evidence/documents, and comments
- **Pre-launch testing tracker** and **first events validation tracker**
- **Automated schedule creation** for monitoring/testing activities
- **Policy change workflow** (submit → review → approve → communicate → audit log)
- **Central knowledge hub** (policies, SOPs, enablement content, audits, artifacts)
- **Access controls** for internal vs external users
- **Vanity URL** configured for portal

### 4.2 Complaints Management
- Complaint capture process (required information, categorization)
- Routing rules (who gets what and when)
- Resolution workflow (statuses, SLAs/targets, approvals if needed)
- Reporting (volume, aging, outcomes)

### 4.3 Dashboards
- FinTech progress by onboarding stage
- Overdue tasks
- Task completion reporting
- Analytics dashboard: Complaints / Applications / Transactions (3–4 widgets)

### 4.4 Data Ingestion & Alerts
- Reuse Snowflake connection to ingest application data into Salesforce data layer
- Define 3–4 business parameters for exceptions
- Calculations and alerting workflow
- Monitoring/error handling approach

### 4.5 Testing, Deployment & Handoff
- Unit tests (target: 100% pass)
- Functional testing execution and pass-rate targets (per SOW)
- Cypress automation suite (target: 80% coverage of automatable components)
- SIT and UAT support
- Remediation of issues found in security/performance testing executed by Client
- Knowledge transfer to Comenity Salesforce support team

---

## 5) Out of Scope (As Stated)
- Workfront integration
- Installing/setting up AppExchange products
- Training material development (note: SOW also says “support change management and training” — needs clarification)
- Accessibility testing beyond what Salesforce certifies (but new external work must be WCAG 2.0 AA compliant)
- Security and performance testing execution (remediation is in scope)
- Changes to existing Bread Pay applications functionality
- Data migration for existing FinTechs

---

## 6) Discovery Plan (How We Will Confirm Requirements)
The SOW explicitly indicates discovery then design then build. The goal of discovery is to convert the SOW bullets into:
- agreed process flows
- role-based access rules
- data fields and dashboards
- alert thresholds and escalation behavior
- test approach and acceptance criteria

### Discovery Goals
1) Confirm the **end-to-end onboarding lifecycle** and who does what at each step
2) Define the **exact evidence/documents** required per due diligence item
3) Confirm **portal audiences** and access rules
4) Define **complaint categories, routing, and resolution standards**
5) Confirm **Snowflake data** contents, refresh cadence, and the **3–4 alert parameters**
6) Confirm reporting needs and success metrics

### Discovery Outputs (deliverables)
- Requirements backlog (user stories + acceptance criteria)
- Process maps (current → future)
- Portal sitemap + page wireframe notes
- Data dictionary (what information is stored)
- Integration mapping (Snowflake → Salesforce): fields, frequency, ownership
- Dashboard specifications (widgets, filters, drill-downs)
- Test strategy and UAT plan

---

## 7) Session Plan (2–6 sessions, measurable)
Below is a practical session plan that fits a 1–2 week discovery window and aligns to the SOW sprint cadence.

### Session 1 — Kickoff & Success Definition (60 min)
**Participants:** Platform Owner, Product Owner, Program Manager, Compliance lead, Aethereus PM/Lead/BA  
**Agenda:**
- Confirm objectives and outcomes
- Confirm timeline dates and environments (DEV/SIT/UAT)
- Define how decisions will be made and who signs off
**Outputs:** confirmed scope boundaries + decision owners + risks log

### Session 2 — FinTech Onboarding Process Deep Dive (90 min)
**Participants:** Product Owner, onboarding ops, compliance/audit SME, FinTech relationship manager  
**Agenda:**
- Walkthrough of Due Diligence → Pre-Launch Testing → First Events Validation
- What tasks exist, owners, timing, dependencies
- What “done” means per stage
**Outputs:** process map + draft task templates + stage exit criteria

### Session 3 — Portal Experience & Access Rules (90 min)
**Participants:** Portal/business owner, security/identity (Okta), compliance, 1–2 FinTech user reps (if possible)  
**Agenda:**
- What FinTech users must do in the portal
- Document upload expectations (formats, size limits, versioning needs)
- Who can see what (FinTech vs internal)
- Vanity URL and branding requirements
**Outputs:** portal sitemap + access rules + content categories

### Session 4 — Complaints Intake & Resolution (60 min)
**Participants:** Complaints ops lead, support team lead, compliance, reporting stakeholder  
**Agenda:**
- What qualifies as a complaint
- Required information captured
- Routing rules and escalation
- Resolution outcomes and reporting
**Outputs:** complaint workflow + routing matrix + reporting KPIs

### Session 5 — Data, Alerts & Dashboards (90 min)
**Participants:** Data/analytics owner, Snowflake owner, compliance/risk, product owner  
**Agenda:**
- What data comes from Snowflake (applications/transactions)
- Refresh frequency and data ownership
- Define the 3–4 alert parameters and who gets notified
- Confirm dashboard widgets and drilldowns
**Outputs:** data mapping + alert definitions + dashboard spec

### Session 6 — Testing, UAT & Release Readiness (60 min)
**Participants:** QA lead, release manager, support team, product owner  
**Agenda:**
- UAT scope and testers
- Defect severity definitions
- Automation scope (Cypress)
- Release readiness checklist + handoff
**Outputs:** UAT plan + test scope + acceptance checklist

---

## 8) Gaps & Open Questions (What’s Missing / What We Need to Confirm)
This is the “what are gaps” section: gaps are items not defined enough in the SOW to build and test successfully.

### Gap Score (8-point checklist)
- User roles/personas: **Missing**
- Detailed process steps: **Missing**
- Data fields/attributes: **Missing**
- Integration data flow details: **Partially stated (Snowflake → Data Cloud), but missing specifics**
- Success metrics/KPIs: **Partially stated (test/quality), missing business KPIs**
- Volume/scale: **Missing**
- Exception handling: **Missing**
- Current state (“how today works”): **Missing**

**Current gap score estimate:** **1/8** (only partial integration and quality targets are described)

### Priority gaps to close
1) **Who are the users?** (internal roles, FinTech roles, auditors, support)
2) **What is the exact due diligence questionnaire structure?** (how many sections/items, required evidence)
3) **Document handling rules:** sizes, retention, versioning, approvals, confidentiality
4) **Alert parameters:** exact definitions and who must act on them
5) **Volumes:** # of FinTechs, # of due diligence items, expected uploads per month, # complaints/month
6) **Complaint workflow details:** categories, routing, SLAs, escalation, closure codes
7) **Reporting details:** exact metrics for “progress” and “overdue”
8) **Date alignment:** confirm actual start/end and milestone dates

### Known conflicts / inconsistencies found in SOW
- SOW says **term = 3 months**, but contains dates spanning **2025–2026**, and an end date of **Jun 12, 2026**.
- Invoice milestone says “Kickoff for ORG migration program” (wording) while scope is primarily portal/governance; confirm if “ORG migration” is a template artifact.

---

## 9) Proposal Schedule (SOW-aligned, high-level)
The SOW includes a 13-week plan with phases:
- **Weeks 1–2:** Discovery
- **Weeks 3–4:** Design
- **Weeks 5–10:** Development (iterative sprints)
- **Weeks 11–12:** UAT / Pen test support
- **Week 13:** Warranty

> Final calendar to be confirmed in Session 1 based on resource availability and environment readiness.

---

## 10) Acceptance & Quality Approach (from SOW)
- Deliverables accepted when they materially meet agreed specs with no critical defects.
- Target quality measures stated:
  - 100% unit test pass
  - 99% functional test execution
  - 95% functional test pass
  - 80% automation coverage (where automatable)
  - no open critical/high defects at end of UAT
- Code and automated tests require approval by Comenity Salesforce Support.

---

## 11) Assumptions (From SOW)
- Branding/UX guidelines supplied by Bread
- Okta team available for external login setup
- Required licenses provided by Bread
- Sign-offs in 5 business days
- Cypress Cloud used for automation
- Existing Snowflake connection reused
- Bread provides 3–4 alert parameters during discovery
- 1 analytics dashboard (3–4 widgets)

---

## 12) Next Step
If you confirm you want this pack converted into a **client-ready proposal PDF structure**, I can:
- reformat into a formal proposal template (Executive Summary, Scope, Approach, Timeline, Assumptions, Risks)
- add a one-page “Solution Overview” diagram (text-based, since we’re in markdown)

