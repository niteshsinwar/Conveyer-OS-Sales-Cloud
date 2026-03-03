# Sponsor Bank Collaboration Platform (Salesforce) — Proposal + Discovery Pack

**Client:** Comenity Servicing LLC (Bread Financial)  
**Provider:** Aethereus  
**Source Document:** `aethereus_sow.md` (Draft SOW)  
**SOW Term:** 3 months (SOW indicates effective date Mar 16, 2025 and milestone dates in Mar–Jun 2026 — **date alignment needed**)  

---

## 1) Executive Summary
Bread Financial acts as the **Sponsor Bank** for multiple FinTech partners. The SOW describes the need to implement a secure collaboration platform to support:
- **FinTech onboarding** and ongoing **governance**
- Collection of due diligence evidence and ongoing **audit-ready compliance**
- Tracking compliance stages: **Due Diligence → Pre‑Launch Testing → First Events Validation**
- A structured way to manage **policy changes**, **complaints handling**, and executive reporting
- Data ingestion from **Snowflake → Salesforce Data Cloud**, with rules/thresholds that trigger alerts when loans/applications fall outside agreed parameters

This proposal outlines an implementation approach using Salesforce capabilities (portal for external users, internal work management, analytics, and data ingestion), plus a discovery plan, gaps, and assumptions needed to finalize scope.

---

## 2) What’s in the SOW (Confirmed Scope)
### 2.1 In-Scope Functional Outcomes (Business Language)
From the SOW, the platform must enable:
1. **Onboarding & governance workspace** for Bread + FinTechs to collaborate.
2. **Compliance stage tracking** across:
   - Due diligence
   - Pre-launch testing
   - First events validation
3. **Due diligence questionnaire management** including:
   - Item-by-item evidence collection
   - Document uploads
   - Comments/notes per questionnaire item
4. **Pre-launch testing & first events validation tracking** including automatic creation of **testing schedules**.
5. **Policy change workflow**: track and report on changes made to policies.
6. **Central content hub** for policies, SOPs, training/enablement, audits, and due diligence artifacts.
7. **Access control**: internal/external users see only information relevant to them.
8. **Dashboards** showing:
   - FinTech progress by stage
   - Overdue tasks
   - Task completion reporting
9. **Complaints management**:
   - Create complaints
   - Route them
   - Track resolution workflow
10. **Analytics dashboard (CRMA/CRM Analytics)** with 3–4 widgets for review of:
   - Complaints
   - Applications
   - Transactions
11. **Data Cloud**:
   - Ingest application information from Snowflake (reuse existing connection)
   - Create calculated insights
   - Trigger alerts for loans/applications that fall outside agreed parameters
12. Testing & readiness:
   - Validate functionality and data migrated
   - Create test automation scripts (Cypress; Cypress Cloud)
13. Change enablement:
   - Support change management and training (note: training material creation is out of scope)
14. Portal and deployment:
   - Vanity URL for the FinTech portal
   - Deploy changes to Bread Pay org

### 2.2 In-Scope Delivery Activities (Delivery/Engineering)
Includes user stories, configuration + code, unit testing, deployments through DEV/SIT/UAT, DevOps practices, manual and automated testing, SIT/UAT support, defect remediation, knowledge transfer.

### 2.3 Out of Scope (Key)
- Training material development
- Accessibility testing and additional accessibility requirements beyond WCAG 2.0 AA (but new external functionality must be WCAG 2.0 AA)
- Security and performance testing execution (remediation is in scope)
- Workfront integration
- AppExchange product installs
- Data migration for existing FinTechs (explicitly not considered)
- Changes to Bread Platform; changes to existing Bread Pay apps

### 2.4 Assumptions (Key)
- Bread provides UX/branding guidelines
- Okta team supports authentication setup for external users
- Licenses provided by Bread
- Business stakeholders available for decisions and UAT
- Signoffs within 5 business days
- Existing Snowflake connection reused; Bread provides 3–4 alert parameters during discovery

---

## 3) Recommended Salesforce-Based Solution (Proposed)
Below is a **proposed** solution architecture consistent with the SOW (final design depends on discovery).

### 3.1 External Collaboration Portal (for FinTech users)
**Purpose:** secure collaboration for evidence submission, status visibility, tasks, and communications.

Proposed capabilities:
- FinTech users log in and see only their organization’s records (segregation by FinTech)
- Submit due diligence questionnaire responses
- Upload supporting documents and add comments
- View outstanding tasks, testing schedules, and completion status
- Access shared policies, SOPs, training/enablement content, and audit artifacts based on permissions
- Vanity URL and branded experience per Bread guidelines

Key design consideration: record-level segregation must support many FinTechs and strict need-to-know access.

### 3.2 Internal Work Management (for Bread teams)
**Purpose:** manage onboarding, compliance, and governance work across multiple FinTechs.

Proposed capabilities:
- Standardized compliance stages and checklists
- Task generation for testing schedules and recurring monitoring
- Policy change intake, review, approval, and reporting
- Operational dashboards for overdue items and progress

### 3.3 Complaints Intake, Routing, and Resolution
**Purpose:** consistent complaint handling with audit trail.

Proposed capabilities:
- Complaint capture (internal creation and/or external submission if needed)
- Routing rules (by complaint type, FinTech, priority, product)
- Standard statuses and SLAs (if applicable)
- Notes, attachments, and resolution documentation

### 3.4 Analytics (CRM Analytics / CRMA) Dashboard
SOW calls for **1 dashboard** with **3–4 widgets**.

Proposed widget examples (to validate):
- Complaints trend by FinTech / type / severity
- Application volume and exception rate
- Transactions volume and exception rate
- Aging / backlog (open complaints, overdue tasks)

### 3.5 Data Cloud + Snowflake Ingestion + Alerts
**Goal:** bring application data into Salesforce, compute metrics, and trigger alerts when thresholds are violated.

Proposed approach:
- Use existing Snowflake connectivity to ingest relevant application/loan data into Data Cloud
- Define “agreed parameters” (3–4 thresholds) with Bread (e.g., APR cap, loan amount band, approval rate, fraud score threshold)
- Build calculated insights and alerting logic; trigger notifications/work items to responsible teams

**Note:** We attempted web research for official docs, but the internet search tool is unavailable in this environment. We will rely on Salesforce knowledge base + your org’s standards, and we can incorporate official documentation links once web search is available.

---

## 4) Delivery Approach (Aligned to SOW)
### 4.1 Phased Plan (13-week view from SOW)
- **Weeks 1–2: Discovery + Sprint Calendar finalization**
- **Weeks 3–4: Solution Design** (process + data + security + integration designs)
- **Weeks 5–10: Build (2-week sprints)**
- **Weeks 11–12: UAT + Pen Test support/remediation**
- **Week 13: Warranty support**

### 4.2 Sprint Rhythm (per SOW)
- 2-week sprints (up to 10 business days)
- Day 1: sprint planning
- Day 10: review + retro

### 4.3 Quality & Acceptance Targets (per SOW)
- 100% unit test pass
- 99% functional tests executed
- 95% functional test pass
- 80% automation coverage for automatable components
- No open critical/high defects at UAT completion

---

## 5) Discovery Outputs (What We Will Produce)
At the end of discovery, we will deliver:
1. **Process maps** for onboarding, due diligence, testing schedules, first events validation, policy change, and complaints handling
2. **Backlog**: user stories with acceptance criteria
3. **Data requirements**: what information must be captured per FinTech, per questionnaire item, per complaint, per policy change
4. **Security model**: which users see which data; internal roles vs FinTech roles
5. **Integration & data flow definition**: what comes from Snowflake, refresh frequency, and what alerts/actions are required
6. **Analytics definition**: dashboard widgets, filters, and audience
7. **Testing strategy**: what is automated vs manual, and environments plan

---

## 6) Gaps & Assumptions (What We Still Need to Confirm)
The SOW describes outcomes but leaves critical details open. Below are the key gaps to close during discovery.

| Area | Gap / Question | Why it matters | Proposed discovery output |
|---|---|---|---|
| Users | Who are the main user groups (Bread roles + FinTech roles)? How many users? | Licensing, security, training impact | Persona list + user counts |
| FinTech structure | How is a FinTech represented (one company, multiple programs, multiple subsidiaries)? | Data model + access segregation | FinTech hierarchy model |
| Due diligence questionnaire | What is the questionnaire structure (sections, questions, scoring)? Is it standard across all FinTechs? | Data capture + UX + reporting | Questionnaire template + response model |
| Evidence & documents | What document types, size limits, retention rules, and review/approval steps are required? | Storage, compliance, audit | Document handling rules |
| Testing schedules | What “automatic schedule” rules are required (frequency, triggers, owners)? | Automation scope + workload | Schedule rules catalog |
| Policy change workflow | Who can propose/approve changes? What approvals are required? | Governance and audit | Approval + audit trail design |
| Complaints | What is a “complaint” definition? Required fields? SLA targets? escalation steps? | Routing & reporting | Complaint taxonomy + SLA rules |
| Data Cloud alerts | What are the 3–4 parameters? What action occurs on breach? Who gets notified? | Alert design & value | Alert thresholds + notification matrix |
| Snowflake data | What tables/fields are needed, refresh frequency, and data quality issues? | Integration reliability | Data mapping + refresh schedule |
| Analytics | Who consumes the CRMA dashboard? What filters? What is “good/bad” threshold? | Dashboard usefulness | Final widget list + mockups |
| Date plan | SOW dates conflict (effective date 2025; invoice milestones 2026; 3-month term) | Schedule and resourcing | Confirmed baseline plan |

---

## 7) Discovery Session Plan (Proposed)
Designed to close the gaps quickly and align stakeholders.

### Session 1 — Vision, Scope & Success Measures (60–90 mins)
**Participants:** Product Owner, Application/Platform Owner, Sponsor Bank program leads, Aethereus PM/BA/Tech Lead  
**Topics:** goals, in-scope/out-of-scope, timeline alignment, definition of “done”, KPIs, signoff process  
**Outputs:** confirmed timeline; success metrics; decision log

### Session 2 — Onboarding + Due Diligence Process Deep Dive (90 mins)
**Participants:** Business SMEs (onboarding/compliance), BA, Tech Lead  
**Topics:** due diligence stages, questionnaire structure, evidence collection, comments, reviews, audit trail  
**Outputs:** process steps; questionnaire model; required fields; exception scenarios

### Session 3 — Testing Schedules + First Events Validation (60–90 mins)
**Participants:** Testing/validation SMEs, compliance operations, BA  
**Topics:** schedule generation rules, triggers, owners, reminders, reporting, exceptions  
**Outputs:** schedule rules; task templates; escalation rules

### Session 4 — Complaints Handling + Routing (60–90 mins)
**Participants:** Complaints team SMEs, service manager, BA  
**Topics:** complaint intake sources, categories, routing rules, SLAs, resolution steps, reporting  
**Outputs:** complaint taxonomy; routing matrix; SLA targets; edge cases

### Session 5 — Data & Analytics (Snowflake → Data Cloud → Dashboard) (90 mins)
**Participants:** Data/Snowflake owner, analytics stakeholder, architect, BA, Tech Lead  
**Topics:** source fields, refresh frequency, data quality, 3–4 alert parameters, dashboard widget definitions  
**Outputs:** data mapping; alert matrix; dashboard requirements

### Session 6 — Security, Access & External Login (Okta) (60 mins)
**Participants:** Security/Okta team, platform owner, architect, BA, Tech Lead  
**Topics:** who gets access, segregation model, login journey, user lifecycle (invite/disable), audit requirements  
**Outputs:** access model; authentication approach; user provisioning steps

---

## 8) Risks / Watch Items
- **Timeline/date inconsistency** in SOW requires immediate confirmation.
- **External user access segregation** across many FinTechs is a high-risk area if requirements are unclear.
- **Document management** (retention, legal hold, review/approval) can expand scope quickly.
- **Data Cloud alerting** depends on Snowflake data quality and refresh latency.
- **Training**: materials are out of scope, but adoption requires a plan for enablement.

---

## 9) Next Steps
1. Confirm timeline baseline (SOW term + milestone dates)
2. Run discovery sessions (above)
3. Finalize user stories + acceptance criteria + backlog
4. Start sprint build with agreed sprint calendar

