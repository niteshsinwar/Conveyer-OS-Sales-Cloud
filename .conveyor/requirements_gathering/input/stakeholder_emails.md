# Stakeholder Email Thread - Phoenix Industries Salesforce Project

---

## Email 1: Initial Requirements from Sales Operations

**From:** David Chen <d.chen@phoenix-industries.com>
**To:** Salesforce Implementation Team
**CC:** Sarah Mitchell, Jennifer Rodriguez
**Date:** March 3, 2026 9:15 AM
**Subject:** RE: Territory Assignment Rules and Lead Routing Requirements

Hi Team,

Following up from our kickoff meeting, here are the detailed territory assignment rules we need implemented:

### Territory Structure

**United States (10 Regions):**
| Region Code | Name | States |
|------------|------|--------|
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

**International:**
| Region Code | Name | Countries |
|------------|------|-----------|
| UK | United Kingdom | UK, Ireland |
| DE | Germany/DACH | Germany, Austria, Switzerland |
| FR | France | France, Belgium, Netherlands |

### Lead Scoring Model

We need leads scored on a 1-100 scale based on:
- **Company Size (40 points max):**
  - Enterprise (>$500M): 40 points
  - Mid-Market ($10M-$500M): 25 points
  - SMB (<$10M): 10 points

- **Product Interest (30 points max):**
  - Enterprise Hardware: 30 points
  - Cloud Services: 25 points
  - Professional Services: 15 points
  - Unknown/General: 5 points

- **Lead Source (30 points max):**
  - Customer Referral: 30 points
  - Inbound Demo Request: 25 points
  - Trade Show: 20 points
  - Webinar: 15 points
  - Content Download: 10 points
  - Purchased List: 5 points

**Routing Rules:**
- Score >= 70: Route to Senior AE in territory (response SLA: 1 hour)
- Score 40-69: Route to Territory AE (response SLA: 4 hours)
- Score < 40: Route to Inside Sales team for qualification (response SLA: 24 hours)
- Any lead with "ITAR" or "Government" in company name: Route to Strategic Accounts team only

Let me know if you need any clarification.

Best,
David

---

## Email 2: CPQ Requirements from Sales Leadership

**From:** Sarah Mitchell <s.mitchell@phoenix-industries.com>
**To:** Salesforce Implementation Team
**CC:** David Chen, Finance Team
**Date:** March 4, 2026 2:30 PM
**Subject:** Quote Approval Workflow and Pricing Requirements

Team,

I wanted to document our CPQ requirements in detail. This is critical for us because inconsistent discounting has cost us significant margin over the past year.

### Product Catalog Structure

We have approximately 250 SKUs across three product lines:

**1. Enterprise Hardware**
- Servers (25 SKUs) - Price range: $15,000 - $250,000
- Storage (40 SKUs) - Price range: $5,000 - $150,000
- Networking (35 SKUs) - Price range: $2,000 - $75,000

**2. Cloud Services (Subscription)**
- Compute (5 tiers) - Monthly: $500 - $25,000
- Storage (4 tiers) - Monthly: $200 - $10,000
- Security (3 tiers) - Monthly: $1,000 - $15,000

**3. Professional Services**
- Implementation - $250/hour
- Training - $1,500/day
- Managed Services - Monthly retainer packages

### Discount Approval Matrix

| Discount Range | Approver | Max Approval Time |
|---------------|----------|-------------------|
| 0-10% | Sales Rep (Self-approve) | Immediate |
| 10.01-20% | Sales Manager | 4 hours |
| 20.01-30% | Regional VP | 24 hours |
| 30.01-40% | VP of Sales (me) | 48 hours |
| >40% | CFO | 72 hours |

### Special Pricing Rules

1. **Volume Discounts** (automatic, no approval needed):
   - 10+ units: Additional 5% off
   - 25+ units: Additional 8% off
   - 50+ units: Additional 12% off

2. **Strategic Account Pricing:**
   - Named accounts (we'll provide a list of ~50 accounts) get pre-negotiated pricing
   - These require VP approval for ANY additional discount

3. **Competitive Displacement:**
   - If displacing Dell, HP, or Cisco - additional 10% discretionary (manager approval)
   - Must document competitor and attach competitive analysis

4. **End-of-Quarter Deals:**
   - Last week of quarter: Manager can approve up to 25% (instead of 20%)
   - Must close within 5 business days

### Quote Document Requirements

Generated quotes must include:
- Professional letterhead with Phoenix Industries branding
- Valid for 30 days (configurable)
- Terms and conditions auto-attached
- Electronic signature capability
- PDF export for email
- Link for online acceptance

Please ensure approval requests include full context - deal size, customer name, competitive situation, and strategic importance. I don't want to see approval requests that just say "customer asked for discount."

Thanks,
Sarah

---

## Email 3: Technical Integration Requirements from IT

**From:** Jennifer Rodriguez <j.rodriguez@phoenix-industries.com>
**To:** Salesforce Implementation Team
**CC:** SAP Admin Team, Security Team
**Date:** March 5, 2026 10:45 AM
**Subject:** SAP S/4HANA Integration Specifications and Security Requirements

Hello,

Here are the detailed technical requirements for our SAP integration and security compliance needs.

### SAP S/4HANA Integration

**Integration Architecture:** We need a real-time, bi-directional integration using SAP CPI (Cloud Platform Integration) as the middleware layer.

**Salesforce → SAP (Closed-Won Trigger):**

When Opportunity Stage = "Closed Won", create Sales Order in SAP with:

| Salesforce Field | SAP Field | Mapping Notes |
|-----------------|-----------|---------------|
| Account.Name | Customer Name | |
| Account.SAP_Customer_ID__c | KUNNR | Required - must exist in SAP |
| Opportunity.Amount | Net Order Value | |
| Opportunity.CloseDate | Requested Delivery Date | Add 14 days for delivery |
| OpportunityLineItem.Product2.ProductCode | MATNR | Material number |
| OpportunityLineItem.Quantity | Quantity | |
| OpportunityLineItem.UnitPrice | Price | Net price after discounts |
| Account.Payment_Terms__c | ZTERM | Net30, Net60, etc. |
| Account.BillingAddress | Ship-To Address | Full address mapping |

**SAP → Salesforce (Order Status Updates):**

We need order status to flow back for visibility:
- Order Confirmed → Update Opportunity custom field
- Shipped → Update with tracking number
- Delivered → Update delivery date
- Invoice Generated → Update with invoice number

**Error Handling:**
- If SAP order creation fails, send alert to Sales Ops team
- Retry logic: 3 attempts with exponential backoff
- Manual retry capability from Salesforce

### Security & Compliance Requirements

**ITAR Compliance:**
- Custom field on Account: `ITAR_Controlled__c` (checkbox)
- Custom field on User: `ITAR_Certified__c` (checkbox)
- Record-level sharing rule: ITAR accounts only visible to ITAR-certified users
- Audit trail for all ITAR account access

**Data Residency:**
- EU customer data must be stored in EU data center (Frankfurt)
- We need Data Residency enabled on the org

**Single Sign-On:**
- Integrate with Azure AD for SSO
- Enforce MFA for all users
- Session timeout: 8 hours

**Password Policy:**
- Minimum 12 characters
- Require complexity (upper, lower, number, symbol)
- Password expiration: 90 days
- No reuse of last 12 passwords

**Field-Level Security:**
- Finance fields (margin, cost) visible only to Finance and Leadership profiles
- ITAR fields visible only to ITAR-certified users

### Microsoft 365 Integration

**Outlook Integration:**
- Email-to-Salesforce for logging correspondence
- Calendar sync for customer meetings → Activities
- Einstein Activity Capture if budget allows

**Teams Integration:**
- Salesforce app for Teams (for account lookup during calls)
- Not critical for Phase 1

Let me know if you need the API endpoints for our SAP system. I'll coordinate with our SAP admin team to set up the necessary RFC connections.

Regards,
Jennifer

---

## Email 4: Field Sales Perspective

**From:** Mark Thompson <m.thompson@phoenix-industries.com>
**To:** Salesforce Implementation Team
**CC:** David Chen
**Date:** March 5, 2026 4:20 PM
**Subject:** Field Rep Wish List and Mobile Requirements

Hey team,

David asked me to share some thoughts from the field sales perspective. I've also collected input from a few other senior reps.

### Day-in-the-Life Pain Points

**Morning (8-9 AM):**
- Currently takes 30 min to review emails and update CRM with yesterday's activities
- NEED: Automatic activity logging from email/calendar

**On the Road (9 AM - 4 PM):**
- Can't access full account history on phone - current mobile app is terrible
- GPS doesn't show nearby accounts for impromptu visits
- Can't create quotes on mobile - have to wait until I get home
- NEED: Full-featured mobile app, maps integration, mobile quoting

**Evening (5-7 PM):**
- Spend 1-2 hours updating forecasts, creating follow-up tasks
- Pipeline reviews require exporting to Excel for analysis
- NEED: Better forecasting tools, one-click follow-up task creation

### Must-Have Mobile Features

1. **Account & Contact Lookup**
   - Search by name, phone, or address
   - See full activity history
   - View open opportunities
   - One-click to call or email

2. **Opportunity Management**
   - Update stage, amount, close date
   - Add products to opportunity
   - Log activities (call, meeting, email)
   - Voice-to-text for notes

3. **Maps & Routing**
   - Show accounts near my location
   - Optimize route for multiple meetings
   - Log check-in/check-out at customer site

4. **Quotes (would be amazing but OK for Phase 2)**
   - Create basic quotes on tablet
   - Send for approval
   - Email to customer

### Rep Dashboard Requests

I want to see at a glance:
- My pipeline by stage (visual funnel)
- Activities due today
- Stale opportunities (no activity > 14 days)
- How I'm tracking vs quota
- Team leaderboard for motivation

### Training Request

Please plan for 2-3 hours of hands-on mobile training. A lot of our reps are not tech-savvy and will need help getting set up. If we can have "champions" in each region who get trained first, they can help onboard others.

Happy to jump on a call to walk through a typical day if that would help.

Cheers,
Mark

---

## Email 5: Additional Analytics Requirements

**From:** Sarah Mitchell <s.mitchell@phoenix-industries.com>
**To:** Salesforce Implementation Team
**Date:** March 6, 2026 8:00 AM
**Subject:** Executive Dashboard and Reporting Requirements - IMPORTANT

Team,

I realized I didn't fully document my reporting needs. This is critical - I present to the board monthly and need reliable data.

### Executive Dashboard (Real-time)

**Section 1: Pipeline Overview**
- Total pipeline value by stage (funnel chart)
- Pipeline by region (bar chart)
- Pipeline by product line (pie chart)
- New pipeline created this month vs last month

**Section 2: Forecast**
- Commit vs Best Case vs Pipeline
- Forecast by region
- Gap to quota (we need to hit $45M this quarter)
- Week-over-week forecast changes (what moved in/out)

**Section 3: Activity Metrics**
- Calls logged per rep (weekly trend)
- Meetings held per rep (weekly trend)
- Average activities per opportunity
- Correlation: activities vs win rate

**Section 4: Win/Loss Analysis**
- Win rate by rep, region, product
- Average deal size - won vs lost
- Sales cycle length - won vs lost
- Top 5 reasons for lost deals (requires picklist)

### Monthly Board Report (Automated)

I need a scheduled report emailed on the 1st of each month:
- Previous month bookings vs target
- YTD bookings vs target
- Top 10 deals closed
- Top 10 deals in pipeline
- Rep performance ranking
- Churn/downsell (if applicable)

### Sales Contest Dashboard

For Q1, we're running "March Madness" - need to track:
- Deals closed in March
- Only deals >$100K qualify
- Leaderboard ranked by deal count first, then total value
- Real-time updates (reps are competitive!)
- Display on office TVs (need public URL)

Thanks,
Sarah

---

*End of Email Thread*
