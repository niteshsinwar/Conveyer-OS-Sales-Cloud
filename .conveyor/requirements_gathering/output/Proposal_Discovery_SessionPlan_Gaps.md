# Discovery Session Plan + Gaps (Sponsor Bank Collaboration Platform)

**Source:** `aethereus_sow.md`  
**Purpose:** Close key unknowns so build sprints can start with clear, testable requirements.

---

## A) Gap Analysis Score (Pre‑BRD)
Current information completeness against standard requirements checklist:

| Checklist Area | Status | Notes |
|---|---:|---|
| User Roles & Personas | ❌ | Not specified (internal vs external roles only implied) |
| Detailed Process Steps | ❌ | High-level outcomes listed, steps not defined |
| Data Fields & Attributes | ❌ | Fields not defined for questionnaire, complaints, policy changes |
| Integration Data Flow | ⚠️ | Snowflake → Data Cloud mentioned, but payload/frequency/error handling unknown |
| Success Metrics & KPIs | ⚠️ | Quality targets listed; business KPIs not defined |
| Volume & Scale | ❌ | #FinTechs, #users, #questionnaire items, file sizes, record volumes unknown |
| Exception Handling | ❌ | Error/edge cases not defined |
| Current State (As‑Is) | ❌ | Current tools/process not documented |

**Gap score today:** 0/8 (needs 6/8 before BRD can be finalized).

---

## B) Key Gaps to Resolve (Prioritized)
1. **Who uses the portal and internal workspace?** (roles + counts)
2. **How onboarding and due diligence works today** (systems, spreadsheets, email, ticketing tools)
3. **Due diligence questionnaire structure** and evidence review rules
4. **Testing schedule automation rules** and cadence
5. **Complaints process** (intake, routing rules, SLAs, reporting needs)
6. **Policy change governance** (approvals, audit requirements)
7. **Snowflake data scope** (fields, refresh frequency, data quality, ownership)
8. **Alert thresholds** (3–4 parameters) and required response actions
9. **Analytics dashboard definition** (widgets, filters, audience)
10. **Timeline alignment** (SOW dates mismatch)

---

## C) Proposed Discovery Sessions (6 sessions)

### 1) Vision, Scope & Success Measures (60–90 mins)
**Participants:** Product Owner, Application/Platform Owner, Sponsor program lead, Aethereus PM/BA/Tech Lead  
**Agenda:** goals; scope confirmation; timeline; approval/signoff; definition of success  
**Outputs:** success KPIs; confirmed schedule; decision log

### 2) Onboarding + Due Diligence Deep Dive (90 mins)
**Participants:** Onboarding SME, Compliance SME, BA, Tech Lead  
**Agenda:** stages; questionnaire; evidence capture; review/approval; audit trail; external collaboration  
**Outputs:** process map; questionnaire blueprint; data fields list

### 3) Testing Schedules + First Events Validation (60–90 mins)
**Participants:** Testing/validation SMEs, Compliance ops, BA  
**Agenda:** what schedules are needed; triggers; owners; reminders; exceptions; reporting  
**Outputs:** schedule rules; task templates; exception scenarios

### 4) Complaints Handling + Routing (60–90 mins)
**Participants:** Complaints SMEs, Service manager, BA  
**Agenda:** complaint definition; required info; routing; SLAs; escalation; closure evidence  
**Outputs:** routing matrix; SLA targets; status model; reporting needs

### 5) Data + Analytics (90 mins)
**Participants:** Snowflake/data owner, Analytics stakeholder, Architect, BA, Tech Lead  
**Agenda:** Snowflake fields; refresh; data ownership; 3–4 alert thresholds; dashboard widgets  
**Outputs:** data mapping; alert matrix; dashboard requirements

### 6) Security, Access & External Login (Okta) (60 mins)
**Participants:** Security/Okta team, Platform owner, Architect, BA  
**Agenda:** user lifecycle; access segregation; audit requirements; login flows  
**Outputs:** access model; authentication approach; provisioning/deprovisioning steps

---

## D) Deliverables Produced During Discovery
- Process maps (current and future)
- User personas + volumes
- Backlog of user stories with acceptance criteria
- Data dictionary (required fields)
- Security/access model
- Integration mapping and data refresh schedule
- Analytics requirements and dashboard mockups
- Test strategy (manual + Cypress automation scope)

---

## E) Immediate Decisions Needed
1. Confirm the **project calendar** (effective date/term vs 2026 milestone dates).
2. Confirm whether **FinTechs submit complaints** in the portal or complaints are internal-only.
3. Confirm whether document review requires **formal approval/signoff** or “upload only”.
4. Confirm the **source of truth** for policies/SOPs (Salesforce hub vs external repository links).

