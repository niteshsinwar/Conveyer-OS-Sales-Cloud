# Proposal: Salesforce Sponsor Bank Collaboration Platform (Comenity / Bread Financial)

**Prepared for:** Comenity Servicing LLC (Bread Financial)  
**Prepared by:** Aethereus  
**Source Document:** Aethereus Salesforce Development for Sponsor Bank – SOW Effective Mar 16, 2025 (Draft)  
**Term:** 3 months (execution calendar indicates Mar–Jun 2026 milestones; dates to be confirmed)  

---

## 1. Executive Summary
Bread Financial serves as Sponsor Bank for multiple FinTech partners and requires a secure, auditable collaboration platform to manage **onboarding, governance, and regulatory compliance** across the partner lifecycle.

Aethereus proposes implementing a Salesforce-based solution that provides:
- An **Experience Cloud** portal for external FinTech users to submit due diligence artifacts, track pre-launch testing, and collaborate with Bread teams.
- **Service Cloud** case management for complaints intake, routing, SLA tracking, and resolution.
- **Salesforce Data Cloud** ingestion from **Snowflake** for application/loan monitoring, calculated insights, and alerting via automation.
- **CRM Analytics (CRMA)** dashboarding for complaints, applications, and transaction monitoring.

This solution will centralize policies, training/enablement, SOPs, audits, and evidence, while enforcing least-privilege access for internal and external users.

---

## 2. Proposed Salesforce Products & Capabilities (Mapped to SOW)

### 2.1 Experience Cloud (FinTech Portal / Collaboration)
**SOW needs:** onboarding + governance platform, document upload/comments, policy hub, access control, vanity URL.

**Proposed capabilities:**
- Experience Cloud site (Partner-style portal) with authenticated external users.
- Document management using **Salesforce Files** linked to compliance items (questionnaire responses, audit artifacts).
- Collaboration via comments/Chatter feed (if permitted) or custom comment objects.
- Knowledge/Content organization for policies, SOPs, training materials (using Knowledge and/or CMS/Files depending on licensing).
- **Custom Domain / Vanity URL** for portal branding.
- Role/permission-set based access control; sharing model to ensure FinTech users only see their own records.

### 2.2 Service Cloud (Complaints Management)
**SOW needs:** creation of complaint cases, routing, resolution workflow.

**Proposed capabilities:**
- Case management with record types for Complaint vs other case categories.
- Routing using Queues and/or Omni-Channel (if licensed/desired).
- Escalation rules, milestones/entitlements (if SLA tracking is required).
- Email-to-Case or Experience Cloud case submission (channel TBD).

### 2.3 Data Cloud + Snowflake Ingestion (Application Monitoring)
**SOW needs:** ingest Snowflake data into Data Cloud, calculated insights, flows to trigger alerts for applications/loans outside parameters.

**Proposed capabilities:**
- Data Cloud connection to Snowflake (reuse existing connection per SOW).
- Data Model Objects for Applications/Loans and related entities.
- Calculated Insights for threshold monitoring.
- Data Cloud-triggered automation (Flow / alerts) to notify appropriate teams when thresholds are breached.

### 2.4 CRM Analytics (CRMA)
**SOW needs:** 1 CRMA dashboard with 3–4 widgets for Complaints, Applications, Transactions.

**Proposed capabilities:**
- Single executive dashboard with agreed KPIs, filters (FinTech, stage, timeframe), and drilldowns.
- Dataset strategy aligned to Salesforce + Data Cloud sources.

### 2.5 DevOps, Testing & Quality
**SOW needs:** 2-week sprints, client toolchain, Cypress automation, unit tests, SIT/UAT support, remediation.

**Proposed approach:**
- Source control + CI/CD aligned to Bread standards.
- Automated test scripts using Cypress Cloud for suitable UI journeys.
- Quality gates: 100% unit test pass; functional execution and pass targets per SOW.

---

## 3. Scope of Work (Aligned to SOW Deliverables)

### 3.1 Discovery (Weeks 1–2)
- Validate detailed requirements for:
  - Due diligence questionnaire structure, stages, evidence requirements.
  - Pre-launch testing + first events validation process and scheduling.
  - Policy change workflow, reporting, audit trail needs.
  - Complaints intake channels, routing rules, SLAs.
  - Data Cloud data elements, refresh frequency, parameters for alerts.
- Confirm non-functional requirements: WCAG 2.0 AA, security, auditability, environment strategy.

### 3.2 Solution Design (Weeks 2–4)
- Portal information architecture and UX aligned to UPP branding.
- Object model design (questionnaire, items, responses, testing schedules, policy changes, audits).
- Security model for internal/external separation.
- Data Cloud logical model + calculated insights design.
- Reporting/CRMA wireframes.

### 3.3 Build & Configure (Weeks 4–10)
**Experience Cloud**
- Portal build: onboarding/governance workspace per FinTech.
- Document upload and association to specific questionnaire/testing items.
- Task tracking and dashboards (progress, overdue items, completion).
- Vanity URL setup (DNS + Salesforce domain config).

**Governance & Compliance Tracking**
- Stage tracking: Due Diligence → Pre-Launch Testing → First Events Validation.
- Automated schedule creation for compliance monitoring/testing.
- Policy change workflow with reporting (who changed what, when, and approval status).

**Service Cloud Complaints**
- Complaint Case record type(s), intake, assignment/routing, resolution workflow.
- Status model and notifications.

**Data Cloud + Alerts**
- Snowflake ingestion setup/verification.
- Calculated Insights for out-of-parameter identification.
- Alert automation via Flow/notifications (recipients + channels TBD).

**CRMA Dashboard**
- One dashboard with 3–4 agreed widgets across complaints/applications/transactions.

### 3.4 Testing (Throughout; formal SIT/UAT Weeks 10–12)
- Unit testing and code reviews.
- SIT support and defect remediation.
- UAT support and defect remediation.
- Cypress automation suite creation/maintenance for automatable critical paths.

### 3.5 Deployment & Go-Live (Week 12)
- Deployment to lower environments (DEV/SIT/UAT) and production deployment via Client Support Team per SOW.
- Go-live readiness checklist and cutover support.

### 3.6 Warranty (Post Go-Live)
- Warranty support through Jun 12, 2026 milestone (per SOW).

---

## 4. Assumptions / Constraints (From SOW)
- Bread provides licenses for internal/external users.
- Okta team supports authentication setup for external users.
- UX branding guidelines (UPP) provided by Bread.
- Workfront integration out of scope.
- No AppExchange product installation.
- No data migration for existing FinTechs (beyond what is explicitly required for Data Cloud ingestion).
- Security/performance testing executed by Comenity; Aethereus remediates findings.
- WCAG 2.0 AA compliance for newly developed external functionality (testing beyond SF certification is out of scope).

---

## 5. Key Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| External user access model not finalized early (FinTech-to-record mapping, data segregation) | Rework/security risk | Confirm identity model + sharing design in discovery; prototype access early |
| Okta SSO dependencies | Portal timeline risk | Schedule Okta technical workshop in Week 1; define SAML/OIDC approach |
| Data Cloud alert parameters not provided | Delays calculated insights/flows | Require parameter definition as discovery deliverable; confirm edge cases |
| Content/policy governance unclear (approvals, versioning) | Audit gaps | Define policy lifecycle, approvals, and retention rules |
| UAT availability | Go-live delay | Secure UAT calendar and named testers during discovery |

---

## 6. Delivery Approach & Governance
- Agile delivery: 2-week sprints (10 business days), planning Day 1, review/retro Day 10.
- Monthly operational review meetings.
- Performance metrics: velocity, commitment vs actual, estimation accuracy, code quality, defect metrics.
- Change control per Exhibit 1 for scope/timeline/resource/tooling changes.

---

## 7. Proposed Discovery Session Plan (For Consultant to Run)

SESSION #1: Executive Vision + Compliance Outcomes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Product Owner, Application/Platform Owner, Compliance Lead, Program Architect  
**Duration:** 60–90 min  
**Purpose:** Confirm success criteria, compliance stages, audit expectations, and release priorities.

**MUST-ASK QUESTIONS:**
1. What are the exact stage gates and exit criteria for Due Diligence, Pre-Launch Testing, First Events Validation?
2. What evidence must be collected for each stage (documents, attestations, test results)?
3. What are the KPIs for “fintech progress”, overdue tasks, and compliance health?

**WATCH FOR:**
- Regulatory audit retention requirements, approval needs, and evidentiary standards.

**EXPECTED OUTPUTS:**
- Agreed lifecycle, KPIs, and prioritized MVP scope.

SESSION #2: Portal UX + Content/Document Management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Business SME(s), Portal Product Owner, Compliance Ops, UX/Brand rep  
**Duration:** 90 min  
**Purpose:** Define portal navigation, questionnaire structure, document upload rules, and collaboration.

**MUST-ASK QUESTIONS:**
1. How is the due diligence questionnaire structured (sections, questions, required/optional, scoring)?
2. For each question/item, what file types, max sizes, and versioning rules apply?
3. Should comments be internal-only, external-only, or shared? Any moderation/approval?

**WATCH FOR:**
- PHI/PII handling, external sharing restrictions, and retention.

**EXPECTED OUTPUTS:**
- Wireframe outline and content model.

SESSION #3: Complaints Case Management Deep Dive
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Complaints Ops Lead, Service Manager, Compliance, Reporting/Analytics  
**Duration:** 60–90 min  
**Purpose:** Define case intake channels, routing, SLAs, and closure requirements.

**MUST-ASK QUESTIONS:**
1. What are complaint categories, severity levels, and required data points?
2. How should routing work (queue by type, FinTech, severity, geography)?
3. What SLAs/milestones and escalation rules apply?

**WATCH FOR:**
- Regulatory reporting and acknowledgement templates.

**EXPECTED OUTPUTS:**
- Case process map, routing rules, and reporting needs.

SESSION #4: Data Cloud + Snowflake + Alerting Technical Workshop
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Data Cloud admin, Snowflake owner, Integration architect, Security, Business owner for thresholds  
**Duration:** 90 min  
**Purpose:** Finalize ingestion, data mapping, refresh cadence, calculated insights, and alerting.

**MUST-ASK QUESTIONS:**
1. Which Snowflake tables/views are in scope and what is the refresh frequency/latency requirement?
2. What are the 3–4 parameters and thresholds for “outside agreed parameters”? What are edge cases?
3. Where do alerts go (email, Slack, Salesforce task/case) and who owns follow-up?

**WATCH FOR:**
- Identity resolution/matching strategy and consent constraints.

**EXPECTED OUTPUTS:**
- Data mapping spec and alert decision table.

SESSION #5: Security / Access Control + Okta SSO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Attendees:** Security team, Okta team, Salesforce architect, Portal admin  
**Duration:** 60–90 min  
**Purpose:** Confirm authentication, user provisioning, and data segregation model.

**MUST-ASK QUESTIONS:**
1. Will external users be invited, self-registered, or auto-provisioned from Okta?
2. Do FinTechs require multiple roles (admin vs contributor vs read-only)?
3. Any IP allowlisting, MFA, session timeout, or data export restrictions?

**WATCH FOR:**
- Complexity around multiple FinTech identity providers and delegated administration needs.

**EXPECTED OUTPUTS:**
- Final auth and authorization approach.

---

## 8. Commercials & Milestones (Per SOW)
**Fixed price:** $XXX (excluding taxes) – invoiced upon milestone acceptance.

| Milestone | Description | Target Date (SOW) |
|---|---|---|
| Program Start | Kickoff | 16 Mar 2026 |
| Development Completion | Completion of Development | 22 May 2026 |
| Go-live | Portal Go-live | 05 Jun 2026 |
| Warranty Support | Completion of Warranty | 12 Jun 2026 |

> **Note:** SOW header indicates effective date Mar 16, 2025 and 3-month term; milestone dates indicate 2026. Confirm contracting dates during kickoff.

---

## 9. Items Requiring Clarification (To Finalize Proposal)
1. Target Salesforce org(s): “Bread Pay ORG” only, or separate Experience Cloud site/org for sponsor banking?
2. External user license model (Partner Community vs Customer Community etc.) and expected user volumes.
3. Data volumes for Snowflake ingestion and retention period.
4. Do we need Knowledge, CMS, or simple Files library for policy/training hub?
5. Complaint intake channels (portal form, email, phone integration, API) and any required acknowledgement templates.

---

## Appendix A: Salesforce Feature Mapping (High-Level)
- **Compliance stages & tracking:** Custom objects + Path + Flows + Reports/Dashboards
- **Due diligence questionnaire:** Custom questionnaire/response objects + Files + validation rules
- **Testing schedules:** Scheduled flows / automation + task generation
- **Policy change tracking:** Versioning fields, approval process/Flow, audit trail reporting
- **Access control:** Profiles/Permission Sets, Sharing Sets, Account/Contact relationships, role-based sharing
- **Dashboards:** Standard reports + CRMA dashboard
- **Complaints:** Case management with routing/escalations
- **Data Cloud alerts:** Calculated Insights + data-triggered automation
