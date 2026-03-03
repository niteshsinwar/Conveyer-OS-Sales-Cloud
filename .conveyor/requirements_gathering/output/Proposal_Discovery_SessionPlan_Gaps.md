# Proposal + Discovery + Session Plan + Gaps

**Prepared for:** Comenity Servicing LLC (Bread Financial)  
**Prepared by:** Aethereus  
**Document owner:** Nitesh (stakeholder name provided)  
**Source document reviewed:** `aethereus_sow.md` (extracted from “Aethereus_and_Comenity_Servicing_LLC_SOW_for_Sponsor Bank 2026 1.0 Draft.pdf”)

---

## 1. What I Read (Source Summary)
The SOW describes a Salesforce implementation to support Bread Financial’s Sponsor Bank program for multiple FinTech partners. The platform is intended to manage **onboarding**, **governance**, and **regulatory compliance/audit collaboration** between Bread and FinTechs.

Key SOW facts captured:
- **Client:** Comenity Servicing LLC
- **Primary contact:** Tony Vasek
- **Effective date:** Mar 16, 2025
- **Term:** 3 months (note: SOW also shows an end date of Jun 12, 2026; see conflicts/gaps)
- **Delivery approach:** 2-week sprints (10 business days)
- **Milestones invoiced:** Program Start, Development Completion, Go-Live of Portal, Warranty Support
- **Quality targets:** 100% unit test pass, 99% functional test execution, 95% functional test pass, 80% automation coverage (where automatable), no open critical/high defects at UAT completion
- **Accessibility:** New external functionality must be WCAG 2.0 AA compliant

---

## 2. What I Understand the Business Needs (Plain English)
Bread needs one secure system where:
1) FinTech partners can **submit due diligence responses**, upload evidence, and collaborate with Bread reviewers.
2) Bread can **track onboarding stages** (Due Diligence → Pre-Launch Testing → First Events Validation) and see where each FinTech stands.
3) Bread can maintain a **central library** of policies/SOPs/training/audit artifacts.
4) Bread can **track policy changes** (who changed what, when, and what needs partner acknowledgment).
5) Bread can manage **customer complaints** from creation to resolution with routing rules and reporting.
6) Bread can view **dashboards** across onboarding progress and operational indicators.
7) Bread can ingest application data from **Snowflake into Salesforce’s data layer** and trigger alerts when loans/applications fall outside agreed thresholds.

---

## 3. Proposal (Based on the SOW)

### 3.1 Objectives
- Create a collaboration portal for FinTech onboarding and ongoing compliance.
- Provide internal governance tooling and visibility for Bread stakeholders.
- Implement complaint intake/routing/resolution workflow with reporting.
- Enable data-driven monitoring using Snowflake → Salesforce data ingestion plus calculated metrics and alerts.
- Meet Bread’s quality and release governance standards.

### 3.2 In-Scope Deliverables (Grouped)

#### A) FinTech Onboarding & Governance Portal (External + Internal)
- Track onboarding stages: Due Diligence, Pre-Launch Testing, First Events Validation.
- Due diligence questionnaire item tracking with:
  - file uploads
  - comments per item
  - status/ownership
- Pre-launch testing tracking + first events validation tracking.
- Auto-creation of testing schedules for ongoing compliance monitoring.
- Workflow to track/report on policy changes.
- Central hub for policies, SOPs, training/enablement references, audits, due diligence artifacts.
- Access controls so FinTech users only see their own information.
- Vanity URL setup for the FinTech portal.

#### B) Complaints Management
- Create complaint records.
- Route complaints to the right team.
- Track resolution workflow.
- Reporting and dashboards for oversight.

#### C) Dashboards & Analytics
- Portal/onboarding dashboard:
  - progress by stage
  - overdue tasks
  - task completion reporting
- “CRMA dashboard” (SOW assumption: **1 dashboard, 3–4 widgets**) for:
  - complaints
  - applications
  - transactions

#### D) Data Ingestion + Alerts
- Reuse existing Snowflake connection to ingest application data into Salesforce data layer.
- Create calculated metrics and automation to trigger alerts for loans/applications outside Bread-agreed parameters.
- Bread provides 3–4 alert parameters during discovery.

#### E) Quality Engineering + Release Support
- User story support, configuration + development.
- Unit tests.
- Manual and automated tests.
- Cypress automation scripts (Cypress Cloud).
- SIT/UAT support.
- Defect remediation (including issues found by Bread’s security/performance testing).
- Knowledge transfer to Bread/Comenity Salesforce support.

### 3.3 Out of Scope (Explicit in SOW)
- Workfront integration.
- Installing AppExchange products.
- Building training materials.
- Security testing & performance testing execution (remediation in-scope).
- Data migration for existing FinTechs.
- Changes to existing Bread Pay application functionality.
- Changes to Bread Platform (non-Bread Pay) not in scope.

### 3.4 Assumptions / Dependencies (from SOW)
- Bread provides UX/branding guidelines.
- Okta team available to set up external user authentication.
- Licenses provided by Bread.
- Stakeholders available for questions/decisions.
- UAT users available.
- Sign-offs within 5 business days.
- Existing Snowflake connection reused.

### 3.5 Delivery Approach
- 2-week sprint cadence.
- Early discovery to finalize plan, then design + build, then UAT and warranty.
- Monthly operational review + performance metrics (velocity, estimation accuracy, defect metrics, code quality).

---

## 4. Discovery Plan (What we will do to confirm requirements)

### 4.1 Discovery Goals
- Confirm who uses the system (internal teams + FinTech users) and what each must accomplish.
- Document the current process and pain points for:
  - onboarding & due diligence
  - pre-launch testing
  - first events validation
  - policy change management
  - complaint handling
- Confirm data requirements:
  - what needs to be captured per FinTech/program
  - required documents and evidence
  - audit trail requirements
- Confirm what must be shown in dashboards and what actions follow from alerts.
- Confirm the Snowflake → Salesforce data ingestion scope (fields, refresh frequency, volumes).
- Confirm security/access rules and any compliance constraints.

### 4.2 Discovery Deliverables
- Process maps (current state and future state)
- User personas + responsibilities
- Requirements backlog (user stories) with acceptance criteria
- Data dictionary (fields needed, definitions)
- Integration/data mapping for Snowflake ingestion
- Dashboard/KPI definitions
- Risks/assumptions log and decisions log

### 4.3 Discovery Success Criteria
- Stakeholders agree on:
  - onboarding stages and definitions
  - complaint workflow stages and routing logic
  - portal content structure and required artifacts
  - 3–4 alert parameters and who responds to alerts
  - minimum KPIs for dashboards

---

## 5. Session Plan (Suggested Discovery Sessions)
Below is a practical session plan that fits a sprint-based delivery.

### Session 1 — Executive Alignment & Success Measures (60–90 mins)
**Participants:** Platform Owner, Product Owner, Program sponsor, Compliance lead, Aethereus PM/Lead  
**Agenda:**
- What problem we are solving and why now
- What “success” looks like (3–5 measurable outcomes)
- Confirm timeline constraints and key milestones
- Confirm which FinTechs/programs are in scope first
**Outputs:** agreed goals, scope priorities, success metrics, decision owners

### Session 2 — FinTech Onboarding & Due Diligence Deep Dive (90 mins)
**Participants:** Product Owner, Due diligence SMEs, FinTech onboarding ops, Aethereus Analyst/Lead  
**Agenda:**
- Steps from FinTech invitation → due diligence completion → approval
- Questionnaire structure (sections, items, evidence)
- Review/approval steps and audit needs
- Exceptions: missing docs, rework, escalations
**Outputs:** step-by-step process, required data/doc list, exception scenarios

### Session 3 — Pre-Launch Testing + First Events Validation (90 mins)
**Participants:** Testing lead/ops, Compliance SME, Program ops, Aethereus Analyst/QA  
**Agenda:**
- What is “pre-launch testing” and what artifacts prove completion?
- How first events validation is performed
- How schedules should be created automatically (triggers + cadence)
- Exception handling (late testing, failed validations)
**Outputs:** schedule rules, tasks checklist, evidence requirements

### Session 4 — Complaints Workflow + Reporting (60–90 mins)
**Participants:** Complaints team lead, Support managers, Compliance SME, Aethereus Analyst  
**Agenda:**
- How complaints come in today
- Required information to capture
- Routing rules and service targets
- Reporting needs
**Outputs:** complaint stages, routing rules, KPI list

### Session 5 — Data + Alerts (Snowflake + Monitoring) (60–90 mins)
**Participants:** Data team, Snowflake owner, Compliance/risk SMEs, Aethereus Technical lead  
**Agenda:**
- What application/loan fields come from Snowflake
- Refresh frequency, volumes, data quality
- Define 3–4 alert parameters and actions taken
- Failure handling (missing feed, duplicates)
**Outputs:** data mapping, alert definitions, monitoring process

### Session 6 — Security, Access, and Portal Experience (60 mins)
**Participants:** Security/Identity team (Okta), Compliance, Portal owner, Aethereus lead  
**Agenda:**
- Who can see what (internal roles and FinTech roles)
- Login approach and user lifecycle (invite, deactivate)
- Document visibility rules
- Audit trail expectations
**Outputs:** role matrix, access rules, identity assumptions confirmed

---

## 6. Gaps (What’s Missing / Needs Clarification)
This is the **gap list** that prevents us from writing a complete BRD immediately.

### 6.1 Gap Analysis Checklist Score (current)
- User roles & personas: ❌ unknown
- Detailed process steps: ❌ not documented step-by-step
- Data fields & attributes: ❌ not listed
- Integration data flow: ⚠️ partial (Snowflake mentioned, but details missing)
- Success metrics & KPIs: ⚠️ partial (quality KPIs exist; business KPIs not defined)
- Volume & scale: ❌ unknown (users, records, daily ingestion)
- Exception handling: ❌ unknown
- Current state (as-is): ❌ unknown

**Estimated gap score right now:** ~1/8 to 2/8 (SOW provides high-level scope but not operational detail)

### 6.2 Specific Gaps / TBDs
- Which FinTechs/programs are in scope for the first release?
- Exact due diligence questionnaire structure and evidence requirements.
- What “opportunity stage” means for the onboarding dashboard (what stages, owned by whom?).
- Definition of “testing schedules automatically” (schedule logic, cadence, triggers).
- Policy change workflow specifics (review/approval, partner acknowledgment required?).
- Complaint routing rules and service targets.
- Dashboard widget definitions (exact KPIs, filters, drill downs).
- Snowflake ingestion specifics (fields, refresh frequency, volumes, data quality rules).
- Alert thresholds (3–4 parameters) and what action occurs when an alert triggers.
- Identity and access model details (Okta approach, user provisioning, deactivation).
- Data migration needs for existing FinTechs (explicitly out of scope, but confirm if business expects any history loaded).

### 6.3 Conflicts / Inconsistencies in SOW (Needs Confirmation)
- SOW states **“Term: 3 months”** but shows an **end date of Jun 12, 2026** and milestone invoice dates in **2026**. We need confirmation of the actual timeline.

---

## 7. Salesforce Capability Mapping (High Level, for Implementation Planning)
*(Kept business-readable; this is not a technical design.)*
- **Portal:** Salesforce Experience Cloud is typically used for external partner portals with restricted visibility.
- **Complaints:** Salesforce Service Cloud is typically used for complaint/support request tracking, routing, and reporting.
- **Dashboards:** Salesforce dashboards plus advanced analytics tooling referenced as “CRMA” in the SOW.
- **Snowflake ingestion + metrics/alerts:** Salesforce Data Cloud plus automation to notify owners when thresholds are breached.

---

## 8. Next Step
Answer a short set of discovery questions so we can raise the gap score and produce a complete BRD.
