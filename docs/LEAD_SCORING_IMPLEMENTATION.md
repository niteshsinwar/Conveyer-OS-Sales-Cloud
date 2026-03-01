# Lead Scoring Flow Implementation (SCRUM-21)

## Overview
This implementation provides an automated lead scoring system that evaluates leads based on multiple criteria and assigns scores and grades to help prioritize sales efforts.

## Components

### 1. Lead Scoring Flow (`Lead_Scoring_Flow`)
**Type:** Record-Triggered Flow (After Save)  
**Trigger:** Creates and Updates on Lead object  
**Status:** Active

#### Flow Logic
The flow automatically calculates a lead score based on the following criteria:

| Criterion | Points | Conditions |
|-----------|--------|------------|
| **Annual Revenue** | 15 | Revenue ≥ $1,000,000 |
| **Company Size** | 10 | Employees ≥ 100 |
| **Lead Source** | 20 | Web, Referral, or Partner |
| **Industry** | 10 | Technology, Finance, Healthcare, or Manufacturing |
| **Email Domain** | 5 | Corporate email (not Gmail, Yahoo, Hotmail) |
| **Job Title** | 15 | Decision maker (VP, Director, Manager, C-Level, President) |

**Maximum Score:** 75 points

#### Grading System
Based on the total score, leads are assigned one of three grades:

- **Grade A (Hot):** Score ≥ 60 points
- **Grade B (Warm):** Score 41-59 points  
- **Grade C (Cold):** Score 0-40 points

The grade is stored in the standard `Rating` field on the Lead object.

### 2. Custom Field: Score__c
**Object:** Lead  
**Type:** Number(5,2)  
**Label:** Lead Score  
**Description:** Stores the calculated lead score

### 3. LeadScoringService Apex Class
**Purpose:** Provides reusable scoring logic and can be invoked from flows or other Apex code

#### Key Methods
- `calculateLeadScore()` - Invocable method for Flow integration
- `calculateScore()` - Core scoring calculation
- `isHighQualitySource()` - Evaluates lead source quality
- `isHighValueIndustry()` - Evaluates industry value
- `isCorporateEmail()` - Detects corporate vs. free email providers
- `isDecisionMaker()` - Identifies decision-maker titles
- `determineGrade()` - Assigns grade based on score

#### Invocable Method Usage
The class can be called from flows using the `Calculate Lead Score` action:

**Inputs:**
- Lead ID
- Annual Revenue
- Number of Employees
- Lead Source
- Industry
- Email
- Title

**Outputs:**
- Lead ID
- Score
- Grade

### 4. LeadScoringServiceTest
**Coverage:** 100%  
**Test Methods:**
- `testHighScoreLead()` - Validates Grade A scoring
- `testMediumScoreLead()` - Validates Grade B scoring
- `testLowScoreLead()` - Validates Grade C scoring
- `testLeadUpdateRescoring()` - Validates rescoring on updates
- `testInvocableMethod()` - Tests direct Apex invocation
- `testBulkLeadCreation()` - Tests bulk operations (200 records)
- `testCorporateEmailDetection()` - Validates email scoring
- `testDecisionMakerTitles()` - Validates title scoring
- `testHighValueIndustries()` - Validates industry scoring

## How It Works

### Automatic Scoring
1. When a Lead is created or updated, the flow automatically triggers
2. The flow initializes the score to 0
3. Each criterion is evaluated in sequence:
   - Annual Revenue check
   - Number of Employees check
   - Lead Source evaluation
   - Industry evaluation
   - Email domain analysis
   - Job Title assessment
4. Points are added for each criterion met
5. A grade is assigned based on the total score
6. The Lead record is updated with the score and grade

### Manual Scoring (via Apex)
The `LeadScoringService` class can also be used programmatically:

```apex
LeadScoringService.LeadScoringInput input = new LeadScoringService.LeadScoringInput();
input.leadId = leadRecord.Id;
input.annualRevenue = leadRecord.AnnualRevenue;
input.numberOfEmployees = leadRecord.NumberOfEmployees;
input.leadSource = leadRecord.LeadSource;
input.industry = leadRecord.Industry;
input.email = leadRecord.Email;
input.title = leadRecord.Title;

List<LeadScoringService.LeadScoringResult> results = 
    LeadScoringService.calculateLeadScore(new List<LeadScoringService.LeadScoringInput>{ input });
```

## Configuration

### Customizing Score Values
To adjust point values, modify the constants in `LeadScoringService.cls`:

```apex
private static final Integer SCORE_HIGH_REVENUE = 15;
private static final Integer SCORE_LARGE_COMPANY = 10;
private static final Integer SCORE_HIGH_QUALITY_SOURCE = 20;
private static final Integer SCORE_HIGH_VALUE_INDUSTRY = 10;
private static final Integer SCORE_CORPORATE_EMAIL = 5;
private static final Integer SCORE_DECISION_MAKER = 15;
```

### Customizing Grade Thresholds
Adjust grade boundaries in `LeadScoringService.cls`:

```apex
private static final Integer GRADE_A_THRESHOLD = 60;
private static final Integer GRADE_B_THRESHOLD = 41;
```

### Adding New Industries
Update the `isHighValueIndustry()` method:

```apex
Set<String> highValueIndustries = new Set<String>{
    'Technology', 'Finance', 'Healthcare', 'Manufacturing',
    'Your New Industry' // Add here
};
```

### Adding New Lead Sources
Update the `isHighQualitySource()` method:

```apex
Set<String> highQualitySources = new Set<String>{
    'Web', 'Referral', 'Partner', 'Advertisement',
    'Your New Source' // Add here
};
```

## Benefits

1. **Automated Prioritization:** Sales teams can focus on high-scoring leads first
2. **Consistent Evaluation:** All leads are scored using the same criteria
3. **Real-time Updates:** Scores update automatically when lead data changes
4. **Scalable:** Handles bulk operations efficiently
5. **Customizable:** Easy to adjust scoring criteria and thresholds
6. **Reportable:** Use Score__c and Rating fields in reports and dashboards

## Reports & Dashboards

### Suggested Reports
1. **Hot Leads Report** - Filter: Rating = "A - Hot"
2. **Lead Score Distribution** - Group by Rating
3. **High-Value Leads by Source** - Group by LeadSource, filter Score__c ≥ 60
4. **Industry Performance** - Group by Industry, show average Score__c

### Dashboard Components
- Lead Grade Pie Chart (Rating field)
- Average Score by Source (Score__c by LeadSource)
- Top Scoring Leads (Score__c descending)
- Score Trend Over Time (Score__c by CreatedDate)

## Best Practices

1. **Regular Review:** Review and adjust scoring criteria quarterly based on conversion data
2. **Sales Feedback:** Incorporate sales team feedback on lead quality
3. **Data Quality:** Ensure lead data is complete for accurate scoring
4. **Training:** Train users on the scoring system and how to interpret grades
5. **Integration:** Use scores in lead assignment rules and workflows

## Troubleshooting

### Issue: Leads not being scored
**Solution:** 
- Verify the flow is Active
- Check that the Lead has the required fields populated
- Review debug logs for errors

### Issue: Incorrect scores
**Solution:**
- Verify field values match expected criteria
- Check for recent customizations to scoring logic
- Review the flow decision criteria

### Issue: Performance concerns
**Solution:**
- The flow is optimized for bulk operations
- Test with bulk data loads (200+ records)
- Consider asynchronous processing for very large batches

## Future Enhancements

Potential improvements for future iterations:
1. Machine learning-based scoring
2. Integration with marketing automation platforms
3. Predictive lead scoring based on historical conversion data
4. Time-decay scoring (reduce score for old leads)
5. Engagement scoring (website visits, email opens, etc.)
6. Geographic/territory-based scoring

## Deployment

### Prerequisites
- Salesforce API version 62.0 or higher
- Lead object access
- Flow and Apex deployment permissions

### Deployment Steps
1. Deploy the custom field: `Lead.Score__c`
2. Deploy the Apex class: `LeadScoringService.cls`
3. Deploy the test class: `LeadScoringServiceTest.cls`
4. Deploy the flow: `Lead_Scoring_Flow.flow-meta.xml`
5. Activate the flow in the target org
6. Run test class to verify (should achieve 100% coverage)

### Post-Deployment
1. Create list views filtered by Rating
2. Update page layouts to display Score__c field
3. Create reports and dashboards
4. Train sales team on the scoring system

## Support

For questions or issues related to this implementation, please refer to:
- JIRA Ticket: SCRUM-21
- Documentation: This file
- Code Comments: In-line documentation in all classes and flows

---

**Version:** 1.0  
**Last Updated:** 2024  
**Author:** SCRUM-21 Implementation Team
