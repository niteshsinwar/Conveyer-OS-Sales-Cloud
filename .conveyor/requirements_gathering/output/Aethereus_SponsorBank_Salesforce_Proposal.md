# Proposal: Aethereus Salesforce Development for Sponsor Bank (Comenity / Bread Financial)

**Source document analyzed:** `aethereus_sow.md` (SOW Effective Date: Mar 16, 2025; term 3 months; delivery milestones in 2026)

## 1. Executive Summary
Bread Financial (Sponsor Bank) requires a secure collaboration and governance platform to onboard and manage multiple FinTech partners, collect due diligence evidence, track compliance milestones (Due Diligence → Pre‑Launch Testing → First Events Validation), manage policy changes with auditability, and support a complaints case lifecycle. The solution will leverage:
- **Experience Cloud** for the FinTech portal/collaboration interface
- **Salesforce core platform + Service Cloud** for workflow, tasks, approvals, complaints case management, and internal operations
- **Salesforce Data Cloud** to ingest application data from **Snowflake**, calculate insights, and trigger alerts
- **CRM Analytics (CRMA)** dashboard (1 dashboard, 3–4 widgets) for Complaints / Applications / Transactions review

Delivery approach aligns to SOW: 2-week sprints, DevOps standards provided by client, Cypress test automation, WCAG 2.0 AA compliance for new external functionality, and deployment to the Bread Pay org.

## 2. In-Scope Capabilities (as stated in SOW)
### 2.1 Portal / Collaboration / Governance
- Onboarding + governance platform for Bread + FinTechs to collaborate
- Track compliance stages: **Due Diligence**, **Pre‑Launch Testing**, **First Events Validation**
- Upload **documents** and **comments** per item in the due diligence questionnaire
- Track **pre‑launch testing** & **first events validation**
- Automatically create **testing schedules** for monitoring compliance
- Workflow to track/report **policy changes**
- Central hub: policies, training/enablement (SOPs), audits, due diligence artifacts
- **Access control** (internal/external users see only relevant information)
- Dashboards: fintech progress by opportunity stage, overdue tasks, task completion
- **Vanity URL** for FinTech Portal

### 2.2 Complaints Management
- Create complaint **cases**, routing, and resolution workflow

### 2.3 Analytics (CRMA)
- Build **1 CRMA dashboard** (3–4 widgets) for Complaints, Applications, Transactions

### 2.4 Data Cloud / Snowflake
- Ingest application information from **Snowflake into Data Cloud**
- Create **calculated insights** and **flows** to trigger alerts for loans/applications outside Bread-agreed parameters

### 2.5 Delivery / Quality / Enablement
- Validation of functionality and data migrated (note: SOW also states data migration for existing fintechs is out of scope)
- Support change management and training (but training materials development is out of scope)
- Create test automation scripts
- Deploy changes to Bread Pay org

## 3. Out of Scope (per SOW)
- Browser/platform-specific custom compatibility beyond Salesforce-supported browsers
- Development of training materials
- Accessibility requirements beyond Salesforce OOTB (still WCAG 2.0 AA for new external functionality)
- Accessibility testing
- Security/performance testing execution (remediation of findings is in-scope)
- Changes to existing Bread Pay apps
- Changes to Bread Platform
- Workfront integration
- AppExchange product installation/setup
- Data migration for existing FinTech has not been considered in scope
- Any changes to Account Engagement not considered

## 4. Key Assumptions / Dependencies (per SOW)
- Bread provides theme/UX guidelines (UPP branding)
- **Okta team** available for external user authentication setup
- OOTB knowledge categories used to segregate knowledge per FinTech
- Licenses provided by Bread for internal/external users
- Timely stakeholder availability + signoffs within 5 business days
- Cypress Cloud used for automation
- Pen test support provided (execution by others)
- Existing Snowflake connection reused
- Bread provides 3–4 alert parameters during discovery

## 5. Proposed Salesforce Solution (High-Level Architecture)
### 5.1 Experience Cloud: FinTech Portal
**Purpose:** External collaboration surface for FinTech users.

**Key design points (aligned to SF best practices & portal security):**
- Use **Experience Cloud** site with authenticated external users (no guest uploads)
- **SSO via Okta** using SAML/OIDC (to be confirmed)
- Segmentation via **Account/Contact relationship** (FinTech organization modeled as Account)
- **Record access** via External Sharing Model + Sharing Sets / criteria-based sharing (final approach during security session)
- Document management using **Salesforce Files** (optionally Libraries) with controlled sharing
- Central knowledge/policy hub using **Salesforce Knowledge** and Data Categories to segment content per FinTech (SOW assumption)
- Custom domain / **vanity URL** implemented via Experience Cloud custom URL + DNS steps

### 5.2 Sponsor Bank Governance Application (Internal)
**Core concepts (proposed objects):**
- **FinTech (Account)** and key contacts
- **Onboarding/Governance “Program”** (custom object) tied to FinTech + Opportunity (if Opportunity is used for stages)
- **Due Diligence Questionnaire** (custom object) with **Questionnaire Items** (child records) supporting:
  - Status, owner, due date
  - Comments (feed or related list)
  - File uploads per item
- **Testing Plan / Testing Schedule** object(s) generated automatically (Flow) with tasks/milestones
- **Compliance Stages** tracked via Path/Status + gated transitions (approvals/required artifacts)
- **Policy Change Request** object with approvals, versioning metadata, and audit reporting

### 5.3 Service Cloud: Complaints
- **Case** used for complaint intake
- Routing via **queues**, assignment rules, and/or omni-channel (to confirm licensing)
- SLA tracking with **Entitlements/Milestones** (if required)
- Audit trail using field history tracking + feed tracking

### 5.4 Data Cloud + Snowflake + Alerts
- Reuse existing Snowflake connection to ingest Application/Loan related datasets
- Implement **Calculated Insights** in Data Cloud for threshold/parameter checks
- “Activation” pattern: publish results to Salesforce objects and trigger **Flows** for alerts/notifications/tasks

### 5.5 CRM Analytics (CRMA)
- 1 dashboard with 3–4 widgets, example widgets:
  1) Complaints trend by type/severity and SLA status
  2) Applications outside parameters (count, distribution)
  3) Transaction monitoring summary (source dataset dependent)
  4) FinTech onboarding progress / overdue compliance tasks

## 6. Delivery Approach (per SOW, refined into proposal)
### 6.1 Methodology
- **2-week sprints** (10 business days)
  - Day 1: Sprint Planning
  - Day 10: Review + Retro
- Sprint calendar finalized with Salesforce Tech/Product teams within first 2 weeks
- Use client-provided **technology stack** and **testing framework**

### 6.2 Environments / Release
- DEV → SIT → UAT (as per SOW)
- Client support team completes production deployment + first events validation
- Aethereus supports CI/CD best practices for code migration (per client standards)

### 6.3 Quality & Acceptance
- Success factors per SOW:
  - 100% unit tests pass
  - 99% functional test execution
  - 95% functional test pass
  - 80% automation coverage where automatable
  - No open Critical/High defects at UAT completion
- Deliverable acceptance: 10 business day review; remediation within 15 calendar days

## 7. Discovery Gaps (must be answered before design is “real”) 
These items are not fully defined in the SOW and require discovery:
1. **FinTech onboarding model**: Is Opportunity the driver of stage, or a custom onboarding object? What are exact stages and gate criteria?
2. **Due diligence questionnaire**: structure, number of questions, scoring, versioning, evidence requirements, renewals.
3. **Pre-launch testing & first events validation**: what test types, schedules, owners, SLAs, and what constitutes pass/fail.
4. **Policy change workflow**: what triggers a change, approvals, versioning, notifications, audit reporting, retention.
5. **Access control**: internal roles, external roles, data partitioning model, need for row-level segregation beyond Account.
6. **Authentication**: Okta approach, MFA requirements, user provisioning/JIT, logout, session policies.
7. **Complaints**: intake channels, categories, regulatory SLAs, escalations, reporting, linkage to FinTech/program.
8. **Data Cloud**: data volumes, refresh frequency, mapping, identity resolution strategy, where alerts must surface.
9. **CRMA**: exact widgets/KPIs, datasets, security model.
10. **Content/Knowledge**: what is “policy hub” content type, authoring/approval, audience segmentation.

## 8. Proposed Discovery Session Plan (for consultant to run)
### SESSION 1: Executive Vision & Success Criteria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Sponsor/Program Owner, Product Owner, Compliance lead, Portal owner
**Duration:** 60–90 min
**Purpose:** Align on goals, scope boundaries, KPIs, release priorities

**MUST-ASK QUESTIONS:**
1. What are the top 3 outcomes for this portal (speed onboarding, audit readiness, reduced email, etc.)?
2. What does “onboarding complete” mean and who signs off?
3. What KPIs will define success (cycle time, overdue tasks, complaint SLA, audit findings reduction)?

**WATCH FOR:**
- Misalignment between “collaboration hub” vs “regulatory system of record”

**EXPECTED OUTPUTS:**
- Prioritized outcomes + MVP definition

### SESSION 2: FinTech Onboarding & Due Diligence Deep Dive
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Compliance SMEs, Onboarding ops, FinTech relationship managers
**Duration:** 90 min
**Purpose:** Define workflow, questionnaire, artifacts, stage gates

**MUST-ASK QUESTIONS:**
1. Walk through Due Diligence: stages, tasks, owners, and required evidence per stage.
2. Questionnaire: how many sections/questions, who answers, do you need scoring and versioning?
3. Exceptions: what happens if a FinTech misses a due date or uploads incomplete/incorrect documents?

**WATCH FOR:**
- Need for periodic re-certification (annual/quarterly) and re-use of prior artifacts

**EXPECTED OUTPUTS:**
- As-is/to-be process map + questionnaire metadata requirements

### SESSION 3: Testing Schedules, Pre-Launch Testing, First Events Validation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Testing/QA SMEs, Compliance monitoring, FinTech ops
**Duration:** 60–90 min
**Purpose:** Define automated scheduling logic and validation checkpoints

**MUST-ASK QUESTIONS:**
1. What drives the testing schedule (time-based, event-based, risk-tier, product type)?
2. What are the required test events and what evidence is collected?
3. Who approves pass/fail and what remediation workflow is needed?

**WATCH FOR:**
- Calendar/holiday rules, dependencies on external tools (out of scope may apply)

**EXPECTED OUTPUTS:**
- Schedule rules + data elements for automation

### SESSION 4: Policy Hub + Policy Change Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Policy owners, Compliance, Legal, Audit
**Duration:** 60–90 min
**Purpose:** Define change request lifecycle, audit trail, reporting

**MUST-ASK QUESTIONS:**
1. What constitutes a policy (document, knowledge article, SOP) and who owns it?
2. What approvals are required and what is the desired audit report output?
3. How do you notify FinTechs and ensure attestation/training completion (if required)?

**WATCH FOR:**
- Retention and evidence requirements for regulators

**EXPECTED OUTPUTS:**
- Policy data model + workflow states/approvals

### SESSION 5: Portal UX, Content Segmentation, Access Control
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Portal product owner, Security, Branding/UX, FinTech representative
**Duration:** 90 min
**Purpose:** Define portal IA, pages, permissions, secure file handling

**MUST-ASK QUESTIONS:**
1. What portal actions must external users perform (submit questionnaire, upload docs, view policies, respond to comments)?
2. What should a FinTech user see/not see across other FinTechs? Any sub-entities?
3. File handling: max sizes, file types, virus scanning expectations, download restrictions.

**WATCH FOR:**
- Over-reliance on manual sharing; need for scalable sharing sets and role strategy

**EXPECTED OUTPUTS:**
- Site map + security/sharing decisions + UX requirements

### SESSION 6: Complaints Case Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Complaints ops, Contact center lead, Compliance
**Duration:** 60–90 min
**Purpose:** Define Case lifecycle, routing, SLAs, reporting

**MUST-ASK QUESTIONS:**
1. What are complaint categories, severities, and regulatory SLA requirements?
2. Routing rules: queue, round-robin, skill-based, escalations.
3. Linkage: how do complaints associate to FinTech, application, transaction?

**WATCH FOR:**
- Need for Entitlements/Milestones and audit reporting

**EXPECTED OUTPUTS:**
- Case record types, statuses, routing logic, SLA model

### SESSION 7: Data Cloud + Snowflake + Alerting (Technical)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Data Cloud admin, Snowflake engineer, Integration architect, Security
**Duration:** 90 min
**Purpose:** Confirm datasets, refresh cadence, calculated insights, activation pattern

**MUST-ASK QUESTIONS:**
1. What Snowflake tables/views are in scope and what is refresh frequency/latency target?
2. Identity resolution: keys available to match to Salesforce records?
3. Alerting: what are the 3–4 parameters, thresholds, and desired actions (task, email, case, slack)?

**WATCH FOR:**
- Data volumes and licensing constraints impacting refresh and CRMA datasets

**EXPECTED OUTPUTS:**
- Data mapping, ingestion schedule, activation design

### SESSION 8: DevOps / Environments / Testing Automation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Client Salesforce support team, Aethereus tech lead, QA lead
**Duration:** 60 min
**Purpose:** Confirm toolchain, branching strategy, Cypress approach, deployment gates

**MUST-ASK QUESTIONS:**
1. What is the current CI/CD toolchain (Copado, Gearset, Azure DevOps, GitHub Actions, etc.)?
2. How will Cypress run (pipeline triggers, data seeding strategy, environment variables)?
3. Definition of Done for stories (unit tests, code review, security scan remediation, regression suite)?

**WATCH FOR:**
- Test data management and brittle UI automation without stable selectors

**EXPECTED OUTPUTS:**
- Agreed pipeline + test strategy + entry/exit criteria per environment

## 9. Risks & Mitigations (proposal view)
| Risk | Impact | Likelihood | Mitigation |
|---|---:|---:|---|
| External user data segregation incorrectly designed | High regulatory risk | Med | Dedicated security/sharing session + least-privilege model + testing with multiple FinTech personas |
| Okta/SSO delays | Schedule risk | Med | Early Session 5; define fallback auth (temporary username/password) only if approved |
| Data Cloud mapping/identity resolution unclear | Alerts/reporting fail | Med | Session 7 early; validate keys and sample data |
| Scope tension: “validation of migrated data” vs “migration out of scope” | Rework | Med | Confirm what data is being migrated (if any) and acceptance criteria |
| CRMA dataset readiness | Dashboard not usable | Med | Confirm data sources early; prototype widgets with sample dataset |

## 10. Next Steps
1. Confirm stakeholders and book Sessions 1–3 within first 2 weeks.
2. Produce deliverables after discovery: process maps, data model draft, security model, backlog/user stories.
3. Finalize sprint calendar and MVP release plan.

---

## Appendix A: Salesforce capability mapping references (high level)
- Experience Cloud: portal, authentication, custom domain (vanity URL), external user sharing patterns
- Service Cloud: case management, routing, milestones/entitlements
- Data Cloud: Snowflake ingestion, calculated insights, activation to Salesforce + flows
- CRM Analytics: dashboarding for operational/compliance insights
- Testing: Cypress-based UI automation integrated into CI/CD
