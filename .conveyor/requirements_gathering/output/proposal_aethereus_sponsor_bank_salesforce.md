# Proposal: Salesforce Sponsor Bank Collaboration Platform (Comenity/Bread Financial)

## 1. Proposal Overview
Comenity Servicing LLC (Bread Financial) operates as Sponsor Bank for multiple FinTechs and requires a secure, auditable collaboration platform to support:
- FinTech onboarding and ongoing governance
- Regulatory compliance evidence collection (due diligence artifacts, testing results, audits)
- Complaint intake, routing, and resolution
- Analytics and proactive monitoring/alerting on application/loan parameters

This proposal is based on the provided SOW (“Aethereus Salesforce Development for Sponsor Bank”) and maps the requested capabilities to standard Salesforce products and implementation approaches.

## 2. Salesforce Products & Capabilities in Scope (Mapped from SOW)
| SOW Need | Proposed Salesforce Capability | Notes |
|---|---|---|
| FinTech collaboration platform; external + internal access | **Experience Cloud** portal/site | FinTech users as external identities; Bread internal users in core org |
| Track compliance stages (Due Diligence, Pre-Launch Testing, First Events Validation) | **Custom objects + Flow** (or Case/Opportunity stages if aligned) | Recommended: purpose-built Compliance Lifecycle objects for auditability |
| Upload documents + comments per due diligence item | **Salesforce Files**, related lists, optional **Experience Cloud CMS/Content** | Document classification and retention rules to be defined |
| Track pre-launch testing & first events validation | Custom objects + task plans + approval gates | Gate criteria and evidence requirements are key discovery items |
| Auto-create testing schedules | **Flow**, **Scheduled Flows**, task generation | Consider holiday calendars and SLA rules |
| Workflow to track/report on policy changes | **Policy/Document object**, versioning via Files, audit fields, approvals | Could leverage Knowledge for published policies |
| Central hub for policies, training, SOPs, audits | **Knowledge** + **Experience Cloud** pages + Files | SOW assumption: out-of-box data categories for segregation |
| Access control internal/external; “only see relevant info” | Experience Cloud sharing sets, roles, permission sets, sharing rules | Requires clear data ownership model per FinTech |
| Dashboard on FinTech progress, overdue tasks, completion | Standard reports/dashboards + optionally CRM Analytics | Define KPIs, stage aging, exception reporting |
| Complaint cases, routing, resolution workflow | **Service Cloud (Cases)** + queues, assignment rules, escalations | Entitlements/milestones optional if SLAs required |
| CRMA dashboard for Complaints/Applications/Transactions | **CRM Analytics (CRMA)** 1 dashboard, 3–4 widgets (per SOW) | Confirm datasets and refresh cadence |
| Ingest Snowflake data into Data Cloud for application info | **Data Cloud** + Snowflake connector (existing connection reused) | Confirm objects, volumes, refresh, and mapping |
| Calculated insights + alerts for out-of-parameter loans/apps | **Data Cloud Calculated Insights** + activation to **Flow**/platform events | SOW: 3–4 parameters provided by Bread during discovery |
| Vanity URL for FinTech portal | Experience Cloud domain + vanity URL | Requires DNS, cert, and security review |
| Deployment to Bread Pay ORG | DevOps processes to client standards | SOW: client support completes prod deploy + first events validation |
| Test automation scripts | **Cypress** automation (client framework) | SOW: Cypress Cloud used |
| WCAG 2.0 AA compliance for new external functionality | Experience Cloud + accessible components | SOW: additional accessibility testing out of scope |

## 3. Proposed Solution Architecture (High Level)
### 3.1 Experience & Collaboration
- **Experience Cloud Portal (“FinTech Portal”)**
  - FinTech onboarding workspace
  - Due diligence questionnaire items with evidence upload
  - Testing schedule visibility and task completion
  - Policies/Knowledge hub segmented by FinTech (data categories)
  - Complaint submission and status tracking (if enabled for externals)

### 3.2 Compliance & Governance Data Model (Proposed)
- **FinTech Account** (Account record representing the FinTech)
- **Onboarding/Governance Record** (custom object; 1 per FinTech engagement or per product/program)
- **Due Diligence Questionnaire** (header) and **Due Diligence Items** (line items)
  - Each item supports: status, owner, due date, comments, evidence files
- **Testing Plan** and **Testing Events** (pre-launch / first events validation)
- **Policy** (custom object or Knowledge article) with change log and approval status
- **Complaints** as **Cases** (with record types)

### 3.3 Data & Analytics
- **Data Cloud** ingest from Snowflake for application/loan related attributes
- **Calculated Insights** to derive threshold breaches
- **Alerts** triggered via Flow (e.g., create tasks, cases, or notifications)
- **CRM Analytics (CRMA)** dashboard for Complaints/Applications/Transactions

### 3.4 Identity & Access (Key Assumption from SOW)
- **Okta SSO** for external users (authentication design to be completed with Okta team)
- Row-level visibility by FinTech using:
  - Experience Cloud sharing sets + sharing rules
  - External user roles (if needed) and permission sets
  - Segregation of Knowledge via data categories

## 4. Delivery Approach (Aligned to SOW)
### 4.1 Agile Sprint Delivery
- 2-week sprints (10 business days)
  - **Day 1:** Sprint Planning
  - **Day 10:** Sprint Review + Retrospective
- Sprint calendar finalized within first 2 weeks after kickoff.

### 4.2 Project Phases (SOW indicates ~13 weeks)
1. **Discovery** (Weeks 1–2)
2. **Design** (Weeks 2–4)
3. **Build/Configuration** (Weeks 4–10)
4. **SIT/UAT Support + Pen Test Remediation** (Weeks 10–12)
5. **Go-Live + Warranty** (Weeks 12–13)

### 4.3 Environments & DevOps
- Support deployments across **DEV → SIT → UAT** per client DevOps standards
- Remediate defects from:
  - functional/integration testing
  - security scanning
  - performance testing (performed by Comenity; remediation in scope)

### 4.4 Testing Strategy
- Unit tests (target: **100% pass** per SOW success criteria)
- Functional testing execution target **99%**, pass **95%**
- Cypress automation with target **80% coverage** for automatable components
- Regression testing for critical business functionality (as defined by Comenity)

## 5. Deliverables (What We Will Produce)
### 5.1 Experience Cloud / Portal
- FinTech Portal with branded theme (per Bread-provided UPP branding guidelines)
- Vanity URL configured (DNS/cert steps coordinated with client)

### 5.2 Onboarding & Governance Functionality
- Compliance stage tracking (Due Diligence → Pre-Launch Testing → First Events Validation)
- Due diligence items with document upload and comments
- Automated testing schedule generation
- Policy change tracking workflow + reporting
- Central hub for policies/training/SOPs/audits and artifacts
- Role-based access control for internal/external users
- Operational dashboards (progress by stage, overdue tasks, completion)

### 5.3 Complaints Case Management (Service Cloud)
- Case record types and intake process
- Routing via queues/assignment rules
- Resolution workflow and reporting

### 5.4 Data Cloud + Analytics
- Snowflake ingestion to Data Cloud (reuse existing connection)
- Calculated insights for loan/application parameter monitoring
- Flow-based alerts and operational tasks
- **1 CRMA dashboard** with **3–4 widgets** for Complaints/Applications/Transactions

### 5.5 Readiness & Handover
- Validation of functionality and any data migrated (note: migration for existing FinTechs is out of scope)
- Knowledge transfer to Comenity Salesforce support team
- Change management and training support (execution support; training material creation is out of scope)

## 6. Roles & Governance (Aligned to SOW)
### 6.1 Aethereus Team
- Salesforce Developers (build, unit test, deploy)
- Systems Analyst (requirements/user stories/acceptance criteria)
- Technical Lead (design oversight, code review)
- Project Manager (delivery tracking, governance)
- Quality Analyst (test cases, SIT/UAT support, automation)

### 6.2 Client Team (Required)
- Application/Platform Owner (platform decisions/escalations)
- Product Owner (business decisions/prioritization)
- Business SMEs (process expertise)
- Program Architect (architecture standards/oversight)
- Client Support Team (production deployment + first events validation)

## 7. Assumptions & Constraints (From SOW + Clarifications)
### Assumptions (SOW)
- Bread provides theme/UX inputs; UPP branding followed
- Okta team available for external authentication setup
- Knowledge segregation uses out-of-box **data categories**
- Licenses provided by Bread (internal + external)
- Stakeholders available for decisions; UAT participation provided
- Signoffs occur within 5 business days
- Cypress Cloud used for test automation
- Existing Snowflake connection reused
- Bread provides 3–4 monitoring parameters during discovery

### Out of Scope (SOW)
- Workfront integration
- AppExchange installation/setup
- Data migration for existing FinTechs
- Security/performance testing execution (but remediation included)
- Additional accessibility requirements beyond Salesforce OOTB (new external functionality WCAG 2.0 AA compliant)
- Changes to existing Bread Pay applications / Bread Platform

## 8. Key Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| External user access model not defined early (FinTech visibility, ownership) | Rework in sharing/security, delays | Run security/sharing model workshop in Discovery; confirm system-of-record per object |
| Okta SSO timeline dependency | Portal go-live risk | Engage Okta team during week 1; validate SSO approach (SAML/OIDC) and test users |
| Data Cloud ingestion scope unclear (objects/volume/cadence) | Under/over build; performance issues | Define Snowflake tables, refresh cadence, and target data model in technical discovery |
| Compliance evidence requirements unclear (retention, audit trails, approvals) | Regulatory gaps | Document evidence standards, retention, and approvals; validate with Compliance SMEs |
| Complaint process/SLAs not defined | Misrouted cases, reporting gaps | Define case record types, routing rules, priority, escalation/milestones |

## 9. Discovery Gaps (Items to Confirm Before Final Design)
These are required to finalize user stories, acceptance criteria, and solution design:
1. **Personas & volumes**: number of FinTechs, external users per FinTech, internal users, expected portal usage.
2. **Onboarding lifecycle**: detailed steps, entry/exit criteria per stage, who approves stage transitions.
3. **Due diligence questionnaire**: structure, categories, item library, scoring, evidence requirements.
4. **Testing schedules**: cadence rules, templates, exceptions, holiday calendars.
5. **Policy change workflow**: who can propose/approve/publish; versioning and audit needs.
6. **Complaints**: intake channels, routing criteria, SLAs, required fields, escalation, reporting.
7. **Data Cloud**: Snowflake source tables, refresh frequency, data mapping, calculated insight formulas.
8. **Alerts**: parameter definitions, thresholds, recipients, action on breach (task/case/email/Slack/etc.).
9. **CRMA dashboard**: exact widget definitions, dataset sources, security model for analytics.
10. **Vanity URL & branding**: desired URL, certificate/DNS ownership, UI components.

## 10. Recommended Discovery Session Plan (for Consultant)
SESSION #1: Executive/Program Vision & Success Criteria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendees: Program Sponsor, Product Owner, Platform Owner, Compliance lead
Duration: 60–90 min
Purpose: Confirm business outcomes, prioritization, and release definition.

MUST-ASK QUESTIONS:
1. What does “successful onboarding and governance” mean (KPIs, cycle time, audit readiness)?
2. What is the required go-live scope for June 2026 vs. future phases?
3. What are the top compliance/regulatory drivers that must be evidenced in Salesforce?

WATCH FOR:
- Competing priorities between portal features vs complaints vs analytics
- Implicit assumption that all FinTechs share same process

EXPECTED OUTPUTS:
- Agreed MVP scope, success metrics, and critical compliance requirements

SESSION #2: Compliance Process Deep Dive (Due Diligence → Prelaunch → First Events)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendees: Compliance SMEs, Risk, Operations, Product Owner, Systems Analyst
Duration: 120 min
Purpose: Define stages, artifacts, and control points.

MUST-ASK QUESTIONS:
1. Walk through the exact process and decision gates for each stage (entry/exit criteria).
2. For each due diligence item: what evidence is required, who provides it, who approves it?
3. What are the exception paths (failed checks, missing docs, rework, waivers)?

WATCH FOR:
- Audit trail and retention requirements not captured
- Need for approvals/attestations and e-signature-like behavior

EXPECTED OUTPUTS:
- Stage model, artifact checklist, exception handling, ownership/RACI

SESSION #3: Portal UX + Access Control / Okta SSO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendees: Portal owner, Security, Okta team, Compliance, representative FinTech user
Duration: 90 min
Purpose: Define authentication, authorization, and portal UX expectations.

MUST-ASK QUESTIONS:
1. Will FinTech users be invited-only or self-register? What identity proofing is required?
2. What should a FinTech user see by default (their records only, cross-team visibility, subsidiaries)?
3. What is the Okta integration pattern (SAML vs OIDC), and what attributes are sent (groups/roles)?

WATCH FOR:
- Sharing model complexity (multiple FinTechs, multiple programs)
- Licensing constraints for external users

EXPECTED OUTPUTS:
- Confirmed access model, SSO approach, portal page inventory, branding inputs

SESSION #4: Complaints Case Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendees: Complaints Ops lead, Service managers, Compliance, Reporting/Analytics
Duration: 90 min
Purpose: Define complaint intake, routing, SLAs, and closure.

MUST-ASK QUESTIONS:
1. What complaint types exist and what data is required at intake?
2. How should cases be routed (queue/skills/priority) and what triggers escalation?
3. What are the closure reasons and required compliance reporting outputs?

WATCH FOR:
- Need for entitlements/milestones vs basic SLAs
- Multi-party involvement (FinTech + Bread) and how communications are captured

EXPECTED OUTPUTS:
- Case record types, routing rules, SLA targets, reporting requirements

SESSION #5: Data Cloud + CRMA Technical/Analytics Workshop
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendees: Data/Integration team, Snowflake owner, Analytics/CRMA developer, Security
Duration: 120 min
Purpose: Confirm ingestion, transformation, insights, and dashboard requirements.

MUST-ASK QUESTIONS:
1. Which Snowflake tables/fields represent Applications/Loans/Transactions; what is the refresh cadence?
2. Define the 3–4 monitoring parameters and the exact breach logic.
3. What actions must occur on breach (create Case/Task, notify who, suppress duplicates)?

WATCH FOR:
- Data volume/latency mismatch with “alerting” expectations
- Dataset security (row-level) for CRMA vs portal visibility

EXPECTED OUTPUTS:
- Source-to-target mapping, insight formulas, alert flows, CRMA widget definitions

## 11. Commercials & Schedule
Commercial terms and invoicing milestones are governed by the SOW and the master services agreement. The SOW indicates milestone-based invoicing (Program Start, Development Completion, Go-live, Warranty Support). Final fixed price amounts are listed as “$xxx” and must be completed by contracting.

## 12. Next Steps
1. Confirm discovery session attendees and schedule (Weeks 1–2).
2. Produce backlog of prioritized user stories + acceptance criteria.
3. Validate security/sharing and SSO design early.
4. Finalize sprint calendar and release plan.
5. Proceed into build and iterative demos each sprint.
