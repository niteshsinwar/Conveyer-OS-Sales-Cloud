# Business Requirements Document: Phoenix Help Desk System

## Executive Summary

The Phoenix Help Desk System is a new web-based application designed to replace the client's current shared email inbox for support ticketing. The system aims to streamline support operations, improve agent efficiency, and enhance customer satisfaction by providing a structured platform for ticket submission, tracking, and resolution with integrated Service Level Agreements (SLAs) and reporting capabilities.

## Scope

The scope of this project includes the development of a web-based Help Desk system with two primary interfaces: a customer portal for submitting tickets and an internal dashboard for support agents to manage and resolve tickets. The system will incorporate integrations with Active Directory for agent authentication and Slack for notifications. Reporting functionalities for support managers are also in scope.

## Functional Requirements

### 1. User Portal
- Users shall be able to log in to the system.
- Users shall be able to submit a new support ticket.
- A new support ticket shall include a title, description, and an optional screenshot attachment.
- Users shall only be able to view tickets they have submitted.

### 2. Agent Dashboard
- Agents shall be able to log in to the system via Active Directory Single Sign-On (SSO).
- Agents shall be able to view tickets assigned to them.
- Agents shall be able to change the status of a ticket from 'Open' to 'In Progress' to 'Resolved'.
- Agents shall be assigned to specific groups (e.g., "Hardware Support", "Software Support") and can see all tickets, but are assigned specific groups.
- The agent dashboard shall display the priority level of each ticket.

### 3. Ticket Management
- The system shall support the following priority levels for tickets: Low, Medium, High, and Urgent.
- The system shall implement Service Level Agreements (SLAs) based on priority:
    - Urgent: 4 hours for resolution.
    - High: 24 hours for resolution.
    - Medium: 48 hours for resolution.
    - Low: 1 week for resolution.
- The system shall automatically flag tickets in red and send an email to the support manager if an SLA is breached.
- When a ticket is resolved, the system shall push a notification to a specific Slack channel via the Slack API.

### 4. Reporting
- The system shall include a reporting tab for support managers.
- The reporting tab shall display "Average time to resolution" as a chart (e.g., bar chart).
- The reporting tab shall display "Number of SLA breaches this week" as a chart (e.g., pie chart).

## Non-Functional Requirements

### 1. Security
- All data at rest must be encrypted.
- The Slack webhook URL must be stored securely and not hardcoded.

### 2. Performance
- The system should be responsive and provide a smooth user experience for both customers and agents. (Further performance metrics to be defined during design phase).

### 3. Usability
- The user interface for both the customer portal and agent dashboard should be intuitive and easy to navigate.

## Constraints

- **Infrastructure:** Must be deployed on AWS infrastructure.
- **Backend Technology:** Backend must be developed using Python/FastAPI.
- **Frontend Technology:** Frontend must be developed using React.
- **Database:** PostgreSQL must be used as the database.
- **Timeframe:** Must be ready for User Acceptance Testing (UAT) in 3 months.

## Assumptions

- **Active Directory Integration:** A readily available Active Directory instance will be provided for SSO integration.
- **Slack API Access:** Necessary Slack API credentials and permissions will be provided for notification integration.
- **Support Manager Email:** A valid email address for the support manager will be provided for SLA breach notifications.
- **Screenshot Attachments:** The system assumes standard image file formats for screenshot attachments.
