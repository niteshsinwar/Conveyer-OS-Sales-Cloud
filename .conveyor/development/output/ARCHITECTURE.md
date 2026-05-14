# Project Architecture

> This document is maintained by Development agents across sessions.
> Read it to understand current state. Update it after making changes.

## Last Updated
- **Session**: 2026-05-14 11:57
- **Ticket**: CONOS-4

## Objects & Fields

### Student__c
*   **Purpose:** To store student information within the system.
*   **API Name:** `Student__c`
*   **Name Field:** `Student Name` (Auto Number: `ST-{0000}`)
*   **Fields:**
    *   `First_Name__c` (Text) - First name of the student.
    *   `Last_Name__c` (Text) - Last name of the student.
    *   `Date_of_Birth__c` (Date) - Student's date of birth.
    *   `Email__c` (Email) - Student's email address.
    *   `Phone__c` (Phone) - Student's phone number.
    *   `Enrollment_Date__c` (Date) - Date the student enrolled.
    *   `Status__c` (Picklist) - Current status of the student (Enrolled, Active, Graduated, Dropped).


## Apex Classes

| Class | Type | Purpose | Dependencies |
|-------|------|---------|--------------|
| (Add Apex classes here) |

## Triggers

| Trigger | Object | Events | Handler |
|---------|--------|--------|---------|
| (Add triggers here) |

## LWC Components

| Component | Purpose | Used On | Data Source |
|-----------|---------|---------|-------------|
| (Add LWC components here) |

## Flows

| Flow | Type | Object | Purpose |
|------|------|--------|---------|
| (Add flows here) |

## Validation Rules

| Rule | Object | Condition | Error Message |
|------|--------|-----------|---------------|
| (Add validation rules here) |

## Integration Points

| System | Direction | Method | Purpose |
|--------|-----------|--------|---------|
| (Add integrations here) |

## Architecture Decisions

### Decision Log
| Date | Decision | Rationale |
|------|----------|-----------|
| (Log key decisions here) |

## Notes for Next Session
- (Add context for continuity)
