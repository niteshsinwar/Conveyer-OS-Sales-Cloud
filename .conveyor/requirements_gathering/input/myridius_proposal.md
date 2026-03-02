# Myridius Proposal - Salesforce Sponsor Bank Implementation

*Source: Myridius Proposal for Bread Financial Sponsor Bank v2.0 Req Asia.pdf*

---

## Page 1

SPONSOR BANK VISION
Salesforce Sponsor Bank 
Implementation
Creating scalable, connected experiences for Fintech Partners
January 2026
Implementation Proposal
Presented by Myridius
Bread Financial
|
Myridius

## Page 2

Agenda
1.Introduction & Vision
o
Introductions
o
Our Understanding of Sponsor Banking Vision
o
Strategic Alignment with Bread Financial
2.Solution Summary
o
Scope
o
Solution Architecture
3.Implementation Approach
o
Roadmap & Timeline
o
Governance & Operating Model
4. Assumptions
o
Dependencies & Assumptions
5.Commercials
o
Pricing & Scope Inclusions
6.Differentiation
o
Why Myridius?

## Page 3

VISION & OUTCOMES
EXECUTIVE SUMMARY
Vision for a Consumer-Grade Partner 
Experience
Single, Secure Entry Point 
Unified portal via Experience Cloud for seamless access across the lifecycle.
Guided, Dynamic Data Collection
Intuitive UX, checklists and collaboration to accelerate partner 
activation.
Role-Based Access & authentication 
Secure identity management and audit trails aligned to sponsor-bank 
controls.
Intelligent Monitoring & Collaboration 
Automated checklists and notifications to ensure compliance 
requirements are monitored and met
Self-Service Support 
Complaints management, and status tracking to reduce support load.
Data-Driven Insights 
Reports & Dashboards to optimize partner performance and 
monitor risk proactively.
TARGET BUSINESS OUTCOMES
Faster Onboarding Cycle 
Time
Reduced Operational 
Effort
Improved Partner NPS
Enhanced Compliance 
Readiness
Lower Support 
Volume
Scalable 
Architecture

## Page 4

Journey Map
UNDERSTANDING THE CONNECTED PARTNER 
EXPERIENCE
Envisioned Partner Journey & Value Realization
KEY DIFFERENTIATORS 
Internal Collaboration
Cross-functional 
alignment
Centralized Governance
Policy & standards 
compliance
Document Management
Centralized repository
Real-time Engagement
Instant responsiveness
01
Governance Platform
Partner Hub: Experience 
Cloud basedPortal . User 
authentication via Okta/MFA.
Access controls for visibility 
to information
Account/Contact & Slack for 
unified collaboration.
Opportunity lifecycle to track 
fintech progress based on 
stage
Impact
Secure and easy to use 
collaboration hub
02
Due Diligence, Pre-
launch & FEV
Dynamic Experience: Flow + 
Data tables for interactive 
onboarding and real-time data 
validation.
Automated Tasks: Built-in 
logic for task creation for all 
stages
Slack for collaboration of due 
diligence questions
Validations to mandate 
critical information is captured
Impact
Faster go-to-market 
execution
03
GRC Hub
Policy Management:
Standards delivered via 
Knowledge/Fileson portal
Creation of knowledge articles 
and Data categories to control 
visibility
Audit Management:
Salesforce files for storing 
documents uploaded as 
evidence
Monitoring: Dashboards and 
reports for audit trail.
Impact
Centralized Risk Oversight 
Hub
04
Marketing Collateral
Integrated Intake: Direct 
Experience Cloud upload for 
all marketing materials.
System Routing: Manual hand-
off to Workfront for review.
Real-time Alerts: Instant Slack 
notificationsto keep 
stakeholders informed.
Impact
Integrated Marketing 
Approval
05
Change Management 
& monitoring
Request Flow: Change 
Request workflows utilizing 
Salesforce Cases and 
approvals.
Templatized monitoring 
checklist: Custom object for 
maintaining checklists.
Automated Monitoring 
Tasks: Intelligent task 
creation and Slack 
notification based on due 
dates. 
Impact
Risk mitigation & 
compliance confidence
06
Complaints 
Management
Case Submission: Partners 
submit complaints directly 
via Experience Cloud
cases.
System Integration: Data 
flow from portal submission 
into CIMS process.
Status Transparency:
Provides partners with real-
time visibility into case 
status and progress.
Impact
Rapid resolution & 
transparency

## Page 5

SCOPE
SOLUTION OVERVIEW
Detailed Requirements & Solution
Seq #
Requirements
Solution
Comments
1
Setup an onboarding and governance 
platform for FinTech's and Bread to 
collaborate and govern compliance
-
Setup of Experience Cloud based on UPP theme
-
Setup of Fintech Users using Okta / Salesforce MFA
-
Theme related information to be 
shared by Bread team
-
Okta team to be available for setup
2
Compliance stages to be tracked for Due 
Diligence, Pre-Launch testing and First 
Events Validation. 
-
Custom object for managing questionnaire centrally
-
Setup Opportunity, Opportunity stages - Due Diligence, Pre-launch 
testing, First Events Validation. 
-
Associate questionnaire to opportunity
-
Provides ability to change 
questionnaire per type of fintech and 
manage each question individually
3
Ability to upload documents and 
comments per item in the due – diligence 
questionnaire
-
Use Diligence custom object to upload manage documents for 
each question. Use data tables for due diligence
-
Slack for collaborating at an opportunity/diligence level
-
Reuse of existing custom objects 
created where possible
4
Ability to track pre-launch testing & First 
Events Validation
-
Use task objects and create tasks automatically, upload files and 
relevant information to close the stages 
- Prevent movement to pre-launch/FEV 
until all critical activities are 
completed
5
Ability to create testing schedules 
automatically for monitoring compliance
-
Creation of templatized checklist of compliance related testing 
using custom object
-
Association of testing required to the fintech as part of onboarding 
and define the frequency
-
Creation of automated tasks based on due dates and frequency
-
Notifications to be sent out to the users based on due dates and 
task status to ensure completion of task
- Queues would be setup to assign the 
tasks to
- Frequency to generate the task to be 
determined depending on average 
time taken to complete the task 
- Slack notification

## Page 6

SCOPE
SOLUTION OVERVIEW
Detailed Requirements & Solution
Seq #
Requirements
Solution
Assumptions
6
Provide a workflow to track and report on changes made 
to policies
-
Case based workflow to submit the request of the change
-
Approval and audit process to track approvals 
-
Creation of report for compliance on changes requested, 
approved by and approval date
- Slack approvals and notifications
7
Central hub for policies, training/enablement (incl. 
SOPs), audits, due diligence artifacts etc.
-
Creation of knowledge repository to be shared with all 
Fintech's
-
Creation of data categories to manage access to articles
Is the information seen by all 
Fintechs? If this is different, data 
categories can be used
8
Access Control for internal / external users on ability to 
only see information relevant to them
-
Setup of roles/profiles and field level security to ensure 
required visibility 
9
Marketing program management
-
Creation of request for marketing material intake from the 
portal. Reuse Case object
-
Manual update to Workfront and in Salesforce to manage 
communication
Next phase – Utilize Fusion/AWS to 
integrate with workfront
10
Reporting
-
Dashboard on fintech progress by opportunity stage, 
overdue tasks  
-
Task completion reports
-
Exportable reports
11
Complaints management
-
Creation of complaints cases, routing and resolution 
workflow
Defines SLA’s and case escalation 
process

## Page 7

COMPLIANCE & RISK
Due Diligence
Doc Management
Program Change
Audit Trails
ENGAGEMENT LAYER (EXPERIENCE CLOUD)
Fintech Portal
CORE PLATFORM & ORCHESTRATION
Core CRM
Accounts, Contacts, Opp, 
Activities
Service Cloud
Case Management, Tasks
Orchestration
Screen Flows, Flows
Work 
Management
Adobe Workfront API
Slack Connect
Real-time Alerts, Approvals & 
Channel Collaboration
FOUNDATION & INTEGRATION
Identity 
API Gateway
Backend Systems
INSIGHTS & OPS
Dashboards & Reports
Notifications
SOLUTION OVERVIEW
End-to-End Connected Partner Experience Architecture
ARCHITECTURE
Dashboards & Reports
Theme aligned with Unified 
Partner Portal experience
Segregate data from 
existing Merchants and 
Dealers
Use Okta / 
Salesforce IDP and 
MFA
Real time collaboration for 
onboarding/servicing
Guided user experience

## Page 8

ROADMAP
W1
W2
W3
W4
W5
W6
W7
W8
W9
W10
W11
W12-13
Discovery &
Assessment
Identify Onboarding requirements
Gather due diligence details
Assess integration readiness
Assess Program change
Evaluate security policies
Analyze system integrations
DELIVERABLES
Application
Design
Design Portal features
Finalize architecture 
and integration 
approach 
Define Opportunity 
/Case management
Create personas & flows
DELIVERABLES
Development &
Integrations
User Management and login
Due Diligence flows 
Onboarding flows and templates
Change Management Flows
Perform unit testing
Deployment to lower environments for testing
Implement field mappings
Config Slack Connect channels
Setup Workfront automation
Build Exp. Cloud portal pages
Implement authentication/Identity management
Create CRM dashboards
DELIVERABLES
Testing &
Validation
Systems testing
System Integration testing
User Acceptance Testing (UAT)
Automation Testing
DELIVERABLES
Deployment &
Rollout
Cutover planning
Production deployment
Hypercare support
Steady state transition
DELIVERABLES
IMPLEMENTATION APPROACH
Our proposed approach to partner experience cloud implementation
Create automation test scripts in 
Cypress
Support Change Management
Identify personas

## Page 9

GOVERNANCE
BREAD FINANCIAL
Executive Sponsor
Product Owner
Compliance / Risk Lead
InfoSec Lead
Business SMEs
Change Mgmt
MYRIDIUS DELIVERY TEAM
Engagement Partner
Project Manager
Solution Architect
Experience Cloud 
Consultant
Salesforce Tech.  Lead
Business Analyst
QA
Developers
Agile Delivery
2-Week Sprint Cadence
Product Backlog
Definition of Done (DoD)
Governance
Daily: Stand-ups (15 min)
Weekly: Status & Risk Review
Bi-Weekly: Program Governance
RACI Highlights
Bread: User stories sign-off, UAT sign-off
Myridius: Architecture, Build, QA, Deploy
Shared: User Stories, Testing
Tools Stack
Delivery: JIRA
Collab: Teams/Slack
Docs: Confluence / SharePoint
PROPOSED TEAM & OPERATING MODEL
Team Structure and Governance Framework

## Page 10

REQUIREMENTS
IMPLEMENTATION SUPPORT
Key Assumptions, Dependencies & Support Needed
Identity Provisioning 
Okta / Standard Salesforce MFA based authentication would be used. 
External users would be created manually and enabled for Portal
Integration Readiness 
API endpoints, documentation, and test data for core integrations must be 
available prior to start of development. Integration with Workfront will be via 
REST based API
Collaboration Tool Access 
Access to Slack Connect channels for provisioning and testing. 2 Slack 
channels for internal/external are considered
UAT Participation 
Business, compliance, and operations stakeholders identified for UAT 
participation by end of UAT.
Timely Decision Making 
Commitment to 2-business day turnaround for approvals and availability 
of key SMEs.
Infrastructure & Licensing 
Salesforce licenses and sandbox environments provisioned prior to build 
phase start.

## Page 11

COMMERCIAL
ESTIMATED PRICE
Base Implementation
Key Pricing Considerations
Final pricing confirmed post-discovery based on detailed 
requirements
Includes comprehensive 12-week fixed-fee 
implementation
Salesforce, Slack, and Adobe Workfront licenses are not 
included
Includes 1-week hyper care support period post-
deployment
Scope Inclusions
End-to-end implementation of Experience Cloud Partner Portal (Discovery to Deploy)
Configuration of Portal, Screen Flows, Case Management and workflows for internal teams
Integration setup for Slack Connect, Okta
Development of 3-4 core CRM Reports & Dashboards (e.g. Onboarding Progress, Change Management, Complaints details)
1week of Hypercare support post-deployment
Key Exclusions
Salesforce, Slack, or Adobe Workfront / Fusion licenses
Large-scale data migration (ETL)
Integration with any other tools besides, Slack, Okta
INVESTMENT SUMMARY
Indicative Commercial & Pricing Construct

## Page 12

SCOPE
SOLUTION OVERVIEW
Future Scope Recommendations
❖Integration with Workfront for seamless communication of marketing collateral
❖End to end case management for additional requests such as payments, disputes etc.
❖Usage of Marketing cloud of communication to Partners and taking their feedback
❖Virtual AI Agent support for easy collaboration for due diligence and case management
❖Automation of additional compliance checks using AI 
❖Case closure, summarization etc. using AI
❖Integration with core banking systems for agents to view and sample the data required for 
compliance validation

## Page 13

DIFFERENTIATION
CORE COMPETENCY
Proven Salesforce & Bread Financial Delivery 
INNOVATION
AI-Led Delivery & Accelerated Implementation
STRATEGIC INSIGHT
Vision & Culture Alignment
PARTNERSHIP
Trusted Advisor 
WHY MYRIDIUS
A Strategic Partner for Connected Experience Success

## Page 14

©2025 Myridius. All rights reserved

## Page 15

ALIGNMENT
EXECUTIVE SUMMARY
Alignment with Bread Financials' FinTech Partner 
Strategy
Bread Strategy Pillars
Scale Embedded Finance with trusted Sponsor Bank rigor and 
oversight.
Speed to Market through standardized, repeatable partner 
onboarding processes.
Operational efficiency and automation across the full partner 
lifecycle.
Strong Compliance, risk, and governance posture as a 
competitive differentiator.
Co-Innovation with partners to expand products and channels 
effectively.
Program Alignment
Experience Cloud Portal standardizes partner engagement end-to-
end.
Data tables, checklists and tasks to digitize and accelerate 
onboarding and approvals.
Slack Connect drives faster collaboration and real-time decision 
making.
Identity & auditability workflows and automated tasks 
support bank-grade compliance requirements.
Modular architecture allows flexible addition of products, 
segments, and geographies.

## Page 16

SCOPE
SOLUTION OVERVIEW
Capabilities and Integrations: In-Scope vs. Future
In-Scope (MVP)
✓Experience Cloud Partner Portal for centralized partner access
✓Guided Onboarding via intelligent Screen Flows & approvals
✓Configuration of OOB functionality for Opportunity & Case Management 
for internal users
✓Slack Connect integration for real-time collaboration
✓Salesforce Dashboards & Reports for partner performance dashboards
✓Security policies including authentication, role-based access & audit 
trails. Okta / Salesforce MFA would be used for authentication
✓Automation Testing using Cypress
✓Adobe Workfront for structured intake & delivery tracking (TBD)
Out of Scope / Phase II
Virtual AI Agent support (AI-assisted support moved to future phase).
Marketing Cloud journeys & advanced communications.
Data Cloud unification and advanced segmentation.
Global Expansion to additional product lines & geographies.
Knowledge management setup, integration with external document 
management tools
Integration with IDP for authentication, Self Registration in Portal
Creation of Dashboards using CRM Analytics

