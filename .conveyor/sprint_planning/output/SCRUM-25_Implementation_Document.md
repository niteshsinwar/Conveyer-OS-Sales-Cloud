# SCRUM-25 Implementation Document

## Ticket
**Key:** SCRUM-25  
**Title:** FOUNDATION: Create core custom objects for Sponsor Bank Onboarding platform

## Summary
Create the initial set of custom objects required for the Sponsor Bank Onboarding, Governance & Compliance Collaboration Platform, including a standard `Internal_Notes__c` field on each object.

## Background / Context
Source SDD: `SDD_Rough_Sponsor_Bank_Onboarding_Platform.md`

This is a **Layer 1 (FOUNDATION)** ticket. It intentionally does **not** include relationships, validation rules, sharing rules, automation (Flow/Apex), Experience Cloud configuration, or UI.

## Scope

### Objects to Create (API Names)
Create the following custom objects:
1. `Partner_Onboarding__c`
2. `DDQ_Template__c`
3. `DDQ_Question__c`
4. `DDQ_Assessment__c`
5. `DDQ_Response__c`
6. `Evidence__c`
7. `Compliance_Test__c`
8. `Compliance_Test_Schedule__c`
9. `Compliance_Test_Run__c`
10. `Policy__c`
11. `Policy_Change_Request__c`

### Name Field Strategy
Configure the **Name** field type for each object as follows:

**Text Name (standard “Text” Name field)**
- `DDQ_Template__c`
- `Compliance_Test__c`
- `Policy__c`

**Auto Number Name**
- `Partner_Onboarding__c`
- `DDQ_Question__c`
- `DDQ_Assessment__c`
- `DDQ_Response__c`
- `Evidence__c`
- `Compliance_Test_Schedule__c`
- `Compliance_Test_Run__c`
- `Policy_Change_Request__c`

Auto-number display formats (recommended; can be adjusted):
- `Partner_Onboarding__c`: `ONB-{00000}`
- `DDQ_Question__c`: `DDQQ-{00000}`
- `DDQ_Assessment__c`: `DDQA-{00000}`
- `DDQ_Response__c`: `DDQR-{00000}`
- `Evidence__c`: `EVD-{00000}`
- `Compliance_Test_Schedule__c`: `CTS-{00000}`
- `Compliance_Test_Run__c`: `CTR-{00000}`
- `Policy_Change_Request__c`: `PCR-{00000}`

### Common Field (add to every object)
Create this field on **each** of the 11 objects:
- **Field Label:** Internal Notes
- **API Name:** `Internal_Notes__c`
- **Type:** Long Text Area
- **Length:** 32768
- **Visible Lines:** 5 (or default)
- **Field-Level Security:** Visible for System Administrator (minimum). If your org standard is to enable for all internal profiles, do so.

## Where to Create
Salesforce Setup (metadata will be generated in SFDX source after retrieval/deploy).
- Objects: **Setup → Object Manager → Create → Custom Object**
- Fields: **Setup → Object Manager → [Object] → Fields & Relationships**

If using SFDX source format, the resulting metadata will live under:
- `force-app/main/default/objects/<ObjectApiName>/` (object + fields)

## Implementation Steps
1. Create each custom object listed above.
2. Configure the Name field type (Text vs Auto Number) per the strategy above.
3. For each object, create `Internal_Notes__c` as a Long Text Area.
4. Ensure objects are created without relationships (no lookups/master-detail in this ticket).
5. Retrieve/source-control the metadata (or ensure it is included in the deployment pipeline).

## Out of Scope / Non-Goals
- No lookup/master-detail relationships
- No validation rules
- No flows, triggers, Apex
- No sharing rules / OWD changes
- No Experience Cloud configuration
- No page layouts beyond Salesforce defaults

## Acceptance Criteria
- [ ] All 11 custom objects exist with the exact API names listed.
- [ ] The Name field type is correct for each object (Text for `DDQ_Template__c`, `Compliance_Test__c`, `Policy__c`; Auto Number for the rest).
- [ ] Each object has `Internal_Notes__c` (Long Text Area, 32k) created.
- [ ] Metadata is committed/deployable (no missing components).

## Technical Notes / Gotchas
- Avoid relying on the auto-number *format* for any future logic; future tickets should use record `Id` + explicit keys.
- Keep this ticket strictly foundational: later tickets will add `Partner_Account__c` and other relationships that drive sharing and portal segregation.
