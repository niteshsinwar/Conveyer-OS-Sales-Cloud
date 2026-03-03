# Discovery Session Plan + Gaps (Sponsor Bank Collaboration Platform) — Refined

**Primary Source:** `aethereus_sow.md`  
**Purpose:** Close key unknowns so build sprints can start with clear, testable requirements.

---

## 0) Verification & Refinement Notes (What changed)
I re-read the SOW and validated this plan against the exact SOW bullets.

**Surgical refinements made vs prior version:**
- Clarified the gap score rationale (it’s effectively **0/8** because the SOW is outcome-based and lacks the operational detail needed for a BRD).
- Added an explicit decision to resolve the **timeline/date contradiction** before sprint planning is finalized.
- Added a clarification item for the **training scope ambiguity** (support vs material creation).
- Tightened several session outputs so each session produces a concrete artifact (matrix, template, mapping, etc.).

---

## A) Gap Analysis Score (Pre‑BRD Gate)
| Checklist Area | Status | What we have from SOW | What’s missing to be BRD-ready |
|---|---:|---|---|
| User Roles & Personas | ❌ | “internal/external users” only | named roles, responsibilities, user counts |
| Detailed Process Steps | ❌ | stage names only | step-by-step workflows + approvals + handoffs |
| Data Fields & Attributes | ❌ | “upload docs/comments” only | field list per questionnaire item/complaint/policy change |
| Integration Data Flow | ⚠️ | Snowflake → Data Cloud; “reuse connection” | payload, refresh schedule, error handling, ownership |
| Success Metrics & KPIs | ⚠️ | delivery quality metrics (tests/defects) | business KPIs (cycle time, overdue rate, complaint SLA) |
| Volume & Scale | ❌ | none | #FinTechs, #users, record volumes, file volume/size |
| Exception Handling | ❌ | none | failure scenarios + what users do next |
| Current State (As‑Is) | ❌ | none | current tools/process baseline |

**Gap score today:** 0/8 (target 6/8 before BRD generation).

---

## B) Key Gaps to Resolve (Prioritized)
1. **Who uses the portal and internal workspace?** (roles + counts)
2. **How onboarding and due diligence works today** (systems/spreadsheets/email)
3. **Due diligence questionnaire structure** + evidence review rules
4. **Testing schedule automation rules** and cadence
5. **Complaints definition and workflow** (intake, routing rules, SLAs, reporting)
6. **Policy change governance** (approvals, audit trail)
7. **Snowflake data scope** (tables/fields, refresh frequency, data quality)
8. **Alert thresholds** (3–4 parameters) + required response actions
9. **Analytics dashboard definition** (3–4 widgets, filters, audience)
10. **Timeline alignment** (SOW dates mismatch)
11. **Training scope boundary** (“support training” vs “create training materials”)

---

## C) Proposed Discovery Sessions (6 sessions)

### 1) Vision, Scope & Success Measures (60–90 mins)
**Participants:** Product Owner, Application/Platform Owner, Sponsor program lead, Aethereus PM/BA/Tech Lead  
**Agenda:** goals; in/out scope; timeline alignment; definition of success; signoff approach  
**Outputs (must leave meeting with):**
- Confirmed project calendar baseline (or an owner/date to resolve)
- 3–5 measurable business success metrics
- Decision log + RACI for approvals

### 2) Onboarding + Due Diligence Deep Dive (90 mins)
**Participants:** Onboarding SME, Compliance SME, BA, Tech Lead  
**Agenda:** stages; questionnaire; evidence capture; review/approval; audit trail; external collaboration  
**Outputs:**
- End-to-end process map (minimum 5 steps)
- Questionnaire template outline (sections/questions)
- Evidence rules (what must be uploaded, by when, who reviews)

### 3) Testing Schedules + First Events Validation (60–90 mins)
**Participants:** Testing/validation SMEs, Compliance ops, BA  
**Agenda:** schedules required; triggers; owners; reminders; exceptions; reporting  
**Outputs:**
- Schedule rules catalog (frequency, trigger, owner)
- Task template list
- 2+ exception scenarios (missed test, failed validation, etc.)

### 4) Complaints Handling + Routing (60–90 mins)
**Participants:** Complaints SMEs, Service manager, BA  
**Agenda:** complaint definition; required info; routing; SLAs; escalation; closure evidence  
**Outputs:**
- Complaint taxonomy (types/severity)
- Routing matrix (type → queue/owner)
- SLA targets (if applicable) + escalation path

### 5) Data + Analytics (90 mins)
**Participants:** Snowflake/data owner, Analytics stakeholder, Architect, BA, Tech Lead  
**Agenda:** Snowflake fields; refresh; data ownership; 3–4 alert thresholds; dashboard widgets  
**Outputs:**
- Snowflake → Salesforce data mapping (field list)
- Refresh frequency + latency expectation
- Alert threshold matrix (parameter, rule, who notified, required action)
- CRMA dashboard widget list (3–4 widgets) + filters

### 6) Security, Access & External Login (Okta) (60 mins)
**Participants:** Security/Okta team, Platform owner, Architect, BA  
**Agenda:** user lifecycle; access segregation; audit requirements; login flows  
**Outputs:**
- Access model (who can see what)
- User onboarding/offboarding steps
- Authentication approach confirmation (SSO/login journey)

---

## D) Deliverables Produced During Discovery
- Current state + future state process maps
- Persona list + user counts
- Backlog of user stories with acceptance criteria
- Data dictionary (required fields)
- Access/security model
- Integration mapping + refresh schedule + error handling expectations
- Analytics requirements + dashboard mockups
- Test strategy (manual + automation scope)

---

## E) Immediate Decisions Needed (to unblock build planning)
1. **Confirm the project calendar** (effective date/term vs 2026 milestone dates).
2. Confirm whether **FinTechs submit complaints** in the portal or complaints are internal-only.
3. Confirm whether document review requires **formal approval/signoff** or is “upload + comment” only.
4. Confirm the **source of truth** for policies/SOPs (stored in Salesforce vs links to another repository).
5. Confirm what “support change management and training” means in practice (e.g., live sessions, office hours, admin coaching), since training material creation is out of scope.
