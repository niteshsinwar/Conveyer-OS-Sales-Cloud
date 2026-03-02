# Business Requirements Document: Phoenix Industries Salesforce Sales Cloud Implementation

**Document Version:** 1.0  
**Project Name:** Phoenix Industries Salesforce Sales Cloud Migration  
**Prepared by:** Elite Salesforce Business Analyst  
**Date:** March 2026  
**Status:** DRAFT - For Stakeholder Review  

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 2026 | BA Team | Initial draft based on client requirements, kickoff meeting, and stakeholder emails |

---

## 1. Executive Summary

### 1.1 Business Problem

Phoenix Industries is replacing its end-of-life Oracle Siebel 8.2 CRM system, which has become a critical bottleneck to sales productivity and growth. The current system lacks:
- Mobile capabilities for 150+ field sales representatives
- Real-time pipeline visibility (currently requires manual Excel consolidation)
- Automated quote approval workflows (currently 3.5-day turnaround via email)
- Modern integration capabilities with SAP S/4HANA and Microsoft 365

These limitations result in:
- **90-day average sales cycle** (industry benchmark: 68 days)
- **18-hour lead response time** (target: 1 hour for hot leads)
- **3+ hours/day of administrative work** per sales rep
- **65% pipeline forecast accuracy** (target: 85%)

### 1.2 Proposed Solution

Implement **Salesforce Sales Cloud** with the following components:
- Core CRM (Accounts, Contacts, Leads, Opportunities)
- Automated lead routing and scoring
- Multi-level quote approval workflows (CPQ - Phase 2)
- Real-time SAP S/4HANA integration (Phase 3)
- Microsoft 365 integration (Outlook, Calendar)
- Mobile app for iOS/Android
- Executive dashboards and analytics

### 1.3 Expected Outcomes & KPIs

| Metric | Current State | Target (6 months post go-live) | Measurement Method |
|--------|---------------|-------------------------------|-------------------|
| Average Sales Cycle | 90 days | 68 days (-25%) | Opportunity Created Date → Close Date |
| Lead Response Time | 18 hours | 1 hour (hot leads), 4 hours (standard) | Lead Created → First Activity |
| Quote Turnaround | 3.5 days | 0.5 days (4 hours) | Quote Created → Approved |
| Pipeline Accuracy | 65% | 85% | Forecast vs Actual (monthly) |
| Rep Admin Time | 3 hours/day | 1 hour/day | Weekly rep survey |
| User Adoption | N/A | 90% daily active users | Login analytics |

### 1.4 Project Scope Summary

**In Scope:**
- Salesforce Sales Cloud implementation for 150 users
- Automated lead management and routing
- Opportunity and account management
- Product catalog and pricing (250 SKUs)
- Quote generation and approval workflows
- SAP S/4HANA integration (order creation)
- Microsoft 365 integration
- Mobile deployment
- Executive dashboards and reports
- Data migration from Oracle Siebel 8.2
- User training and change management

**Out of Scope (Future Phases):**
- DocuSign integration (Phase 2)
- Advanced CPQ (bundles, renewals) - Phase 2
- Marketing Cloud integration
- Community Cloud / Partner Portal
- Service Cloud / Customer Success module
- Advanced Einstein AI features

**Project Timeline:**
- **Phase 1 (Go-live July 1, 2026):** Core Sales Cloud, lead/opportunity management, basic reporting
- **Phase 2 (August 2026):** CPQ and approval workflows
- **Phase 3 (September 2026):** SAP integration, advanced dashboards

**Budget:** $450,000 (approved by CFO)

**Executive Sponsor:** Sarah Mitchell, VP of Sales

---

## 2. Business Context

### 2.1 Current State ("As-Is")

**Technology Landscape:**
- **CRM:** Oracle Siebel 8.2 (end-of-life, on-premises)
- **ERP:** SAP S/4HANA
- **Email/Productivity:** Microsoft 365 (Outlook, Teams)
- **Data Enrichment:** ZoomInfo (planned integration)

**Current Sales Process:**

```
Lead Capture → Manual Review → Manual Assignment (24-48 hrs) → 
Qualification → Opportunity Creation → Discovery → 
Proposal → Manual Quote (Excel) → Email Approval Chain (3.5 days) → 
Negotiation → Closed Won → Manual SAP Entry (order creation)
```

**Pain Points:**
1. **Lead Management:**
   - Leads sit in shared inbox for 24-48 hours before assignment
   - No automated scoring or prioritization
   - High-value leads treated same as low-quality leads

2. **Pipeline Visibility:**
   - No real-time reporting
   - Month-end manual Excel consolidation across 150 reps
   - Forecast accuracy only 65%

3. **Quoting Process:**
   - Reps create inconsistent quotes in Excel
   - Discount approvals via email chains (3.5-day average)
   - No audit trail or approval history
   - Margin erosion due to inconsistent discounting

4. **Mobile Access:**
   - No mobile app
   - Field reps spend 1-2 hours/evening updating CRM from laptop
   - Can't access account history during customer visits

5. **Integration:**
   - No automated SAP order creation
   - Manual data entry causes errors and delays
   - No email/calendar sync with Outlook

### 2.2 Desired Future State ("To-Be")

**Automated Sales Process:**

```
Lead Capture (website/trade show/partner) → Auto-Score (1-100) → 
Auto-Route to Territory Rep (< 5 min) → Mobile Notification → 
Qualification → Opportunity Creation → 
Guided Selling (Sales Path) → Configure Quote (CPQ) → 
Auto-Approval Workflow (< 4 hrs) → eSignature → 
Closed Won → Auto-Create SAP Order (real-time) → Fulfillment
```

**Key Improvements:**
- **Lead routing:** < 5 minutes (vs 24-48 hours)
- **Mobile-first:** Reps update CRM in real-time during customer visits
- **Quote approvals:** Automated workflow with 4-hour SLA (vs 3.5 days)
- **Pipeline visibility:** Real-time dashboards for all stakeholders
- **SAP integration:** Zero manual order entry

---

## 3. Stakeholders & Users

### 3.1 Stakeholder Matrix

| Role | Name | Responsibilities | Key Needs | Influence |
|------|------|------------------|-----------|-----------|
| **Project Sponsor** | Sarah Mitchell | VP of Sales | Executive dashboards, forecast accuracy, ROI | High |
| **Project Lead** | David Chen | Sales Operations Manager | Lead routing, territory management, reporting | High |
| **IT Lead** | Jennifer Rodriguez | IT Director | SAP integration, security, SSO, data residency | High |
| **Field Sales Rep** | Mark Thompson | Senior Account Executive | Mobile app, activity logging, ease of use | Medium |
| **Customer Success** | Lisa Wang | CS Manager | Account visibility, handoff process | Medium |
| **Finance** | [TBD] | CFO/Finance Team | Quote approvals >30%, margin reporting | Medium |
| **End Users** | 150 sales reps | Daily CRM users | Productivity, mobile access, simplicity | High |

### 3.2 User Roles & Personas

#### Persona 1: Inside Sales Rep (40 users)
- **Primary Activities:** Lead qualification, outbound calls, SMB account management
- **Key Pain Points:** High volume of low-quality leads, manual data entry
- **Success Criteria:** Fast lead assignment, mobile dialer integration, task automation
- **Training Needs:** Moderate - 2 hours

#### Persona 2: Territory Account Executive (85 users)
- **Primary Activities:** Mid-market sales, field visits, opportunity management
- **Key Pain Points:** Time on the road, can't update CRM until evening, quote delays
- **Success Criteria:** Full-featured mobile app, quick quoting, automated activity logging
- **Training Needs:** High - 3 hours + mobile training

#### Persona 3: Strategic Account Executive (8 users)
- **Primary Activities:** Enterprise deals, complex negotiations, C-level relationships
- **Key Pain Points:** Long sales cycles, complex approvals, ITAR compliance tracking
- **Success Criteria:** Custom pricing, fast approvals, ITAR security controls
- **Training Needs:** High - 4 hours (advanced features)

#### Persona 4: Sales Manager (12 users)
- **Primary Activities:** Team coaching, pipeline reviews, forecast management, approvals
- **Key Pain Points:** No visibility into rep activities, manual forecast consolidation
- **Success Criteria:** Team dashboards, mobile approvals, forecast accuracy tools
- **Training Needs:** High - 4 hours (management features)

#### Persona 5: Regional VP (4 users)
- **Primary Activities:** Regional strategy, major deal support, forecast accuracy
- **Key Pain Points:** Delayed approvals, no regional analytics
- **Success Criteria:** Mobile approvals, regional dashboards, win/loss analysis
- **Training Needs:** Moderate - 2 hours (executive features)

#### Persona 6: VP of Sales (1 user - Sarah Mitchell)
- **Primary Activities:** Board reporting, strategic planning, major deal approvals
- **Key Pain Points:** No real-time data, manual board report creation
- **Success Criteria:** Executive dashboard, automated reports, mobile approvals
- **Training Needs:** Low - 1 hour (executive overview)

---

## 4. Scope

### 4.1 In Scope (Phase 1 - July 1, 2026 Go-Live)

**Core Objects & Features:**
- ✅ Accounts, Contacts, Leads, Opportunities, Products, Price Books
- ✅ Automated lead scoring (1-100 scale)
- ✅ Automated lead routing (territory, product, company size, ITAR)
- ✅ Sales Path (guided selling by stage)
- ✅ Forecasting (3-tier: Commit, Best Case, Pipeline)
- ✅ Activity management (Tasks, Events, Call Logging)
- ✅ Mobile app deployment (iOS/Android)
- ✅ Microsoft 365 integration (Outlook, Calendar sync)
- ✅ Executive dashboards (pipeline, forecast, activities)
- ✅ Standard reports (lead conversion, pipeline aging, bookings)
- ✅ Data migration from Oracle Siebel 8.2

**Security & Compliance:**
- ✅ Azure AD SSO integration
- ✅ MFA enforcement
- ✅ ITAR compliance controls (field-level security, sharing rules)
- ✅ EU data residency (Frankfurt data center)

**User Management:**
- ✅ 150 user licenses (Sales Cloud)
- ✅ Custom profiles and permission sets
- ✅ Territory management (13 regions)

### 4.2 In Scope (Phase 2 - August 2026)

**CPQ & Quote Management:**
- ✅ Product catalog (250 SKUs across 3 product families)
- ✅ Pricing rules (volume discounts, bundles, strategic accounts)
- ✅ Quote generation (PDF, branded templates)
- ✅ Multi-level approval workflow (5-tier discount matrix)
- ✅ Quote expiration and versioning

### 4.3 In Scope (Phase 3 - September 2026)

**Integration & Advanced Analytics:**
- ✅ SAP S/4HANA integration (bi-directional, real-time)
- ✅ Advanced dashboards (win/loss analysis, rep performance)
- ✅ Sales contest tracking and leaderboards
- ✅ Automated board reports (monthly email)

### 4.4 Out of Scope

**Explicitly Excluded:**
- ❌ DocuSign integration (future phase)
- ❌ Marketing Cloud integration
- ❌ Partner Community / Partner Portal
- ❌ Service Cloud / Case Management
- ❌ Customer Success / Renewal management
- ❌ Einstein AI features (Activity Capture, Lead Scoring AI)
- ❌ Advanced CPQ (renewals, subscriptions, amendments)
- ❌ ZoomInfo integration (future phase)
- ❌ Third-party quoting tools (using native Salesforce CPQ)

### 4.5 Salesforce Products & Licenses

| Product | Quantity | Purpose |
|---------|----------|---------|
| Sales Cloud Enterprise | 150 | Core CRM for all sales users |
| Salesforce CPQ | 150 | Quote generation and approvals (Phase 2) |
| Salesforce Mobile | 150 | Included with Sales Cloud |
| Data Residency | 1 | EU data storage compliance |

**[CLARIFY]:** Do we need additional licenses for:
- Einstein Activity Capture (auto-log emails/meetings)?
- Salesforce Inbox (enhanced Outlook integration)?
- Data.com / ZoomInfo native connector?

---

## 5. Functional Requirements

### FR-001: Lead Management

**Priority:** P1 - Critical (Phase 1)

#### FR-001.1: Multi-Channel Lead Capture
- **User Story:** As an **Inside Sales Rep**, I want leads to be automatically captured from multiple sources so that I can respond quickly without manual data entry.

- **Acceptance Criteria:**
  - **Given** a prospect submits a web form, **When** the form is submitted, **Then** a Lead record is created in Salesforce within 5 seconds
  - **Given** a trade show badge scan CSV is uploaded, **When** the import completes, **Then** all leads are created with proper source attribution
  - **Given** a partner submits a referral, **When** the referral is submitted via Partner Community, **Then** a Lead is created and assigned to the partner's aligned territory rep
  - **Given** duplicate leads exist, **When** a new lead is captured, **Then** the system detects duplicates with 95% accuracy and merges or alerts

- **Lead Sources:**
  - Website form (Marketing Cloud connector)
  - Trade show badge scan (CSV import)
  - Partner referral (Partner Community - future)
  - Manual entry (Inside Sales)
  - Purchased list (bulk import)
  - Webinar registration
  - Content download

- **Data Enrichment:**
  - **[TBD - Phase 2]:** ZoomInfo integration to auto-populate company data (revenue, employee count, industry)

- **Business Rules:**
  - Web-to-Lead must create records within 5 seconds
  - Duplicate detection rules: Match on Email (exact), Company Name (fuzzy 85%), Phone (exact)
  - If duplicate found, append to existing Lead's Activity History and notify assigned rep

#### FR-001.2: Automated Lead Scoring

- **User Story:** As a **Sales Manager**, I want leads automatically scored based on quality criteria so that my team focuses on high-value opportunities first.

- **Acceptance Criteria:**
  - **Given** a Lead is created or updated, **When** scoring criteria change, **Then** the Lead Score (1-100) is recalculated immediately
  - **Given** a Lead has a score, **When** a rep views the Lead, **Then** the score is prominently displayed with color coding (Red <40, Yellow 40-69, Green 70+)

- **Scoring Formula:**

| Criterion | Weight | Score Values |
|-----------|--------|--------------|
| **Company Size** | 40% | Enterprise (>$500M): 40 pts<br>Mid-Market ($10M-$500M): 25 pts<br>SMB (<$10M): 10 pts |
| **Product Interest** | 30% | Enterprise Hardware: 30 pts<br>Cloud Services: 25 pts<br>Professional Services: 15 pts<br>Unknown/General: 5 pts |
| **Lead Source** | 30% | Customer Referral: 30 pts<br>Demo Request: 25 pts<br>Trade Show: 20 pts<br>Webinar: 15 pts<br>Content Download: 10 pts<br>Purchased List: 5 pts |

**Final Score = (Company Size Score × 0.4) + (Product Interest Score × 0.3) + (Lead Source Score × 0.3)**

- **Business Rules:**
  - Score must be calculated on Lead creation and whenever scoring fields change
  - Score is read-only for users (calculated field)
  - Score history is tracked for analysis

#### FR-001.3: Automated Lead Routing & Assignment

- **User Story:** As an **Inside Sales Rep**, I want leads automatically assigned to the right rep based on territory and priority so that I can respond within SLA.

- **Acceptance Criteria:**
  - **Given** a Lead is created, **When** the Lead has a valid address and score, **Then** the Lead is assigned to the appropriate rep within 5 minutes
  - **Given** a high-priority Lead (score ≥70), **When** assigned, **Then** the rep receives mobile push notification and email alert
  - **Given** a rep does not respond within SLA, **When** SLA expires, **Then** the Lead escalates to the Sales Manager

- **Territory Structure:**

**United States (10 Regions):**

| Region Code | Name | States/Zip Codes |
|------------|------|------------------|
| US-NE | Northeast | MA, CT, RI, NH, VT, ME |
| US-NY | New York Metro | NY, NJ |
| US-MA | Mid-Atlantic | PA, DE, MD, DC, VA |
| US-SE | Southeast | NC, SC, GA, FL, AL, MS |
| US-MW | Midwest | OH, MI, IN, IL, WI |
| US-TX | Texas | TX, OK, LA |
| US-MT | Mountain | CO, UT, NV, AZ, NM |
| US-NW | Northwest | WA, OR, ID, MT |
| US-CA-N | Northern California | CA (94xxx-95xxx zip codes) |
| US-CA-S | Southern California | CA (90xxx-93xxx zip codes) |

**International (3 Regions):**

| Region Code | Name | Countries |
|------------|------|-----------|
| UK | United Kingdom | UK, Ireland |
| DE | Germany/DACH | Germany, Austria, Switzerland |
| FR | France | France, Belgium, Netherlands |

- **Routing Rules (Priority Order):**

| Condition | Assignment Rule | SLA |
|-----------|----------------|-----|
| **ITAR Flag** | Company Name contains "ITAR" or "Government" | Route to Strategic Accounts team (ITAR-certified users only) | 4 hours |
| **High Score** | Lead Score ≥ 70 | Route to Senior AE in territory | 1 hour |
| **Enterprise** | Lead Score 40-69 AND Company Size = Enterprise | Route to Strategic Account team | 2 hours |
| **Standard** | Lead Score 40-69 | Route to Territory AE | 4 hours |
| **Low Priority** | Lead Score < 40 | Route to Inside Sales queue (round-robin) | 24 hours |

- **Business Rules:**
  - Territory determined by Lead's State/Country field
  - If territory has no active rep, assign to Regional VP
  - If ITAR flag is set, ONLY ITAR-certified users can be assigned
  - Round-robin within Inside Sales queue (reset monthly)
  - SLA starts when Lead is created
  - SLA breach triggers email to Sales Manager

- **Escalation Process:**
  - If no activity logged within SLA, send escalation email to Sales Manager
  - After 2x SLA, auto-reassign to Inside Sales queue

#### FR-001.4: Lead Qualification (BANT Framework)

- **User Story:** As a **Territory AE**, I want to qualify leads using a standardized framework so that I convert only qualified leads to opportunities.

- **Required Custom Fields:**

| Field Name | Type | Values |
|-----------|------|--------|
| Budget__c | Picklist | Not Established, <$50K, $50K-$250K, $250K-$1M, >$1M |
| Authority__c | Picklist | Influencer, Evaluator, Decision Maker, Economic Buyer |
| Need__c | Multi-Select Picklist | Hardware Refresh, Cloud Migration, Security, Cost Reduction, Other |
| Timeline__c | Picklist | Immediate, This Quarter, Next Quarter, 6+ Months, Unknown |

- **Acceptance Criteria:**
  - **Given** a rep qualifies a Lead, **When** all BANT fields are populated, **Then** the "Convert Lead" button is enabled
  - **Given** a rep converts a Lead, **When** conversion is complete, **Then** an Opportunity is created with BANT data mapped to custom fields

- **Business Rules:**
  - All BANT fields are required before Lead conversion
  - Lead Status must be "Qualified" before conversion
  - Disqualified Leads require "Disqualified Reason" (picklist)

---

### FR-002: Account & Contact Management

**Priority:** P1 - Critical (Phase 1)

#### FR-002.1: Account Hierarchy & Classification

- **User Story:** As a **Strategic AE**, I want to view parent-child account relationships so that I understand the full enterprise structure.

- **Acceptance Criteria:**
  - **Given** an Account has a parent, **When** viewing the Account, **Then** the hierarchy is displayed visually
  - **Given** an Account is part of a hierarchy, **When** viewing opportunities, **Then** I can roll up opportunities across all child accounts

- **Account Classification Fields:**

| Field Name | Type | Values | Purpose |
|-----------|------|--------|---------|
| Account_Tier__c | Picklist | Enterprise (>$500M), Mid-Market ($10M-$500M), SMB (<$10M) | Routing and pricing |
| ITAR_Controlled__c | Checkbox | True/False | Security and access control |
| Strategic_Account__c | Checkbox | True/False | Custom pricing rules |
| SAP_Customer_ID__c | Text(10) | [SAP KUNNR] | Integration key |
| Payment_Terms__c | Picklist | Net 30, Net 60, Net 90 | Quote generation |

- **Business Rules:**
  - Strategic Accounts flagged by VP of Sales only
  - ITAR accounts visible only to ITAR-certified users
  - SAP Customer ID required before Opportunity can be Closed Won

#### FR-002.2: Contact Roles & Buying Committee

- **User Story:** As a **Territory AE**, I want to track multiple contacts and their roles in the buying process so that I engage the right stakeholders.

- **Acceptance Criteria:**
  - **Given** an Opportunity exists, **When** I add Contacts, **Then** I can assign roles (Decision Maker, Influencer, Economic Buyer, Evaluator)
  - **Given** multiple Contacts are associated, **When** I view the Opportunity, **Then** I see a visual buying committee chart

- **Contact Roles (Standard Salesforce):**
  - Decision Maker
  - Economic Buyer
  - Influencer
  - Evaluator
  - Champion
  - Blocker

- **Business Rules:**
  - At least one "Decision Maker" or "Economic Buyer" required at Proposal stage
  - Primary Contact auto-populated from Lead conversion

---

### FR-003: Opportunity Management

**Priority:** P1 - Critical (Phase 1)

#### FR-003.1: Standardized Sales Process (Sales Path)

- **User Story:** As a **Territory AE**, I want guided selling with clear exit criteria for each stage so that I progress deals consistently.

- **Sales Stages:**

| Stage | Probability | Exit Criteria | Required Fields | Guidance |
|-------|-------------|---------------|-----------------|----------|
| **Qualification** | 10% | Budget confirmed, stakeholders identified | BANT fields, Next Steps | "Have you confirmed budget and identified decision makers?" |
| **Discovery** | 20% | Technical requirements documented, pain points clear | Pain_Points__c, Competitor__c | "Document customer's top 3 pain points and competitive landscape" |
| **Proposal** | 50% | Quote delivered, pricing accepted in principle | Quote attached, Decision_Date__c | "Ensure quote is delivered and customer agrees to pricing range" |
| **Negotiation** | 75% | Terms agreed, contract in legal review | Discount_Percent__c, Legal_Review__c | "Get verbal commitment and route contract for legal review" |
| **Closed Won** | 100% | Contract signed, PO received | Contract attached, PO_Number__c | "Celebrate! Now ensure smooth handoff to fulfillment" |
| **Closed Lost** | 0% | Deal lost or abandoned | Loss_Reason__c, Competitor_Won__c | "Document why we lost for future analysis" |

- **Acceptance Criteria:**
  - **Given** a rep views an Opportunity, **When** on the Opportunity page, **Then** Sales Path displays current stage with key fields and guidance
  - **Given** a rep advances a stage, **When** required fields are missing, **Then** validation error prevents stage progression
  - **Given** an Opportunity reaches Proposal, **When** no Quote is attached, **Then** system blocks stage advancement

- **Business Rules:**
  - Cannot skip stages (must progress sequentially)
  - Cannot move backward more than one stage without Manager approval
  - Closed Won requires all required fields populated
  - Closed Lost requires Loss Reason (picklist)

#### FR-003.2: Forecasting (3-Tier Model)

- **User Story:** As a **Sales Manager**, I want reps to submit weekly forecasts with commit/best case/pipeline categories so that I can provide accurate forecasts to leadership.

- **Forecast Categories:**

| Category | Criteria | Rep Action |
|----------|----------|------------|
| **Commit** | Probability ≥90%, verbal confirmation from customer | Rep explicitly marks as "Commit" |
| **Best Case** | Probability ≥50%, active proposal | Auto-included if Stage = Proposal or later |
| **Pipeline** | All open opportunities | Auto-included (all open opps) |

- **Acceptance Criteria:**
  - **Given** a rep views Forecasting tab, **When** they submit forecast, **Then** they can move opportunities between Commit/Best Case/Pipeline
  - **Given** a Manager views team forecast, **When** on Forecasting page, **Then** they see all reps' forecasts aggregated with ability to adjust
  - **Given** forecast is submitted, **When** changes occur, **Then** change history is tracked (audit trail)

- **Forecast Submission:**
  - Reps submit weekly (every Monday by 10 AM)
  - Managers review and adjust (Monday by 5 PM)
  - VPs review regional forecasts (Tuesday by 5 PM)
  - Sarah (VP Sales) reviews company forecast (Wednesday)

- **Business Rules:**
  - Only opportunities closing in current quarter are included
  - Manager can override rep's forecast category
  - Forecast changes >20% require Manager comment
  - Forecast accuracy tracked: Commit forecast vs actual bookings

#### FR-003.3: Opportunity Validation Rules

- **User Story:** As a **Sales Operations Manager**, I want data quality enforced so that reporting is accurate.

- **Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| Close Date | Must be within current or next fiscal quarter | "Close Date must be within current or next quarter. For longer-term deals, set to end of next quarter and update monthly." |
| Amount | Must be >$0 if Stage = Proposal or later | "Opportunity Amount is required at Proposal stage." |
| Next Steps | Must be populated if Stage = Qualification or Discovery | "Next Steps are required. Document what happens next." |
| Decision Date | Required if Stage = Proposal or later | "When is the customer making a decision? Required at Proposal stage." |
| SAP Customer ID | Required on Account before Closed Won | "Account must have SAP Customer ID before closing opportunity." |

- **Acceptance Criteria:**
  - **Given** a rep saves an Opportunity, **When** validation rules are violated, **Then** clear error message displays and save is blocked

---

### FR-004: Product Catalog & Pricing

**Priority:** P2 - High (Phase 2)

#### FR-004.1: Product Catalog Structure

- **User Story:** As a **Territory AE**, I want to search and add products to opportunities so that I can build accurate quotes.

- **Product Families:**

| Product Family | SKU Count | Pricing Model | Example Products |
|---------------|-----------|---------------|------------------|
| **Enterprise Hardware** | 100 SKUs | One-time | Servers ($15K-$250K), Storage ($5K-$150K), Networking ($2K-$75K) |
| **Cloud Services** | 12 SKUs | Subscription (Monthly/Annual) | Compute (5 tiers), Storage (4 tiers), Security (3 tiers) |
| **Professional Services** | 3 SKUs | Hourly/Daily | Implementation ($250/hr), Training ($1,500/day), Managed Services (retainer) |

- **Product Data Model:**
  - Standard Salesforce Product2 object
  - Custom fields: Product_Family__c, Subscription_Type__c, Service_Type__c
  - Price Books: Standard, Strategic Account (custom pricing for ~50 named accounts)

- **Acceptance Criteria:**
  - **Given** a rep adds products to an Opportunity, **When** searching, **Then** products are searchable by name, family, or SKU
  - **Given** an Account is flagged as Strategic, **When** adding products, **Then** Strategic Account price book is automatically applied

#### FR-004.2: Pricing Rules & Discounts

- **User Story:** As a **Territory AE**, I want volume discounts automatically applied so that I don't miscalculate pricing.

- **Automated Pricing Rules:**

| Rule Type | Criteria | Discount | Approval Required |
|-----------|----------|----------|-------------------|
| **Volume Discount** | 10-24 units | +5% off | No (auto-applied) |
| **Volume Discount** | 25-49 units | +8% off | No (auto-applied) |
| **Volume Discount** | 50+ units | +12% off | No (auto-applied) |
| **Bundle Discount** | Predefined bundles | +10% off | No (auto-applied) |
| **Competitive Displacement** | Displacing Dell/HP/Cisco | +10% off | Manager approval required |
| **End-of-Quarter** | Last 5 business days of quarter | Manager can approve up to 25% (vs 20%) | Manager approval |

- **Business Rules:**
  - Volume discounts stack with other discounts
  - Maximum total discount: 40% (requires CFO approval)
  - Competitive displacement requires attachment of competitive analysis document
  - End-of-quarter rule only applies if Close Date within 5 business days

---

### FR-005: Quote Generation & Approval (CPQ)

**Priority:** P2 - High (Phase 2)

#### FR-005.1: Quote Generation

- **User Story:** As a **Territory AE**, I want to generate professional quotes in PDF format so that I can send to customers quickly.

- **Quote Template Elements:**
  - Phoenix Industries branding and letterhead
  - Customer name and billing address
  - Quote number (auto-generated: Q-YYYY-####)
  - Valid for 30 days (configurable)
  - Product line items with descriptions
  - Pricing summary showing subtotal, discounts, total
  - Terms and conditions (auto-attached)
  - Signature block (manual for Phase 2, DocuSign for future)

- **Acceptance Criteria:**
  - **Given** an Opportunity has products, **When** rep clicks "Generate Quote", **Then** PDF is created within 10 seconds
  - **Given** a Quote is generated, **When** rep views Quote, **Then** they can email PDF directly to customer
  - **Given** a Quote is emailed, **When** customer clicks link, **Then** they can view and download PDF

- **Business Rules:**
  - Quote is locked once sent (cannot edit, must create new version)
  - Quote versioning: v1, v2, v3 (track all versions)
  - Only latest quote version is "Active"

#### FR-005.2: Multi-Level Approval Workflow

- **User Story:** As a **Sales Manager**, I want to approve or reject quotes on mobile so that reps aren't waiting for me to be at my desk.

- **Approval Matrix:**

| Discount Range | Approver | Max Approval Time SLA | Escalation |
|---------------|----------|----------------------|------------|
| 0-10% | Sales Rep (Self-approve) | Immediate | N/A |
| 10.01-20% | Sales Manager | 4 hours | Escalate to Regional VP |
| 20.01-30% | Regional VP | 24 hours | Escalate to VP Sales |
| 30.01-40% | VP of Sales | 48 hours | Escalate to CFO |
| >40% | CFO | 72 hours | Manual escalation |

- **Special Approval Rules:**
  - **Strategic Accounts:** ANY additional discount beyond pre-negotiated pricing requires VP approval
  - **Competitive Displacement:** Manager must approve competitive displacement discount (attach competitive analysis)
  - **End-of-Quarter:** Last 5 business days, Manager can approve up to 25% (instead of 20%)

- **Acceptance Criteria:**
  - **Given** a rep submits a quote for approval, **When** approval is needed, **Then** approver receives email and mobile push notification
  - **Given** an approver views approval request, **When** on mobile, **Then** they can approve/reject with comments
  - **Given** approval is not actioned within SLA, **When** SLA expires, **Then** request auto-escalates to next level
  - **Given** a quote is approved, **When** approval completes, **Then** rep is notified and quote status updates to "Approved"

- **Approval Request Context (Required):**
  - Customer name and account tier
  - Deal size and discount percentage
  - Competitive situation (if applicable)
  - Strategic importance (rep comment required)
  - Margin impact (Finance team visibility)

- **Business Rules:**
  - Approval requests must include rep comments (why discount is needed)
  - Approvers can approve, reject, or request more information
  - Rejected quotes require new version (cannot resubmit same quote)
  - Approval history tracked in audit trail
  - Delegated approval: Managers can delegate to another manager when out of office

---

### FR-006: Activity Management & Productivity

**Priority:** P1 - Critical (Phase 1)

#### FR-006.1: Automated Activity Logging

- **User Story:** As a **Territory AE**, I want emails and meetings automatically logged to Salesforce so that I don't spend 30 minutes/day on manual data entry.

- **Microsoft 365 Integration:**
  - **Outlook Email Sync:** Emails to/from Contacts automatically logged as Activity
  - **Calendar Sync:** Customer meetings synced as Events
  - **Salesforce Sidebar in Outlook:** View account/contact/opportunity data while reading emails

- **Acceptance Criteria:**
  - **Given** a rep sends email to a Contact, **When** email is sent, **Then** email is logged to Contact's Activity History within 5 minutes
  - **Given** a rep creates calendar event with Contact, **When** event is saved, **Then** event appears in Salesforce as an Event record
  - **Given** a rep opens Outlook, **When** viewing email from Contact, **Then** Salesforce sidebar shows Contact's account, open opportunities, and recent activities

- **Business Rules:**
  - Only emails to/from Contacts and Leads are logged (not internal emails)
  - Reps can opt-out specific emails from logging
  - Calendar events must include at least one Contact to sync
  - Einstein Activity Capture **[TBD - budget dependent]**

#### FR-006.2: Mobile Activity Management

- **User Story:** As a **Field Sales Rep**, I want to log calls and meetings from my phone so that I can update CRM in real-time.

- **Mobile Capabilities:**
  - Log calls with voice-to-text notes
  - Log meetings with pre-populated templates
  - Create follow-up tasks with one click
  - Check-in/check-out at customer location (GPS)
  - View activity history while at customer site

- **Acceptance Criteria:**
  - **Given** a rep completes customer call, **When** on mobile, **Then** they can log call in <30 seconds using voice-to-text
  - **Given** a rep is at customer site, **When** they open mobile app, **Then** app suggests nearby accounts for check-in
  - **Given** a rep logs activity, **When** saved, **Then** activity appears in web app within 5 seconds (real-time sync)

---

### FR-007: Reporting & Dashboards

**Priority:** P1 - Critical (Phase 1 - Basic), P2 - High (Phase 3 - Advanced)

#### FR-007.1: Executive Dashboard (Sarah Mitchell - VP Sales)

- **User Story:** As **VP of Sales**, I want a real-time executive dashboard so that I can see pipeline, forecast, and team performance at a glance.

- **Dashboard Components:**

**Section 1: Pipeline Overview**
- Total pipeline value by stage (funnel chart)
- Pipeline by region (bar chart)
- Pipeline by product line (pie chart)
- New pipeline created this month vs last month (trend)

**Section 2: Forecast**
- Commit vs Best Case vs Pipeline (stacked bar)
- Forecast by region (table)
- Gap to quota ($45M quarterly target)
- Week-over-week forecast changes (what moved in/out)

**Section 3: Activity Metrics**
- Calls logged per rep (weekly trend line)
- Meetings held per rep (weekly trend line)
- Average activities per opportunity
- Correlation: activities vs win rate (scatter plot)

**Section 4: Win/Loss Analysis**
- Win rate by rep, region, product (table)
- Average deal size - won vs lost (comparison)
- Sales cycle length - won vs lost (comparison)
- Top 5 reasons for lost deals (bar chart)

- **Acceptance Criteria:**
  - **Given** Sarah opens Salesforce, **When** she navigates to Executive Dashboard, **Then** all data loads within 5 seconds
  - **Given** data is displayed, **When** she clicks on a chart element, **Then** she can drill down to underlying opportunities
  - **Given** dashboard is viewed on mobile, **When** on tablet, **Then** dashboard is responsive and readable

#### FR-007.2: Sales Manager Dashboard

- **User Story:** As a **Sales Manager**, I want to see my team's performance and pipeline health so that I can coach effectively.

- **Dashboard Components:**
  - Team pipeline by rep (bar chart)
  - Stale opportunities (no activity >14 days)
  - Activities logged this week (by rep)
  - Forecast vs quota (by rep)
  - Pending approvals (quote approvals awaiting action)

#### FR-007.3: Sales Rep Dashboard

- **User Story:** As a **Territory AE**, I want to see my pipeline and tasks so that I know what to focus on today.

- **Dashboard Components:**
  - My pipeline by stage (funnel)
  - Activities due today (task list)
  - Stale opportunities (no activity >14 days)
  - Quota attainment (progress bar)
  - Team leaderboard (motivation)

#### FR-007.4: Standard Reports (Phase 1)

| Report Name | Purpose | Frequency | Recipients |
|------------|---------|-----------|------------|
| Lead Conversion Report | Track conversion rates by source and rep | Weekly | Sales Managers |
| Aging Pipeline Report | Identify deals >30 days in stage | Weekly | Sales Managers |
| Activity Report | Track calls, emails, meetings by rep | Daily | Sales Managers |
| Quote Pending Approval | Track approval bottlenecks | Daily | Sales Ops |
| Bookings Report | Daily/weekly/monthly bookings | Daily | Finance, Sales Ops |

#### FR-007.5: Automated Board Report (Phase 3)

- **User Story:** As **VP of Sales**, I want an automated monthly board report emailed on the 1st of each month so that I don't spend hours creating PowerPoint.

- **Report Content:**
  - Previous month bookings vs target
  - YTD bookings vs target
  - Top 10 deals closed (with customer names, amounts)
  - Top 10 deals in pipeline (with customer names, amounts, close dates)
  - Rep performance ranking (top 10)
  - Win/loss analysis (win rate, top loss reasons)

- **Acceptance Criteria:**
  - **Given** it is the 1st of the month, **When** report runs, **Then** PDF is emailed to Sarah by 6 AM
  - **Given** report is generated, **When** Sarah opens PDF, **Then** report is formatted for board presentation (professional branding)

---

### FR-008: Sales Contest Tracking (Phase 3)

**Priority:** P3 - Medium (Phase 3)

#### FR-008.1: Contest Dashboard & Leaderboard

- **User Story:** As a **Territory AE**, I want to see real-time contest leaderboard so that I know where I stand and stay motivated.

- **Contest Requirements (Example: "March Madness"):**
  - Track deals closed in March
  - Only deals >$100K qualify
  - Leaderboard ranked by deal count (primary), then total value (tiebreaker)
  - Real-time updates (refresh every 5 minutes)
  - Display on office TVs (public URL, no login required)

- **Acceptance Criteria:**
  - **Given** a rep closes a qualifying deal, **When** opportunity is Closed Won, **Then** leaderboard updates within 5 minutes
  - **Given** leaderboard is displayed, **When** viewed on office TV, **Then** it auto-refreshes every 5 minutes
  - **Given** contest ends, **When** final day closes, **Then** final leaderboard is emailed to all reps

- **Business Rules:**
  - Contest criteria configurable (date range, minimum deal size, product family)
  - Multiple contests can run concurrently
  - Leaderboard shows top 20 reps
  - **[CLARIFY]:** Do we need accelerated commission tracking in Salesforce, or is that handled in Finance system?

---

### FR-009: Data Migration

**Priority:** P1 - Critical (Phase 1)

#### FR-009.1: Historical Data Migration from Oracle Siebel 8.2

- **User Story:** As a **Sales Operations Manager**, I want historical data migrated from Siebel so that reps have complete account history.

- **Objects to Migrate:**

| Object | Record Count (Est.) | Historical Depth | Priority |
|--------|---------------------|------------------|----------|
| Accounts | 15,000 | All active accounts | P1 |
| Contacts | 50,000 | All active contacts | P1 |
| Opportunities | 25,000 | Last 2 years (closed + open) | P1 |
| Products | 250 | All active products | P1 |
| Activities | 500,000 | Last 1 year | P2 |
| Notes/Attachments | 100,000 | Last 1 year | P2 |

- **Data Quality Requirements:**
  - Duplicate accounts merged before migration
  - Inactive accounts flagged (not deleted)
  - Opportunity amounts validated (no $0 or negative)
  - Close dates validated (no future dates for Closed Won)

- **Acceptance Criteria:**
  - **Given** migration is complete, **When** reps search for accounts, **Then** all active accounts are searchable
  - **Given** historical opportunities exist, **When** viewing account, **Then** closed opportunities from last 2 years are visible
  - **Given** data quality issues exist, **When** migration runs, **Then** error log is generated with records that failed validation

- **Migration Approach:**
  - **Phase 1:** Accounts, Contacts, Products (go-live - 2 weeks)
  - **Phase 2:** Opportunities (go-live - 1 week)
  - **Phase 3:** Activities, Notes (post go-live)

- **Business Rules:**
  - Siebel system remains read-only for 90 days post go-live (reference only)
  - Reps cannot modify migrated data until validation complete
  - **[CLARIFY]:** Who owns data quality validation? Sales Ops or IT?

---

## 6. Integration Requirements

### INT-001: SAP S/4HANA Integration (Phase 3)

**Priority:** P1 - Critical (Phase 3)

#### INT-001.1: Salesforce → SAP (Order Creation)

- **Trigger:** When Opportunity Stage = "Closed Won"

- **Process Flow:**
```
Opportunity Closed Won → Validation (SAP Customer ID exists) → 
Call SAP API (create Sales Order) → Receive SAP Order Number → 
Update Opportunity with SAP Order Number → Send confirmation to rep
```

- **Field Mapping:**

| Salesforce Field | SAP Field | SAP Field Name | Mapping Notes |
|-----------------|-----------|----------------|---------------|
| Account.SAP_Customer_ID__c | KUNNR | Customer Number | Required - must exist in SAP |
| Account.Name | Customer Name | Customer Name | |
| Opportunity.Amount | Net Order Value | Net Value | |
| Opportunity.CloseDate + 14 days | Requested Delivery Date | Delivery Date | Add 14 days for fulfillment |
| OpportunityLineItem.Product2.ProductCode | MATNR | Material Number | SKU mapping |
| OpportunityLineItem.Quantity | Quantity | Order Quantity | |
| OpportunityLineItem.UnitPrice | Price | Net Price | After discounts |
| Account.Payment_Terms__c | ZTERM | Payment Terms | Net30, Net60, etc. |
| Account.BillingStreet | Ship-To Street | Address Line 1 | |
| Account.BillingCity | Ship-To City | City | |
| Account.BillingState | Ship-To State | State/Province | |
| Account.BillingPostalCode | Ship-To Postal Code | Postal Code | |
| Account.BillingCountry | Ship-To Country | Country | |

- **Acceptance Criteria:**
  - **Given** an Opportunity is Closed Won, **When** SAP Customer ID exists, **Then** SAP order is created within 30 seconds
  - **Given** SAP order creation succeeds, **When** order number is returned, **Then** Opportunity.SAP_Order_Number__c is updated
  - **Given** SAP order creation fails, **When** error occurs, **Then** Sales Ops team receives email alert with error details

- **Error Handling:**
  - Retry logic: 3 attempts with exponential backoff (1 min, 5 min, 15 min)
  - If all retries fail, create Case for Sales Ops team
  - Manual retry button on Opportunity page
  - Error log stored in custom object: Integration_Error_Log__c

#### INT-001.2: SAP → Salesforce (Order Status Updates)

- **Trigger:** SAP order status changes

- **Status Updates:**

| SAP Status | Salesforce Update | Fields Updated |
|-----------|-------------------|----------------|
| Order Confirmed | Opportunity.SAP_Status__c = "Confirmed" | SAP_Confirmed_Date__c |
| Shipped | Opportunity.SAP_Status__c = "Shipped" | SAP_Tracking_Number__c, SAP_Ship_Date__c |
| Delivered | Opportunity.SAP_Status__c = "Delivered" | SAP_Delivery_Date__c |
| Invoice Generated | Opportunity.SAP_Status__c = "Invoiced" | SAP_Invoice_Number__c, SAP_Invoice_Date__c |

- **Acceptance Criteria:**
  - **Given** SAP order status changes, **When** status update is sent, **Then** Salesforce is updated within 5 minutes
  - **Given** order is shipped, **When** tracking number is available, **Then** rep receives email notification with tracking link

- **Integration Architecture:**
  - Middleware: SAP CPI (Cloud Platform Integration)
  - Protocol: REST API
  - Authentication: OAuth 2.0
  - Frequency: Real-time (event-driven)

- **Business Rules:**
  - Integration runs 24/7 (no maintenance windows during business hours)
  - SAP is system of record for order status
  - If integration is down >1 hour, alert IT Director and Sales Ops

- **[CLARIFY]:** 
  - Who provides SAP API endpoints and credentials?
  - Is SAP CPI already configured, or does this need to be set up?
  - What is the rollback plan if integration fails post go-live?

---

### INT-002: Microsoft 365 Integration (Phase 1)

**Priority:** P1 - Critical (Phase 1)

#### INT-002.1: Outlook Email & Calendar Sync

- **Features:**
  - **Email-to-Salesforce:** Reps can log emails to Salesforce from Outlook
  - **Salesforce Sidebar:** View Salesforce data (account, contact, opportunities) in Outlook
  - **Calendar Sync:** Meetings with Contacts/Leads sync to Salesforce as Events

- **Acceptance Criteria:**
  - **Given** a rep sends email to Contact, **When** they click "Log to Salesforce", **Then** email is logged to Contact's Activity History
  - **Given** a rep creates calendar event with Contact, **When** event is saved, **Then** event syncs to Salesforce within 5 minutes
  - **Given** a rep opens email from Contact, **When** Salesforce sidebar loads, **Then** Contact's account, opportunities, and recent activities are displayed

- **Configuration:**
  - Salesforce Inbox (enhanced integration) **[TBD - budget dependent]**
  - OR standard Outlook integration (free, basic features)

#### INT-002.2: Microsoft Teams Integration (Future Phase)

- **Features:**
  - Salesforce app for Teams (account lookup during calls)
  - Not critical for Phase 1

---

### INT-003: ZoomInfo Data Enrichment (Future Phase)

**Priority:** P3 - Low (Future)

- **Purpose:** Auto-populate company data (revenue, employee count, industry) on Lead creation
- **Trigger:** When Lead is created with Company Name
- **Fields Updated:** Company Revenue, Employee Count, Industry, Technologies Used
- **[CLARIFY]:** Is ZoomInfo license already procured? Budget for native connector?

---

## 7. Non-Functional Requirements

### NFR-001: Performance

| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| Page Load Time | <3 seconds | 95th percentile |
| Search Results | <2 seconds | 95th percentile |
| Report Generation | <10 seconds for reports <10,000 records | Average |
| Dashboard Load | <5 seconds | 95th percentile |
| Mobile App Response | <2 seconds | 95th percentile |

- **Acceptance Criteria:**
  - **Given** 150 concurrent users, **When** accessing Salesforce, **Then** page load times meet SLA 95% of the time

### NFR-002: Security & Compliance

#### NFR-002.1: Authentication & Access Control

- **Single Sign-On (SSO):**
  - Azure AD integration (SAML 2.0)
  - MFA enforcement for all users
  - Session timeout: 8 hours
  - IP restrictions: Office IPs whitelisted, VPN required for remote access

- **Password Policy:**
  - Minimum 12 characters
  - Require complexity (uppercase, lowercase, number, symbol)
  - Password expiration: 90 days
  - No reuse of last 12 passwords

#### NFR-002.2: ITAR Compliance

- **Requirements:**
  - Custom field on Account: `ITAR_Controlled__c` (checkbox)
  - Custom field on User: `ITAR_Certified__c` (checkbox)
  - Sharing Rule: ITAR accounts visible ONLY to ITAR-certified users
  - Audit Trail: Track all access to ITAR accounts (Field History Tracking, Login History)

- **Acceptance Criteria:**
  - **Given** a non-ITAR user, **When** they search for ITAR account, **Then** account is not visible in search results
  - **Given** an ITAR-certified user, **When** they access ITAR account, **Then** access is logged in audit trail

#### NFR-002.3: Data Residency

- **Requirement:** EU customer data must be stored in EU data center (Frankfurt)
- **Salesforce Feature:** Data Residency add-on
- **Acceptance Criteria:**
  - **Given** an Account with BillingCountry = EU country, **When** data is stored, **Then** data resides in Frankfurt data center

#### NFR-002.4: Field-Level Security

| Field Category | Visible To | Hidden From |
|---------------|-----------|-------------|
| Finance Fields (Margin, Cost) | Finance, VP Sales, CFO | All other users |
| ITAR Fields | ITAR-certified users | Non-ITAR users |
| Discount Approvals | Managers and above | Reps |
| SAP Integration Fields | IT, Sales Ops | Reps |

### NFR-003: Scalability

- **User Capacity:** Support 150 concurrent users (with growth to 200 in next 2 years)
- **Data Volume:**
  - 10,000 new leads per month
  - 5,000 new opportunities per month
  - 5 years of historical data (rolling archive)
- **Storage:** Estimate 50 GB (data + files)

- **Acceptance Criteria:**
  - **Given** 150 concurrent users, **When** all users are active, **Then** system performance does not degrade

### NFR-004: Availability

- **Uptime SLA:** 99.9% during business hours (6 AM - 8 PM local time, all regions)
- **Planned Maintenance:** Weekends only (Saturday 2 AM - 6 AM)
- **Disaster Recovery:** Salesforce standard (RPO: 4 hours, RTO: 24 hours)

- **Business Rules:**
  - No planned maintenance during month-end (last 5 business days)
  - No planned maintenance during Q4 (peak sales season)

### NFR-005: Mobile Support

- **Platforms:** iOS (14+), Android (10+)
- **Devices:** iPhone, iPad, Android phones, Android tablets
- **Offline Access:** View-only for accounts, contacts, opportunities (no offline editing in Phase 1)

- **Acceptance Criteria:**
  - **Given** a rep has no network connection, **When** they open mobile app, **Then** they can view recently accessed records (cached)

### NFR-006: Usability & Training

- **Training Plan:**
  - **Reps:** 2-3 hours hands-on training (in-person or virtual)
  - **Managers:** 4 hours (advanced features: forecasting, dashboards, approvals)
  - **Executives:** 1 hour (dashboard overview)
  - **Champions:** Train-the-trainer (5 champions per region)

- **Training Materials:**
  - Video tutorials (5-10 min each)
  - Quick reference guides (PDF)
  - In-app help text and tooltips
  - Weekly "Tip of the Week" emails (first 8 weeks post go-live)

- **Acceptance Criteria:**
  - **Given** training is complete, **When** surveyed, **Then** 80% of users rate training as "Good" or "Excellent"
  - **Given** go-live occurs, **When** 30 days post go-live, **Then** 90% of users have logged in at least once

---

## 8. Data Requirements

### 8.1 Custom Objects

| Object API Name | Purpose | Key Fields | Relationships |
|----------------|---------|------------|---------------|
| Territory__c | Territory definitions | Name, Region_Code__c, States__c, Countries__c | Lookup to User (Territory Owner) |
| Integration_Error_Log__c | Track SAP integration errors | Error_Message__c, Opportunity__c, Retry_Count__c, Resolved__c | Lookup to Opportunity |
| Sales_Contest__c | Track sales contests | Name, Start_Date__c, End_Date__c, Min_Deal_Size__c, Active__c | N/A |
| Contest_Participant__c | Track rep participation in contests | User__c, Sales_Contest__c, Deal_Count__c, Total_Value__c, Rank__c | Lookup to User, Sales_Contest |

### 8.2 Custom Fields (Key Examples)

**Account Custom Fields:**
| Field API Name | Type | Purpose |
|---------------|------|---------|
| Account_Tier__c | Picklist | Enterprise, Mid-Market, SMB |
| ITAR_Controlled__c | Checkbox | ITAR compliance flag |
| Strategic_Account__c | Checkbox | Custom pricing flag |
| SAP_Customer_ID__c | Text(10) | SAP integration key |
| Payment_Terms__c | Picklist | Net 30, Net 60, Net 90 |

**Lead Custom Fields:**
| Field API Name | Type | Purpose |
|---------------|------|---------|
| Lead_Score__c | Number(3,0) | 1-100 score (calculated) |
| Budget__c | Picklist | BANT - Budget |
| Authority__c | Picklist | BANT - Authority |
| Need__c | Multi-Select Picklist | BANT - Need |
| Timeline__c | Picklist | BANT - Timeline |

**Opportunity Custom Fields:**
| Field API Name | Type | Purpose |
|---------------|------|---------|
| Pain_Points__c | Long Text Area | Document customer pain points |
| Competitor__c | Picklist | Primary competitor |
| Loss_Reason__c | Picklist | Why deal was lost |
| Competitor_Won__c | Picklist | Which competitor won |
| Decision_Date__c | Date | Customer decision date |
| Discount_Percent__c | Percent | Total discount applied |
| Legal_Review__c | Checkbox | Contract in legal review |
| PO_Number__c | Text(20) | Customer PO number |
| SAP_Order_Number__c | Text(10) | SAP order number |
| SAP_Status__c | Picklist | SAP order status |
| SAP_Tracking_Number__c | Text(30) | Shipment tracking |
| SAP_Invoice_Number__c | Text(10) | SAP invoice number |

**User Custom Fields:**
| Field API Name | Type | Purpose |
|---------------|------|---------|
| ITAR_Certified__c | Checkbox | ITAR access control |
| Territory__c | Lookup(Territory__c) | Territory assignment |
| Quota__c | Currency | Quarterly quota |

### 8.3 Data Migration Plan

**Phase 1: Pre-Go-Live (2 weeks before July 1)**
- Accounts (15,000 records)
- Contacts (50,000 records)
- Products (250 records)
- Price Books (2: Standard, Strategic)

**Phase 2: Pre-Go-Live (1 week before July 1)**
- Opportunities - Closed Won (last 2 years: ~10,000 records)
- Opportunities - Closed Lost (last 2 years: ~8,000 records)
- Opportunities - Open (current: ~7,000 records)

**Phase 3: Post-Go-Live (July - August)**
- Activities (last 1 year: ~500,000 records)
- Notes and Attachments (last 1 year: ~100,000 records)

**Data Quality Rules:**
- Remove duplicates (merge in Siebel before export)
- Validate required fields (Account Name, Close Date, Amount)
- Standardize picklist values (map Siebel values to Salesforce)
- Archive inactive records (flag as Inactive, don't delete)

**[CLARIFY]:**
- Who owns data cleansing in Siebel before export?
- What is the rollback plan if migration fails?
- How long will Siebel remain accessible post go-live?

### 8.4 Data Retention & Archival

- **Active Data:** Last 5 years in Salesforce
- **Archived Data:** >5 years archived to external storage (Big Objects or external data warehouse)
- **Deletion Policy:** No automatic deletion (archive only)

---

## 9. Assumptions & Dependencies

### 9.1 Assumptions

| ID | Assumption | Impact if False | Owner |
|----|-----------|----------------|-------|
| A-001 | Phoenix Industries has 150 Sales Cloud licenses procured | Project cannot start | Finance |
| A-002 | SAP S/4HANA APIs are available and documented | Phase 3 delayed | IT - Jennifer |
| A-003 | Azure AD SSO is already configured for other apps | SSO setup delayed | IT - Jennifer |
| A-004 | ZoomInfo integration is out of scope for Phase 1 | No impact (future phase) | Sales Ops - David |
| A-005 | Reps have iOS or Android devices (no Blackberry/Windows Phone) | Mobile rollout limited | Sales Ops - David |
| A-006 | Data migration from Siebel is one-time (no ongoing sync) | Cutover complexity | IT - Jennifer |
| A-007 | DocuSign integration is Phase 2 (manual signatures OK for Phase 1) | No impact (accepted) | Sales - Sarah |
| A-008 | Sales Ops team will handle data cleansing in Siebel before migration | Migration quality issues | Sales Ops - David |
| A-009 | Training will be virtual (no in-person travel budget) | Training effectiveness | Sales - Sarah |
| A-010 | Salesforce CPQ (not custom Apex quoting) is acceptable | CPQ complexity | Sales - Sarah |

### 9.2 Dependencies

| ID | Dependency | Required By | Owner | Status |
|----|-----------|-------------|-------|--------|
| D-001 | SAP integration specs and API documentation | Phase 3 kickoff | IT - Jennifer | **PENDING** |
| D-002 | Territory maps and rep assignments | Lead routing config | Sales Ops - David | **PENDING** (Due March 5) |
| D-003 | Strategic Account list (~50 accounts) | Custom price book setup | Sales - Sarah | **PENDING** |
| D-004 | Product catalog with SKUs and pricing | Product setup | Sales Ops - David | **PENDING** |
| D-005 | Siebel data export (accounts, contacts, opportunities) | Data migration | IT - Jennifer | **PENDING** |
| D-006 | Azure AD SSO configuration | User provisioning | IT - Jennifer | **PENDING** |
| D-007 | ITAR-certified user list | Security setup | Sales - Sarah | **PENDING** |
| D-008 | Quote template branding (logo, letterhead) | CPQ template design | Marketing | **PENDING** |
| D-009 | Budget approval for Salesforce CPQ licenses | Phase 2 kickoff | Finance - CFO | **PENDING** (Due March 8) |
| D-010 | User Acceptance Testing (UAT) participants (10 reps) | UAT phase | Sales Ops - David | **PENDING** |

---

## 10. Risks & Mitigations

| Risk ID | Risk Description | Impact | Likelihood | Mitigation Strategy | Owner |
|---------|-----------------|--------|------------|---------------------|-------|
| R-001 | **Aggressive timeline** - 4 months to go-live is tight | High | High | Phased rollout (Phase 1: Core, Phase 2: CPQ, Phase 3: SAP). Prioritize ruthlessly. | PM |
| R-002 | **Data migration complexity** - Siebel data quality unknown | High | Medium | Data quality audit in Siebel (March). Dedicate Sales Ops resource for data cleansing. Plan for 2-week buffer. | IT - Jennifer |
| R-003 | **SAP integration delays** - API specs not yet available | High | Medium | Start Phase 3 planning early (April). Have fallback: manual SAP order entry for first month. | IT - Jennifer |
| R-004 | **User adoption resistance** - Reps resistant to change | High | High | Change management: Champions program, weekly tips, gamification (leaderboards), executive sponsorship (Sarah). | Sales Ops - David |
| R-005 | **Scope creep** - Stakeholders request additional features mid-project | Medium | High | Strict change control process. Document out-of-scope items for future phases. Weekly steering committee. | PM |
| R-006 | **ITAR compliance failure** - Security rules not properly configured | High | Low | Security review by IT Security team. UAT with ITAR-certified users. Audit trail testing. | IT - Jennifer |
| R-007 | **Mobile app adoption low** - Reps don't use mobile features | Medium | Medium | Hands-on mobile training. Mobile champions in each region. Track mobile usage metrics. | Sales Ops - David |
| R-008 | **CPQ approval workflow bottlenecks** - Approvers don't respond in time | Medium | Medium | Mobile approval training. SLA monitoring. Escalation alerts. Delegated approval when out of office. | Sales - Sarah |
| R-009 | **Forecast accuracy not improving** - Still <85% after 6 months | Medium | Medium | Weekly forecast reviews. Manager coaching on forecast hygiene. Incentivize forecast accuracy. | Sales - Sarah |
| R-010 | **Budget overrun** - $450K insufficient for full scope | High | Low | Detailed SOW with fixed pricing. Phase 2/3 contingent on Phase 1 success. Reserve 10% budget for contingency. | Finance - CFO |

---

## 11. Open Questions

### Business Questions

| ID | Question | Stakeholder | Priority | Status |
|----|----------|------------|----------|--------|
| Q-001 | What is the exact list of 50 Strategic Accounts for custom pricing? | Sarah Mitchell | High | **OPEN** |
| Q-002 | Do sales quotas need to be tracked in Salesforce, or only in Finance system? | Sarah Mitchell | Medium | **OPEN** |
| Q-003 | Is Customer Success team using Salesforce, or separate system? (Lisa Wang attended kickoff but no requirements captured) | Lisa Wang | Medium | **OPEN** |
| Q-004 | What is the process for handling renewals and upsells? (Not mentioned in requirements) | Sarah Mitchell | Medium | **OPEN** |
| Q-005 | Are there any compliance requirements beyond ITAR (e.g., GDPR, CCPA, HIPAA)? | Jennifer Rodriguez | High | **OPEN** |
| Q-006 | What is the rollback plan if go-live fails? How long will Siebel remain accessible? | Jennifer Rodriguez | High | **OPEN** |

### Technical Questions

| ID | Question | Stakeholder | Priority | Status |
|----|----------|------------|----------|--------|
| Q-007 | Are SAP CPI and API endpoints already configured, or does this need to be set up? | Jennifer Rodriguez | High | **OPEN** |
| Q-008 | What is the SAP integration authentication method (OAuth, API Key, SAML)? | Jennifer Rodriguez | High | **OPEN** |
| Q-009 | Is ZoomInfo license already procured? Budget for native connector vs custom API? | David Chen | Medium | **OPEN** |
| Q-010 | Do we need Einstein Activity Capture (auto-log emails) or is basic Outlook integration sufficient? | David Chen | Medium | **OPEN** |
| Q-011 | Do we need Salesforce Inbox (enhanced Outlook integration) or standard integration? | David Chen | Medium | **OPEN** |
| Q-012 | What is the plan for sandbox environments (Dev, UAT, Staging)? | Jennifer Rodriguez | High | **OPEN** |

### Data Migration Questions

| ID | Question | Stakeholder | Priority | Status |
|----|----------|------------|----------|--------|
| Q-013 | Who owns data cleansing in Siebel before export (IT or Sales Ops)? | David Chen / Jennifer Rodriguez | High | **OPEN** |
| Q-014 | What is the acceptable data loss/error rate during migration (e.g., 1%, 5%)? | Sarah Mitchell | High | **OPEN** |
| Q-015 | Are there any custom objects in Siebel that need to be migrated beyond standard CRM objects? | Jennifer Rodriguez | Medium | **OPEN** |

### Training & Change Management Questions

| ID | Question | Stakeholder | Priority | Status |
|----|----------|------------|----------|--------|
| Q-016 | Is training budget approved for virtual training platform (e.g., Zoom, WebEx)? | Sarah Mitchell | Medium | **OPEN** |
| Q-017 | Who will be the 5 regional champions for train-the-trainer program? | David Chen | Medium | **OPEN** |
| Q-018 | What is the communication plan for announcing go-live to reps? | Sarah Mitchell | Medium | **OPEN** |

---

## 12. Success Criteria & Acceptance

### 12.1 Phase 1 Go-Live Criteria (July 1, 2026)

**System Readiness:**
- ✅ All 150 users provisioned with SSO working
- ✅ Data migration complete (Accounts, Contacts, Opportunities, Products)
- ✅ Lead routing rules tested and working
- ✅ Mobile app deployed to all reps
- ✅ Microsoft 365 integration working (email/calendar sync)
- ✅ Executive dashboard live with real data
- ✅ UAT sign-off from 10 rep testers

**User Readiness:**
- ✅ 100% of users trained (2-3 hours)
- ✅ Champions trained (train-the-trainer complete)
- ✅ Quick reference guides distributed

**Business Readiness:**
- ✅ Siebel set to read-only (no new data entry)
- ✅ Go-live communication sent to all reps
- ✅ Hypercare support plan in place (24/7 for first week)

### 12.2 Success Metrics (6 Months Post Go-Live)

| Metric | Target | Measurement |
|--------|--------|-------------|
| User Adoption | 90% daily active users | Login analytics |
| Lead Response Time | <1 hour for hot leads | Lead Created → First Activity |
| Sales Cycle Reduction | 90 days → 68 days (-25%) | Opportunity Created → Close Date |
| Pipeline Accuracy | 85% | Forecast vs Actual (monthly) |
| Rep Admin Time | 3 hrs/day → 1 hr/day | Weekly rep survey |
| Quote Turnaround | 3.5 days → 0.5 days | Quote Created → Approved |

### 12.3 Project Sign-Off

**Phase 1 Sign-Off Required From:**
- [ ] Sarah Mitchell (VP of Sales) - Business acceptance
- [ ] David Chen (Sales Operations) - Operational readiness
- [ ] Jennifer Rodriguez (IT Director) - Technical acceptance
- [ ] UAT Lead - User acceptance testing complete
- [ ] Implementation Partner - Deliverables complete

---

## 13. Next Steps & Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Provide territory maps and rep assignments | David Chen | March 5, 2026 | **PENDING** |
| Provide SAP integration specs and API docs | Jennifer Rodriguez | March 5, 2026 | **PENDING** |
| Confirm budget approval ($450K) | Sarah Mitchell | March 8, 2026 | **PENDING** |
| Provide Strategic Account list (50 accounts) | Sarah Mitchell | March 10, 2026 | **PENDING** |
| Provide ITAR-certified user list | Sarah Mitchell | March 10, 2026 | **PENDING** |
| Review and approve BRD | Sarah Mitchell | March 15, 2026 | **PENDING** |
| Finalize SOW with implementation partner | David Chen | March 20, 2026 | **PENDING** |
| Identify 10 UAT participants | David Chen | March 20, 2026 | **PENDING** |
| Identify 5 regional champions for training | David Chen | March 25, 2026 | **PENDING** |
| Kickoff Phase 1 implementation | Implementation Partner | March 22, 2026 | **PENDING** |

---

## 14. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **BANT** | Budget, Authority, Need, Timeline - Lead qualification framework |
| **CPQ** | Configure, Price, Quote - Salesforce quoting tool |
| **ITAR** | International Traffic in Arms Regulations - Export control compliance |
| **SAP S/4HANA** | SAP's ERP system (current version) |
| **Siebel** | Oracle CRM system (legacy, being replaced) |
| **SSO** | Single Sign-On - Login with Azure AD credentials |
| **MFA** | Multi-Factor Authentication - Security requirement |
| **SLA** | Service Level Agreement - Response time requirement |
| **UAT** | User Acceptance Testing - Testing by end users before go-live |

### Appendix B: Document References

- Client Requirements Document (client_requirements_document.md)
- Kickoff Meeting Transcript (kickoff_meeting_transcript.md)
- Stakeholder Email Thread (stakeholder_emails.md)
- Territory Maps (PENDING from David Chen)
- SAP Integration Specs (PENDING from Jennifer Rodriguez)
- Product Catalog (PENDING from David Chen)

### Appendix C: Contact Information

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Project Sponsor | Sarah Mitchell | s.mitchell@phoenix-industries.com | [TBD] |
| Sales Ops Manager | David Chen | d.chen@phoenix-industries.com | [TBD] |
| IT Director | Jennifer Rodriguez | j.rodriguez@phoenix-industries.com | [TBD] |
| Field Sales Rep | Mark Thompson | m.thompson@phoenix-industries.com | [TBD] |
| Customer Success | Lisa Wang | [TBD] | [TBD] |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Project Sponsor** | Sarah Mitchell | | |
| **IT Director** | Jennifer Rodriguez | | |
| **Sales Ops Manager** | David Chen | | |
| **Implementation Partner** | [TBD] | | |

---

**END OF DOCUMENT**

---

*This Business Requirements Document is a living document. All changes must be tracked via version control and approved by the Project Sponsor (Sarah Mitchell). For questions or clarifications, contact the implementation team.*