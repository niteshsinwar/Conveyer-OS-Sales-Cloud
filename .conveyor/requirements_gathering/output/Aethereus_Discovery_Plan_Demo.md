# Sponsor Bank Platform Discovery Plan

## Executive Summary

This discovery plan outlines the structured approach to gathering requirements for the **Sponsor Bank FinTech Governance Platform** - a comprehensive Salesforce solution spanning Experience Cloud, Service Cloud, Data Cloud, and CRM Analytics.

### Project Context

| Attribute | Details |
|-----------|---------|
| **Client** | Comenity Servicing LLC (Bread Financial) |
| **Project Duration** | 3 months (Mar 16 - Jun 12, 2026) |
| **Engagement Type** | Fixed Price Implementation |
| **Primary Contact** | Tony Vasek (Tony.Vasek@breadfinancial.com) |

### Business Objective

Bread Financial acts as **Sponsor Bank** for multiple FinTech partners. This platform will:
- Streamline FinTech onboarding and due diligence
- Ensure regulatory compliance and audit readiness
- Provide real-time monitoring of loan parameters
- Centralize complaint management and resolution
- Enable secure collaboration between Bread and FinTech partners

---

## Salesforce Products in Scope

### 1. Experience Cloud (Partner Portal)
**Purpose**: Secure collaboration platform for FinTech partners

**Key Capabilities**:
- FinTech onboarding workflows with document management
- Due diligence questionnaire with approval routing
- Knowledge base for policies, SOPs, and training materials
- Task management and progress tracking
- Okta SSO integration

### 2. Service Cloud (Case Management)
**Purpose**: Complaint intake, routing, and resolution

**Key Capabilities**:
- Multi-channel complaint intake (web, email, phone)
- Automated case routing based on complaint type and FinTech
- SLA/milestone tracking with escalation rules
- Regulatory reporting for CFPB/OCC compliance

### 3. Data Cloud (Monitoring & Alerts)
**Purpose**: Real-time loan parameter monitoring

**Key Capabilities**:
- Snowflake integration (reuse existing connection)
- Ingestion of application and loan data
- Calculated insights (3-4 parameters: APR, loan amount, approval rates, delinquency)
- Automated alerts when loans fall outside agreed parameters

### 4. CRM Analytics (CRMA)
**Purpose**: Executive dashboard for compliance oversight

**Key Capabilities**:
- 1 dashboard with 3-4 widgets
- Metrics: Complaints by FinTech, application volume, loans outside parameters, transaction trends
- Drill-down and filtering by FinTech, date range, and status

---

## Critical Gaps Identified

Based on SOW analysis, the following areas require immediate clarification:

| Gap Category | Specific Questions | Risk Level |
|--------------|-------------------|------------|
| **FinTech Lifecycle** | What are the stages? How do FinTechs transition between stages? Who approves? | 🔴 CRITICAL |
| **User Roles & Permissions** | Who are the Bread users? FinTech users? What can each role do? | 🔴 CRITICAL |
| **Due Diligence Process** | How many questions? What document types? Who reviews and approves? | 🔴 CRITICAL |
| **Data Model** | What is a "FinTech" in Salesforce? Account? Custom object? Opportunity? | 🔴 CRITICAL |
| **Testing Schedules** | What tests run automatically? How often? What happens if a test fails? | 🟠 HIGH |
| **Alert Parameters** | What are the 3-4 specific parameters? What are the thresholds? | 🟠 HIGH |
| **Complaint Routing** | How are complaints categorized? What's the SLA? Assignment logic? | 🟠 HIGH |
| **Policy Change Workflow** | Who proposes changes? Who approves? How are FinTechs notified? | 🟠 HIGH |

---

## Discovery Session Plan

### Timeline Overview

Given the **3-month project timeline** and **offshore-heavy team**, we recommend completing discovery in **2 weeks**:

| Week | Sessions | Deliverable |
|------|----------|-------------|
| **Week 1** | Session 1: FinTech Lifecycle & Governance<br>Session 2: Complaint Management | Initial data model draft<br>Process flow diagrams |
| **Week 2** | Session 3: Data Cloud & Monitoring<br>Session 4: Portal UX & Access Control<br>Session 5: Policy Management & Reporting | Complete BRD<br>High-level solution design<br>Technical architecture diagram |

---

## Session 1: FinTech Lifecycle & Governance

### Session Details

| Attribute | Details |
|-----------|---------|
| **Attendees** | Tony Vasek, Sponsor Bank Program Owner, Compliance Lead |
| **Duration** | 90 minutes |
| **Session Type** | Executive / Process Owner |
| **Location** | Virtual (Teams/Zoom) |

### Purpose

Understand the end-to-end FinTech partner journey from initial contact through active partnership, including all governance checkpoints and compliance requirements.

### Must-Ask Questions

#### 1. Lifecycle Stages
**Question**: "Walk me through the stages a FinTech partner goes through from initial contact to active partnership. What are the stage names?"

**Why This Matters**: This defines the core data model and workflow automation requirements. We need to know if it's a simple linear process or complex with parallel tracks.

**Follow-ups**:
- What triggers a FinTech to move from one stage to the next?
- Who has authority to approve stage transitions?
- Can a FinTech move backwards? Under what circumstances?
- Are there any stages where the FinTech can be "paused" or "on hold"?

---

#### 2. Due Diligence Process
**Question**: "Tell me about the due diligence questionnaire. How many sections? How many questions total?"

**Why This Matters**: Determines whether we use standard Salesforce forms, custom Lightning components, or integrate with external survey tools.

**Follow-ups**:
- Who fills out the questionnaire - Bread or the FinTech?
- Can multiple FinTech users collaborate on the same questionnaire?
- What types of documents are uploaded? (financial statements, compliance certifications, SOC reports)
- Is there a scoring or rating system for due diligence responses?
- Who reviews and approves the completed questionnaire?

---

#### 3. Pre-Launch Testing
**Question**: "What does 'pre-launch testing' mean? What specifically are you testing?"

**Why This Matters**: Defines whether we need test case management, result tracking, or integration with external testing tools.

**Follow-ups**:
- Who conducts the tests - Bread team, FinTech team, or both?
- What are the test categories? (transaction processing, fraud detection, reporting, API integration)
- How are test results documented? Pass/fail or detailed scoring?
- What happens if a test fails? Is there a remediation workflow?
- How many rounds of testing typically occur before launch?

---

#### 4. First Events Validation
**Question**: "What is 'First Events Validation'? What specific events are you validating?"

**Why This Matters**: May require integration with transaction systems or custom monitoring logic.

**Follow-ups**:
- Is this a one-time check or ongoing monitoring during the first X days?
- What constitutes a "first event"? (first application, first approval, first funding, first payment)
- Who validates these events? What's the approval process?
- What happens if validation fails?

---

#### 5. Ongoing Monitoring
**Question**: "After a FinTech goes live, what compliance checks happen? How often?"

**Why This Matters**: Defines the automated testing schedule feature and recurring task management.

**Follow-ups**:
- The SOW mentions 'automated testing schedules' - what tests run automatically?
- What's the frequency? Daily, weekly, monthly, quarterly?
- Who receives the test results?
- What triggers a compliance review or audit?
- Are there seasonal or event-driven checks? (e.g., annual audit, regulatory exam)

---

#### 6. Governance & Roles
**Question**: "Who at Bread is responsible for FinTech oversight?"

**Why This Matters**: Defines user roles, permission sets, and sharing model in Salesforce.

**Follow-ups**:
- What roles exist? (Relationship Manager, Compliance Officer, Risk Manager, Legal, Executive Sponsor)
- Who at the FinTech interacts with the portal? (CEO, CFO, Compliance Officer, Operations Manager)
- Can one Bread user manage multiple FinTechs?
- Can one FinTech have multiple Bread contacts?
- Can Bread users see all FinTechs or only assigned ones?
- Can FinTechs see each other's data? (Assume NO, but must confirm)

---

### Watch For

🚩 **Regulatory Requirements**: FDIC, OCC, state banking laws that drive process rigidity

🚩 **Manual Workarounds**: Current pain points that indicate automation opportunities

🚩 **Urgency Drivers**: Audit findings, consent orders, or regulatory pressure creating timeline constraints

🚩 **Implicit Assumptions**: Statements like "obviously we'd..." that may not be obvious to FinTechs

---

### Expected Outputs

By the end of this session, we should have:

✅ **Clear lifecycle stage names** and transition criteria (e.g., Prospect → Due Diligence → Testing → Pre-Launch → Active → Monitoring → Offboarding)

✅ **Understanding of due diligence scope** (number of questions, document types, approval workflow)

✅ **Identification of key user personas** with preliminary role definitions

✅ **Compliance monitoring frequency** and scope

✅ **High-level process flow diagram** for FinTech onboarding

---

## Session 2: Complaint Management Deep-Dive

### Session Details

| Attribute | Details |
|-----------|---------|
| **Attendees** | Complaint/Consumer Affairs Manager, Legal/Compliance Representative |
| **Duration** | 60 minutes |
| **Session Type** | Process Owner |
| **Location** | Virtual (Teams/Zoom) |

### Purpose

Design the complaint case routing, assignment, and resolution workflow to ensure regulatory compliance (CFPB, OCC) and efficient case management.

### Must-Ask Questions

#### 1. Complaint Intake
**Question**: "How do complaints come in today?"

**Follow-ups**:
- What channels? (email, phone, web form, regulator referral, social media)
- Who can create a complaint - Bread users, FinTech users, or both?
- What information is captured at intake? (consumer name, contact info, FinTech, complaint type, product, transaction details)
- Is there a standard intake form or free-form entry?

---

#### 2. Complaint Categorization
**Question**: "How are complaints categorized?"

**Follow-ups**:
- What are the complaint types? (fraud, billing dispute, unauthorized transaction, discrimination, privacy violation)
- Are there regulatory categories you must track? (CFPB product/issue taxonomy)
- Do different complaint types have different workflows or SLAs?
- How do you determine severity/priority?

---

#### 3. Routing & Assignment
**Question**: "Who handles complaints - Bread team, FinTech team, or both?"

**Follow-ups**:
- How are complaints assigned? (by FinTech, by complaint type, by queue, round-robin, manual)
- Are there escalation rules? (high-severity complaints go to legal, complaints about specific FinTechs go to relationship manager)
- Can a complaint be reassigned? Who can reassign?
- What happens if a FinTech doesn't respond in time?

---

#### 4. SLAs & Timelines
**Question**: "What's your target response time for complaints?"

**Follow-ups**:
- What's your target resolution time?
- Are there regulatory deadlines? (CFPB requires response within 15 days, resolution within 60 days)
- Do SLAs vary by complaint type or severity?
- What happens when an SLA is breached? (escalation, notification, executive visibility)

---

#### 5. Resolution Workflow
**Question**: "Walk me through the steps to resolve a complaint. Who does what?"

**Follow-ups**:
- Who investigates the complaint?
- What documentation is required? (investigation notes, evidence, communication logs)
- Who approves the resolution? Is there a multi-level approval?
- Can the consumer dispute the resolution? What's the appeal process?
- What happens if a complaint is substantiated? (refund, policy change, corrective action)

---

#### 6. Reporting
**Question**: "Do you report complaints to regulators? How often?"

**Follow-ups**:
- What format? (CFPB portal, OCC quarterly reports)
- What metrics do you track? (complaints per FinTech, resolution time, complaint trends, substantiation rate)
- Who consumes complaint reports internally? (executives, board, audit committee)

---

### Expected Outputs

✅ **Complaint case record types** and fields

✅ **Assignment and routing logic** (decision tree or flowchart)

✅ **SLA/milestone requirements** with escalation rules

✅ **Integration points** (if complaints come from external systems like email-to-case)

✅ **Regulatory reporting specifications**

---

## Session 3: Data Cloud & Monitoring

### Session Details

| Attribute | Details |
|-----------|---------|
| **Attendees** | Data/BI Team, Snowflake Admin, Risk Analytics Team |
| **Duration** | 90 minutes |
| **Session Type** | Technical |
| **Location** | Virtual (Teams/Zoom) |

### Purpose

Define Snowflake integration architecture, alert parameter logic, and CRMA dashboard requirements for real-time loan monitoring.

### Must-Ask Questions

#### 1. Snowflake Data Structure
**Question**: "What tables in Snowflake contain application and loan data?"

**Follow-ups**:
- What's the schema? Key fields? (application_id, fintech_id, loan_amount, apr, approval_date, loan_status, delinquency_days)
- How are FinTechs identified in Snowflake? (fintech_id, fintech_name, BIN number)
- How often is Snowflake updated? Real-time streaming or batch (hourly, daily)?
- What's the data volume? (X applications per day, Y total active loans)
- Is there historical data? How far back?

---

#### 2. Existing Snowflake Connection
**Question**: "You mentioned reusing an existing Snowflake connection. Is that already set up in Data Cloud?"

**Follow-ups**:
- What authentication method? (OAuth, key pair authentication, username/password)
- What Snowflake role/warehouse is used?
- Are there any data security constraints? (row-level security, column masking, encryption)
- Who manages the Snowflake connection? (Bread IT, Snowflake admin)
- Has Data Cloud been used before at Bread? Or is this the first use case?

---

#### 3. Alert Parameters
**Question**: "The SOW mentions '3-4 parameters' for alerts. What specifically are they?"

**Why This Matters**: This is a critical gap. We need exact parameter names, thresholds, and business rules.

**Expected Parameters** (to validate):
- APR exceeds agreed maximum (e.g., > 36%)
- Loan amount exceeds limit (e.g., > $50,000)
- Approval rate below threshold (e.g., < 20%)
- Delinquency rate above threshold (e.g., > 5%)

**Follow-ups**:
- What's the threshold for each parameter? Who set these thresholds?
- Are thresholds the same for all FinTechs or different per FinTech?
- How often should parameters be checked? Real-time, hourly, daily?
- Is there a grace period or tolerance? (e.g., APR can exceed by 1% for 24 hours)

---

#### 4. Alert Workflow
**Question**: "When a loan falls outside parameters, who gets notified? How?"

**Follow-ups**:
- Notification method? (email, Slack, SMS, in-app notification in Salesforce)
- Who receives alerts? (Bread relationship manager, compliance team, FinTech contact)
- What action should they take? Is there a remediation workflow?
- Should alerts create a case automatically? Or just send a notification?
- Do alerts need to be acknowledged? Tracked?

---

#### 5. Calculated Insights
**Question**: "What calculated metrics do you need beyond the 3-4 alert parameters?"

**Follow-ups**:
- Aggregate metrics by FinTech? (average APR, total loan volume, approval rate, delinquency rate)
- Trend analysis? (e.g., "APR increased 10% this month compared to last month")
- Benchmarking? (compare one FinTech's metrics to portfolio average)
- Time-based calculations? (30-day rolling average, quarter-over-quarter growth)

---

#### 6. CRMA Dashboard
**Question**: "The SOW mentions 1 dashboard with 3-4 widgets. What should each widget show?"

**Expected Widgets** (to validate):
- **Widget 1**: Complaints by FinTech (bar chart or table)
- **Widget 2**: Application volume trend (line chart over time)
- **Widget 3**: Loans outside parameters (KPI or gauge)
- **Widget 4**: Transaction trends by FinTech (stacked bar or area chart)

**Follow-ups**:
- Who will use this dashboard? (executives, relationship managers, compliance team)
- What decisions will they make with it?
- Do you need drill-down capability? (click on a FinTech to see details)
- What filters are needed? (by FinTech, by date range, by status)
- Should the dashboard be embedded in the Experience Cloud portal or only in internal Salesforce?

---

#### 7. Data Refresh
**Question**: "How often should Data Cloud refresh from Snowflake?"

**Follow-ups**:
- Real-time, hourly, daily, or on-demand?
- Are there any data transformation needs before ingestion? (data cleansing, enrichment, joins)
- Who monitors data quality? What happens if data is missing or incorrect?

---

### Expected Outputs

✅ **Snowflake table/field mapping** document

✅ **Specific alert parameter names, thresholds, and business rules**

✅ **CRMA dashboard mockup or wireframe** with widget specifications

✅ **Data Cloud architecture diagram** showing data flow from Snowflake to Salesforce

✅ **Data refresh schedule and monitoring plan**

---

## Session 4: Portal UX & Access Control

### Session Details

| Attribute | Details |
|-----------|---------|
| **Attendees** | FinTech Relationship Manager, Okta Admin, UX/Branding Representative |
| **Duration** | 75 minutes |
| **Session Type** | Process Owner / End User |
| **Location** | Virtual (Teams/Zoom) |

### Purpose

Define portal functionality, user experience, authentication, and role-based access control to ensure secure and intuitive collaboration.

### Must-Ask Questions

#### 1. Portal Use Cases
**Question**: "What should a FinTech user be able to DO in the portal?"

**Expected Use Cases** (to validate):
- Submit onboarding documents
- Complete due diligence questionnaire
- View compliance status and test results
- Upload policies and SOPs
- Create and track complaints
- View assigned tasks and deadlines
- Access knowledge base (policies, training, SOPs)
- View reports and dashboards

**Follow-ups**:
- Walk me through a day in the life of a FinTech user interacting with the portal
- What should a Bread user be able to do in the portal vs. in the internal Salesforce org?
- Should FinTechs be able to communicate with Bread users? (Chatter, messaging, comments)

---

#### 2. User Roles & Permissions
**Question**: "How many user types do you have?"

**Expected Roles** (to validate):
- **Bread Roles**: Admin, Relationship Manager, Compliance Officer, Risk Manager, Legal, Executive
- **FinTech Roles**: Admin, Compliance Officer, Operations Manager, Executive, Read-Only User

**Follow-ups**:
- What can each user type see and do? (create a permission matrix)
- Can a FinTech have multiple users? With different roles?
- Can a Bread user manage multiple FinTechs?
- How are users provisioned? (manual by admin, self-registration, SSO auto-provisioning)

---

#### 3. Data Visibility
**Question**: "Can FinTechs see each other's data?"

**Expected Answer**: NO (but must confirm)

**Follow-ups**:
- Can a FinTech see all Bread users? Or only their assigned Relationship Manager?
- What data can FinTechs see about themselves? (compliance status, test results, complaint history, loan metrics)
- Can FinTechs see historical data? How far back?
- Are there any data fields that should be hidden from FinTechs? (internal notes, risk scores, Bread-only comments)

---

#### 4. Authentication
**Question**: "You mentioned Okta. Is Okta already configured for external users?"

**Follow-ups**:
- Do FinTechs have Okta accounts? Or will they register in the portal first?
- Is SSO required? Or username/password login?
- Do you need multi-factor authentication (MFA)? Required or optional?
- What's the password policy? (complexity, expiration, lockout)
- How do FinTech users reset passwords?
- Can Bread users and FinTech users use the same login page? Or separate?

---

#### 5. Branding & UX
**Question**: "The SOW mentions 'UPP branding guidelines' - can you share those?"

**Follow-ups**:
- Do you want a co-branded experience? (Bread logo + FinTech logo)
- What colors, fonts, and imagery should be used?
- Any specific UX requirements? (mobile-friendly, specific navigation structure, accessibility WCAG 2.0 AA)
- Do you have design mockups or wireframes?
- Should the portal feel like a Bread product or neutral/white-label?

---

#### 6. Knowledge Base
**Question**: "The SOW mentions 'central hub for policies, training, SOPs' - is this a Salesforce Knowledge Base?"

**Follow-ups**:
- How should knowledge articles be organized? (by topic, by FinTech, by compliance area)
- Who creates knowledge articles? Who approves?
- Can FinTechs search for articles? Rate them? Comment?
- Should articles be versioned? Can users see previous versions?
- Are there different article types? (policies, SOPs, training guides, FAQs)
- Should some articles be visible only to Bread users?

---

#### 7. Notifications
**Question**: "When should users get notified?"

**Expected Triggers** (to validate):
- Task assigned
- Document uploaded or approved
- Compliance status changed
- Test result available
- Policy changed
- Complaint created or resolved
- Alert triggered (loan outside parameters)

**Follow-ups**:
- Email, in-app notification, or both?
- Can users customize notification preferences?
- What should the notification message include? Link back to portal?

---

### Expected Outputs

✅ **User role matrix** (role name, permissions, data access)

✅ **Portal sitemap** (pages, navigation structure)

✅ **Okta integration requirements** and authentication flow diagram

✅ **Branding guidelines** document or mockups

✅ **Knowledge base taxonomy** (article types, categories, data categories)

---

## Session 5: Policy Management & Reporting

### Session Details

| Attribute | Details |
|-----------|---------|
| **Attendees** | Compliance Manager, Operations Manager, Reporting Lead |
| **Duration** | 60 minutes |
| **Session Type** | Process Owner |
| **Location** | Virtual (Teams/Zoom) |

### Purpose

Define policy change tracking workflow, audit trail requirements, and reporting specifications to ensure regulatory compliance and operational visibility.

### Must-Ask Questions

#### 1. Policy Change Workflow
**Question**: "The SOW mentions 'workflow to track and report on policy changes' - walk me through that process."

**Follow-ups**:
- Who can propose a policy change? (Bread compliance team, FinTech, regulator)
- What information is captured in a policy change request? (reason, impact, affected FinTechs)
- Who reviews and approves policy changes? Single approver or multi-level?
- How are FinTechs notified of policy changes? Email? Portal notification?
- Do FinTechs need to acknowledge policy changes? How is acknowledgment tracked?
- What's the typical timeline from proposal to implementation?

---

#### 2. Policy Versioning
**Question**: "Do you need version history for policies?"

**Follow-ups**:
- Can users see previous versions? Or only the current version?
- Are policies effective immediately or on a future date?
- How do you handle policy rollback? (if a new policy causes issues)
- Should policies have an expiration date or review date?

---

#### 3. Audit Trail
**Question**: "What audit information do you need to track?"

**Expected Audit Fields**:
- Who changed what field
- When (date/time)
- Old value vs. new value
- Reason for change (comment field)

**Follow-ups**:
- Do regulators audit your policy management process?
- How long must audit trails be retained? (e.g., 7 years for banking regulations)
- Do you need to export audit logs? What format?

---

#### 4. Reporting Requirements
**Question**: "Beyond the CRMA dashboard, what reports do you need?"

**Expected Reports** (to validate):
- FinTech onboarding status report (by stage, by relationship manager)
- Compliance scorecard (by FinTech, by compliance area)
- Overdue tasks report (by assignee, by FinTech)
- Policy change log (all changes in a date range)
- Complaint summary report (by FinTech, by type, by status)
- Test results report (pass/fail rates by FinTech)

**Follow-ups**:
- Who consumes these reports? How often? (daily, weekly, monthly, quarterly)
- Do you export reports to regulators? What format? (PDF, Excel, CSV)
- Should reports be automated and scheduled? Or on-demand?
- Do you need report subscriptions? (email report to stakeholders every Monday)

---

#### 5. Task Management
**Question**: "The SOW mentions 'overdue tasks' and 'task completion report' - what are these tasks?"

**Follow-ups**:
- Who assigns tasks? To whom? (Bread to FinTech, Bread to Bread, FinTech to FinTech)
- What's the task lifecycle? (assigned → in progress → complete → closed)
- Are tasks tied to compliance stages? (e.g., "Complete due diligence questionnaire by Stage 2")
- What triggers task creation? (manual, automated based on stage change, scheduled)
- Can tasks have dependencies? (Task B can't start until Task A is complete)
- What happens when a task is overdue? (escalation, notification, executive visibility)

---

#### 6. Success Metrics
**Question**: "How will you measure the success of this platform?"

**Expected Metrics** (to validate):
- Reduce FinTech onboarding time from X days to Y days
- Increase compliance audit pass rate
- Reduce manual tracking effort (hours saved per week)
- Improve FinTech satisfaction (survey score)
- Reduce complaint resolution time
- Increase policy acknowledgment rate

**Follow-ups**:
- What's your target onboarding time for a new FinTech? (current state vs. future state)
- What's your current compliance audit pass rate? Target?
- How many hours per week are spent on manual tracking today?

---

### Expected Outputs

✅ **Policy change workflow diagram** with approval routing

✅ **Task management requirements** (task types, assignment rules, escalation logic)

✅ **Report specifications** (fields, filters, frequency, distribution)

✅ **Success criteria and KPIs** with baseline and target metrics

---

## Post-Discovery: Next Steps

### Week 3: Requirements Documentation

After completing all 5 discovery sessions, the Aethereus team will:

1. **Synthesize all session notes** into a comprehensive Business Requirements Document (BRD)
2. **Create process flow diagrams** for key workflows (onboarding, complaint resolution, policy change)
3. **Document data model** (objects, fields, relationships)
4. **Define user stories** with acceptance criteria for each functional requirement
5. **Identify technical dependencies** and integration points

### Week 4: Solution Design

1. **High-level solution architecture** (Experience Cloud site structure, Data Cloud data model, CRMA dashboard design)
2. **Technical design document** (automation, integrations, custom code requirements)
3. **Security model** (sharing rules, permission sets, profiles)
4. **Testing strategy** (unit tests, integration tests, UAT plan, Cypress automation)

### Weeks 5-12: Build, Test, Deploy

1. **Sprint planning** (2-week sprints)
2. **Iterative development** with demo sessions
3. **User acceptance testing** with Bread and FinTech users
4. **Training and change management**
5. **Production deployment and hypercare**

---

## Appendix: Discovery Session Schedule Template

### Proposed Calendar

| Session # | Session Name | Proposed Date | Duration | Attendees | Status |
|-----------|--------------|---------------|----------|-----------|--------|
| 1 | FinTech Lifecycle & Governance | [Week 1, Day 1] | 90 min | Tony Vasek, Program Owner, Compliance Lead | 📅 To Schedule |
| 2 | Complaint Management | [Week 1, Day 3] | 60 min | Complaint Manager, Legal Rep | 📅 To Schedule |
| 3 | Data Cloud & Monitoring | [Week 2, Day 1] | 90 min | Data/BI Team, Snowflake Admin, Risk Analytics | 📅 To Schedule |
| 4 | Portal UX & Access Control | [Week 2, Day 2] | 75 min | Relationship Manager, Okta Admin, UX Rep | 📅 To Schedule |
| 5 | Policy Management & Reporting | [Week 2, Day 4] | 60 min | Compliance Manager, Operations Manager, Reporting Lead | 📅 To Schedule |

**Total Discovery Time**: 6.25 hours across 2 weeks

---

## Contact Information

### Aethereus Team

| Role | Name | Email |
|------|------|-------|
| **Project Manager** | [TBD] | [TBD] |
| **Business Analyst** | [TBD] | [TBD] |
| **Technical Lead** | [TBD] | [TBD] |

### Comenity Team

| Role | Name | Email |
|------|------|-------|
| **Primary Contact** | Tony Vasek | Tony.Vasek@breadfinancial.com |
| **Phone** | 614-937-2792 | |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Current Date] | Aethereus BA Team | Initial discovery plan created based on SOW analysis |

---

**Next Action**: Please review this discovery plan and confirm availability for the proposed sessions. We recommend scheduling all 5 sessions within the next 2 weeks to maintain project momentum.

For questions or to schedule sessions, contact Tony Vasek at Tony.Vasek@breadfinancial.com or 614-937-2792.