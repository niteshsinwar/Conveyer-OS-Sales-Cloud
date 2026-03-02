# Phoenix Industries - Sales Operations Requirements Document
**Document Version:** 1.0
**Prepared by:** David Chen, Sales Operations Manager
**Date:** March 1, 2026
**Status:** DRAFT - For Salesforce Implementation Team Review

---

## Executive Summary

Phoenix Industries is undertaking a strategic initiative to modernize our sales operations by implementing Salesforce Sales Cloud. This document outlines the detailed business requirements gathered from key stakeholders across Sales, IT, Finance, and Customer Success teams.

Our current CRM (Oracle Siebel 8.2) has reached end-of-life and no longer meets our business needs. Key drivers for this change include:
- Lack of mobile capabilities for our field sales team
- Manual, error-prone quote approval processes
- No real-time pipeline visibility
- Poor integration capabilities with modern systems

**Target Go-Live:** July 1, 2026 (coinciding with FY27 start)
**Budget:** $450,000 (approved by CFO)
**Executive Sponsor:** Sarah Mitchell, VP of Sales

---

## Current State Analysis

### Sales Team Structure

| Role | Headcount | Primary Responsibilities |
|------|-----------|-------------------------|
| VP of Sales | 1 | Strategy, forecasting, major deals |
| Regional VP | 4 | Regional targets, team management |
| Sales Manager | 12 | Pipeline reviews, coaching, approvals |
| Strategic Account Executive | 8 | Enterprise accounts (>$500M revenue) |
| Territory Account Executive | 85 | Mid-market territory coverage |
| Inside Sales Rep | 40 | Lead qualification, SMB accounts |
| **Total** | **150** | |

### Key Performance Metrics (Current State)

| Metric | Current | Target (Post-Go-Live) |
|--------|---------|----------------------|
| Average Sales Cycle | 90 days | 68 days (-25%) |
| Lead Response Time | 18 hours | 1 hour (hot leads) |
| Quote Turnaround | 3.5 days | 0.5 days |
| Pipeline Accuracy | 65% | 85% |
| Rep Admin Time | 3 hrs/day | 1 hr/day |

---

## Functional Requirements

### FR-001: Lead Management

**Priority:** P1 - Critical

#### FR-001.1: Lead Capture
- **Requirement:** Automatically capture leads from multiple sources
- **Sources:**
  - Website form submissions (via Marketing Cloud connector)
  - Trade show badge scans (CSV import)
  - Partner referrals (via Partner Community)
  - Manual entry by Inside Sales
- **Acceptance Criteria:**
  - Leads created within 5 seconds of form submission
  - Duplicate detection with 95% accuracy
  - Auto-populate company data via data enrichment (ZoomInfo)

#### FR-001.2: Lead Qualification
- **Requirement:** Implement BANT qualification framework
- **Fields Required:**
  - Budget: Picklist (Not Established, <$50K, $50K-$250K, $250K-$1M, >$1M)
  - Authority: Picklist (Influencer, Evaluator, Decision Maker, Economic Buyer)
  - Need: Multi-select (Hardware Refresh, Cloud Migration, Security, Cost Reduction, Other)
  - Timeline: Picklist (Immediate, This Quarter, Next Quarter, 6+ Months, Unknown)
- **Scoring:** Leads scored 1-100 based on weighted criteria (see Appendix A)

#### FR-001.3: Lead Routing
- **Requirement:** Automated lead assignment within defined SLAs
- **Rules:**
  | Lead Score | Lead Type | Route To | SLA |
  |-----------|-----------|----------|-----|
  | 70+ | Any | Senior AE in territory | 1 hour |
  | 40-69 | Enterprise | Strategic Account team | 2 hours |
  | 40-69 | Other | Territory AE | 4 hours |
  | <40 | Any | Inside Sales Queue | 24 hours |
  | ITAR Flag | Any | ITAR Certified Team Only | 4 hours |

### FR-002: Opportunity Management

**Priority:** P1 - Critical

#### FR-002.1: Sales Process
- **Requirement:** Implement standardized sales stages
- **Stages:**
  | Stage | Probability | Exit Criteria | Required Fields |
  |-------|-------------|---------------|-----------------|
  | Qualification | 10% | Budget confirmed, stakeholders identified | BANT fields, Next Steps |
  | Discovery | 20% | Technical requirements documented | Pain Points, Competition |
  | Proposal | 50% | Quote delivered, pricing accepted | Quote attached, Decision Date |
  | Negotiation | 75% | Terms agreed, contract in review | Discount %, Legal Review |
  | Closed Won | 100% | Contract signed, PO received | Contract attached, PO Number |
  | Closed Lost | 0% | Deal lost or abandoned | Loss Reason, Competitor |

#### FR-002.2: Forecasting
- **Requirement:** Implement 3-tier forecasting model
- **Categories:**
  - **Commit:** 90%+ probability, verbal confirmation from customer
  - **Best Case:** 50%+ probability, active proposal
  - **Pipeline:** All open opportunities
- **Functionality:**
  - Weekly forecast submission by each rep
  - Manager ability to adjust rep forecasts
  - VP view of all forecasts by region
  - Forecast change tracking (audit trail)

### FR-003: Quote-to-Cash

**Priority:** P1 - Critical

#### FR-003.1: Product Configuration
- **Requirement:** Configure product catalog with pricing rules
- **Products:**
  - ~250 SKUs across 3 product families
  - Hardware products with one-time pricing
  - Cloud services with subscription (monthly/annual)
  - Professional services with hourly/daily rates
- **Pricing Rules:**
  - Volume discounts (auto-applied)
  - Bundle discounts (predefined bundles)
  - Strategic account pricing (custom price books)

#### FR-003.2: Quote Approval
- **Requirement:** Multi-level approval workflow (see Sarah's email for matrix)
- **Features:**
  - Email notification to approvers
  - Mobile approval capability
  - Escalation if not approved within SLA
  - Audit trail of all approvals/rejections

#### FR-003.3: Quote Generation
- **Requirement:** Professional quote document generation
- **Template Elements:**
  - Company branding and letterhead
  - Customer information
  - Product line items with descriptions
  - Pricing summary with discounts shown
  - Terms and conditions
  - Signature block (DocuSign integration for Phase 2)
- **Outputs:** PDF export, email delivery

### FR-004: Integration Requirements

**Priority:** P1 - Critical (SAP), P2 - High (Others)

#### FR-004.1: SAP S/4HANA Integration
- **Requirement:** Real-time bi-directional integration
- **Salesforce → SAP:** On Opportunity Close-Won, create Sales Order
- **SAP → Salesforce:** Order status updates, shipment tracking, invoice data
- **Error Handling:** Retry logic, admin alerts, manual retry capability
- **See Jennifer's email for detailed field mapping**

#### FR-004.2: Microsoft 365 Integration
- **Requirement:** Outlook and Calendar sync
- **Features:**
  - Email sidebar showing Salesforce data
  - Log emails to Salesforce records
  - Calendar sync for customer meetings
  - Einstein Activity Capture (if budget allows)

---

## Non-Functional Requirements

### NFR-001: Performance
- Page load time: <3 seconds
- Search results: <2 seconds
- Report generation: <10 seconds for reports <10,000 records

### NFR-002: Security
- SSO integration with Azure AD
- MFA enforcement for all users
- Data residency: EU data in Frankfurt region
- ITAR compliance (see Jennifer's email)

### NFR-003: Scalability
- Support 150 concurrent users
- Handle 10,000 new leads per month
- Store 5 years of historical data

### NFR-004: Availability
- 99.9% uptime during business hours (6 AM - 8 PM local time)
- Planned maintenance during weekends only

---

## Reporting Requirements

### Executive Dashboard (see Sarah's detailed requirements)
1. Pipeline Overview (funnel, by region, by product)
2. Forecast vs Actual
3. Activity Metrics (calls, meetings by rep)
4. Win/Loss Analysis

### Operational Reports
1. Lead Conversion Report (by source, by rep)
2. Aging Pipeline Report (deals >30 days in stage)
3. Activity Report (calls, emails, meetings)
4. Quote Pending Approval Report

### Financial Reports
1. Bookings Report (daily, weekly, monthly)
2. Average Deal Size Trend
3. Discount Analysis by Rep/Region
4. Revenue Forecast

---

## Appendix A: Lead Scoring Model

| Criterion | Weight | Score Values |
|-----------|--------|--------------|
| Company Size | 40% | Enterprise: 100, Mid-Market: 60, SMB: 25 |
| Product Interest | 30% | Hardware: 100, Cloud: 85, Services: 50 |
| Lead Source | 20% | Referral: 100, Demo: 85, Trade Show: 70, Webinar: 50, Content: 30, List: 10 |
| Engagement | 10% | Multiple pages: 100, Single page: 50 |

**Formula:** Final Score = (Size × 0.4) + (Product × 0.3) + (Source × 0.2) + (Engagement × 0.1)

---

## Appendix B: Territory Definitions

*See David's email for complete territory mapping*

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Sponsor | Sarah Mitchell | | |
| IT Director | Jennifer Rodriguez | | |
| Sales Ops Manager | David Chen | | |
| Implementation Partner | | | |

---

*Document Control: This is a living document. All changes must be tracked and approved by the Project Sponsor.*
