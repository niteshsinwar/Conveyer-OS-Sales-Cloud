# Sponsor Bank Collaboration Platform (Salesforce) — Proposal + Discovery Pack (Refined)

**Client:** Comenity Servicing LLC (Bread Financial)  
**Provider:** Aethereus  
**Primary Source Document Reviewed:** `aethereus_sow.md` (Draft SOW)  

---

## 0) Verification & Validation Summary (What I checked and what changed)
### 0.1 What I re-read
- ✅ `aethereus_sow.md` (Pages 1–9)
- ✅ Output: `Sponsor_Bank_Proposal_Discovery_Pack.md` (this document)
- ✅ Output: `Proposal_Discovery_SessionPlan_Gaps.md`

### 0.2 Key corrections made in this refinement
1. **Removed/Corrected an inaccurate statement**: the prior version said “internet search tool is unavailable”. In this environment, web search is partially available (though intermittent). The proposal now avoids that claim.
2. **Anchored every “confirmed scope” item back to SOW bullets** and separated *SOW-confirmed* vs *discovery-dependent proposals* more clearly.
3. **Hardened the timeline risk**: the SOW has a 3‑month term but milestone dates in 2026 (plus effective date in 2025). This is now explicitly highlighted as a “must-resolve” contractual planning issue.
4. **Clarified training scope**: “Support Change Management and Training” is in scope, but “Development of training material” is out of scope—this is now called out to avoid future dispute.
5. **Added specific portal document-upload considerations** (authentication, attach-to-record behavior, file limits) so the design is audit-ready.

### 0.3 Open items that cannot be “validated” from the SOW alone
- Exact user counts, number of FinTechs, number of questionnaire items, record volumes
- The exact definition of “complaint” for this program and whether FinTechs submit complaints
- The 3–4 alert parameters and required response actions
- Snowflake table/field list, refresh frequency, and data quality expectations

---

## 1) Executive Summary
Bread Financial acts as the **Sponsor Bank** for multiple FinTech partners. The SOW describes the need for a secure collaboration platform to support:
- FinTech onboarding and ongoing governance
- Collection of due diligence evidence and ongoing audit-ready compliance
- Tracking compliance stages: **Due Diligence → Pre‑Launch Testing → First Events Validation**
- Managing policy changes, complaints handling, and executive reporting
- Ingesting application data from **Snowflake → Data Cloud**, computing metrics, and triggering alerts when loans/applications fall outside agreed parameters

This pack outlines a Salesforce-based approach consistent with the SOW, plus the discovery plan required to convert the SOW bullets into testable requirements.

---

## 2) What’s in the SOW (Confirmed Scope)
> Everything in this section is directly supported by bullets in `aethereus_sow.md`.

### 2.1 In-Scope Functional Outcomes (Business Language)
The platform must enable:
1. **Onboarding & governance workspace** for Bread + FinTechs to collaborate and govern compliance.
2. **Compliance stage tracking** across Due Diligence, Pre‑Launch Testing, First Events Validation.
3. **Due diligence questionnaire support** including document uploads and comments per questionnaire item.
4. **Pre‑launch testing & First Events Validation tracking.**
5. **Automatically create testing schedules** for compliance monitoring.
6. **Policy change workflow**: track and report changes made to policies.
7. **Central hub** for policies, SOPs, training/enablement content, audits, due diligence artifacts.
8. **Access control**: internal/external users only see information relevant to them.
9. **Dashboards**: progress by stage, overdue tasks, task completion reporting.
10. **Complaints handling**: create complaints, route, and manage resolution workflow.
11. **CRM Analytics (CRMA) dashboard**: 1 dashboard with 3–4 widgets for Complaints, Applications, Transactions.
12. **Data Cloud ingestion**: ingest application information from Snowflake.
13. **Calculated metrics + alerting**: calculated insights and automated alerts for out-of-parameter loans/applications.
14. **Testing/Readiness**: validation of functionality and data migrated; creation of test automation scripts.
15. **Portal readiness**: vanity URL for FinTech portal.
16. **Deployment**: deploy changes to Bread Pay org.
17. **Change enablement**: support change management and training (with the constraint below).

### 2.2 Delivery/Engineering Activities (from SOW)
Includes user stories, configuration + code, unit testing, deployments through DEV/SIT/UAT, DevOps practices, manual and automated testing, SIT/UAT support, defect remediation, and knowledge transfer.

### 2.3 Important Scope Boundaries (from SOW)
**Out of scope (selected high-risk):**
- Building training materials (even though change mgmt/training support is in scope)
- Security and performance testing execution (but remediation is in scope)
- Workfront integration
- AppExchange installs
- Data migration for existing FinTechs (explicitly not considered)
- Changes to Bread Platform and changes to existing Bread Pay applications

**Accessibility:** new external functionality must be WCAG 2.0 AA compliant; additional accessibility requirements/testing beyond Salesforce standard is out of scope.

---

## 3) Proposed Solution Approach (Requires Discovery Confirmation)
> This section proposes *how* the SOW outcomes could be implemented. Final decisions depend on discovery and Bread platform standards.

### 3.1 External Collaboration Portal (FinTech users)
**Goal:** allow FinTech partners to collaborate, submit evidence, and see status.

Proposed portal outcomes:
- FinTech users log in and see only their organization’s information (strict segregation)
- Complete due diligence items, upload evidence, and add comments
- View tasks/testing schedules and completion status
- Access policies/SOPs/training/audit artifacts based on permissions
- Vanity URL and branding per Bread guidelines

**Document upload—validated platform behaviors (design implications):**
- Salesforce supports file uploads in portals and attaching files to specific records.
- File size and simultaneous upload limits exist (to be confirmed against Bread org settings/policies).
- **Recommendation for a regulated onboarding context:** require authenticated user access for evidence uploads (avoid anonymous uploads).

### 3.2 Internal Work Management (Bread teams)
- Standard stages and checklists for onboarding/compliance
- Automatic task creation for testing schedules and recurring monitoring
- Policy change intake, review/approval, and reporting (approval steps TBD)
- Operational dashboards for progress, overdue items, completion rates

### 3.3 Complaints Intake, Routing, and Resolution
Proposed capabilities:
- Complaint capture (internal creation; external submission TBD)
- Routing by complaint type, FinTech, priority
- Standard statuses and audit trail
- Optional SLA tracking (business hours/targets TBD)

### 3.4 Analytics (CRMA)
SOW requires **1 dashboard** with **3–4 widgets**.

Proposed widget candidates (validate):
- Complaints trend by FinTech/type/severity
- Applications volume + exception rate
- Transactions volume + exception rate
- Aging/backlog (open complaints, overdue compliance tasks)

### 3.5 Data Cloud + Snowflake + Alerts
- Reuse existing Snowflake connection (per SOW assumption)
- Ingest application data into Data Cloud
- Define 3–4 “agreed parameters” during discovery
- Compute metrics and trigger alerts (who is notified, and what action occurs must be defined)

---

## 4) Delivery Approach (Aligned to SOW)
### 4.1 13-week view shown in SOW (to be baselined)
- W1–W2: Discovery + sprint calendar
- W3–W4: Design
- W5–W10: Development
- W11–W12: UAT / Pen Test support
- W13: Warranty

### 4.2 Sprint rhythm
- 2-week sprints (up to 10 business days, adjusted for holidays)
- Day 1 planning; Day 10 review + retro

### 4.3 Quality & acceptance targets (SOW)
- 100% unit test pass
- 99% functional test execution
- 95% functional test pass
- 80% automation coverage for automatable components
- No critical/high defects open at completion of UAT

---

## 5) Discovery Outputs (What we will produce)
1. Process maps for: onboarding, due diligence, testing schedules, first events validation, policy change, complaints
2. Backlog: user stories + acceptance criteria
3. Data requirements: what must be captured for questionnaire items, complaints, policy changes
4. Security model: who sees what (internal vs each FinTech)
5. Integration/data flow: Snowflake scope, refresh frequency, and error handling expectations
6. Analytics definition: 3–4 widgets, filters, audience, and definitions of “in/out of parameter”
7. Testing strategy: what is automated vs manual, environments and readiness gates

---

## 6) Gaps & Assumptions (Must close in discovery)
| Area | Gap / question | Why it matters | Discovery output |
|---|---|---|---|
| Users | Who are the user groups (Bread + FinTech) and counts? | licensing/security/training | personas + counts |
| FinTech structure | how many FinTechs and how are they structured? | segregation model | hierarchy model |
| Questionnaire | structure, scoring, standard vs per‑FinTech | UX/reporting | template + response model |
| Evidence/docs | types, retention, review/approval | audit/compliance | doc handling rules |
| Testing schedules | rules, cadence, triggers, owners | automation scope | schedule rules catalog |
| Policy change | propose/approve steps | governance | approval + audit trail |
| Complaints | definition, categories, SLAs, escalation | routing/reporting | taxonomy + SLA targets |
| Alerts | 3–4 parameters + response actions | value/ownership | thresholds + notification matrix |
| Snowflake | tables/fields, refresh, data quality | reliability | data mapping |
| Analytics | widget definitions & audience | usefulness | final widget list + mockups |
| Dates | effective date/term vs 2026 milestones | baseline plan | confirmed timeline |

---

## 7) Proposed Discovery Sessions
(Kept aligned to the separate session plan document; see `Proposal_Discovery_SessionPlan_Gaps.md`.)

---

## 8) Risks / Watch Items (Validated against SOW language)
1. **Timeline/date inconsistency:** SOW says effective date Mar 16, 2025; term 3 months; but invoicing milestones and end date are in 2026.
2. **External data segregation:** strict “see only what’s relevant” requirement needs explicit rules.
3. **Document management scope creep:** retention/legal hold/review/approval can expand quickly.
4. **Data Cloud alerting dependency:** depends on Snowflake refresh latency and data quality.
5. **Training ambiguity:** enablement support is in-scope but training material development is out-of-scope—must define what “support” means.

---

## 9) Immediate Next Steps
1. Confirm timeline baseline (resolve SOW date conflicts)
2. Confirm portal login approach for FinTech users (authenticated vs other)
3. Run discovery sessions; produce backlog + acceptance criteria
4. Finalize sprint calendar and begin build
