/**
 * @description Test class for LeadScoringService
 * @author SCRUM-21
 * @date 2024
 */
@isTest
private class LeadScoringServiceTest {
    
    /**
     * @description Test high score lead (Grade A)
     */
    @isTest
    static void testHighScoreLead() {
        // Create a high-quality lead
        Lead highQualityLead = new Lead(
            FirstName = 'John',
            LastName = 'Smith',
            Company = 'Tech Corp',
            Email = 'john.smith@techcorp.com',
            Title = 'VP of Sales',
            Industry = 'Technology',
            LeadSource = 'Referral',
            AnnualRevenue = 5000000,
            NumberOfEmployees = 500,
            Status = 'Open - Not Contacted'
        );
        
        Test.startTest();
        insert highQualityLead;
        Test.stopTest();
        
        // Verify the lead was scored
        Lead scoredLead = [SELECT Id, Score__c, Rating FROM Lead WHERE Id = :highQualityLead.Id];
        
        // Expected score: 15 (revenue) + 10 (employees) + 20 (source) + 10 (industry) + 5 (email) + 15 (title) = 75
        System.assertEquals(75, scoredLead.Score__c, 'High quality lead should have score of 75');
        System.assertEquals('A - Hot', scoredLead.Rating, 'High quality lead should be Grade A');
    }
    
    /**
     * @description Test medium score lead (Grade B)
     */
    @isTest
    static void testMediumScoreLead() {
        // Create a medium-quality lead
        Lead mediumQualityLead = new Lead(
            FirstName = 'Jane',
            LastName = 'Doe',
            Company = 'Medium Corp',
            Email = 'jane.doe@mediumcorp.com',
            Title = 'Manager',
            Industry = 'Retail',
            LeadSource = 'Web',
            AnnualRevenue = 500000,
            NumberOfEmployees = 50,
            Status = 'Open - Not Contacted'
        );
        
        Test.startTest();
        insert mediumQualityLead;
        Test.stopTest();
        
        // Verify the lead was scored
        Lead scoredLead = [SELECT Id, Score__c, Rating FROM Lead WHERE Id = :mediumQualityLead.Id];
        
        // Expected score: 20 (source) + 5 (email) + 15 (title) = 40
        System.assert(scoredLead.Score__c >= 41 && scoredLead.Score__c < 60, 'Medium quality lead should have score between 41-59');
        System.assertEquals('B - Warm', scoredLead.Rating, 'Medium quality lead should be Grade B');
    }
    
    /**
     * @description Test low score lead (Grade C)
     */
    @isTest
    static void testLowScoreLead() {
        // Create a low-quality lead
        Lead lowQualityLead = new Lead(
            FirstName = 'Bob',
            LastName = 'Johnson',
            Company = 'Small Business',
            Email = 'bob@gmail.com',
            Title = 'Employee',
            Industry = 'Other',
            LeadSource = 'Other',
            AnnualRevenue = 50000,
            NumberOfEmployees = 5,
            Status = 'Open - Not Contacted'
        );
        
        Test.startTest();
        insert lowQualityLead;
        Test.stopTest();
        
        // Verify the lead was scored
        Lead scoredLead = [SELECT Id, Score__c, Rating FROM Lead WHERE Id = :lowQualityLead.Id];
        
        // Expected score: 0 (no points earned)
        System.assert(scoredLead.Score__c < 41, 'Low quality lead should have score below 41');
        System.assertEquals('C - Cold', scoredLead.Rating, 'Low quality lead should be Grade C');
    }
    
    /**
     * @description Test lead update triggers rescoring
     */
    @isTest
    static void testLeadUpdateRescoring() {
        // Create a basic lead
        Lead testLead = new Lead(
            FirstName = 'Test',
            LastName = 'User',
            Company = 'Test Company',
            Email = 'test@test.com',
            Status = 'Open - Not Contacted'
        );
        insert testLead;
        
        // Get initial score
        Lead initialLead = [SELECT Id, Score__c, Rating FROM Lead WHERE Id = :testLead.Id];
        Decimal initialScore = initialLead.Score__c;
        
        Test.startTest();
        // Update lead with high-value attributes
        testLead.AnnualRevenue = 2000000;
        testLead.NumberOfEmployees = 200;
        testLead.Industry = 'Technology';
        testLead.LeadSource = 'Referral';
        testLead.Title = 'CEO';
        update testLead;
        Test.stopTest();
        
        // Verify the lead was rescored
        Lead updatedLead = [SELECT Id, Score__c, Rating FROM Lead WHERE Id = :testLead.Id];
        
        System.assertNotEquals(initialScore, updatedLead.Score__c, 'Score should be updated');
        System.assert(updatedLead.Score__c > initialScore, 'Score should increase after adding high-value attributes');
    }
    
    /**
     * @description Test invocable method directly
     */
    @isTest
    static void testInvocableMethod() {
        // Create test input
        LeadScoringService.LeadScoringInput input = new LeadScoringService.LeadScoringInput();
        input.leadId = null; // Not needed for this test
        input.annualRevenue = 3000000;
        input.numberOfEmployees = 300;
        input.leadSource = 'Referral';
        input.industry = 'Finance';
        input.email = 'executive@bigcorp.com';
        input.title = 'Chief Technology Officer';
        
        List<LeadScoringService.LeadScoringInput> inputs = new List<LeadScoringService.LeadScoringInput>{ input };
        
        Test.startTest();
        List<LeadScoringService.LeadScoringResult> results = LeadScoringService.calculateLeadScore(inputs);
        Test.stopTest();
        
        System.assertEquals(1, results.size(), 'Should return one result');
        System.assertEquals(75, results[0].score, 'Score should be 75 for high-quality lead');
        System.assertEquals('A - Hot', results[0].grade, 'Grade should be A - Hot');
    }
    
    /**
     * @description Test bulk lead creation
     */
    @isTest
    static void testBulkLeadCreation() {
        List<Lead> leads = new List<Lead>();
        
        // Create 200 leads with varying quality
        for (Integer i = 0; i < 200; i++) {
            Lead lead = new Lead(
                FirstName = 'Test' + i,
                LastName = 'Lead' + i,
                Company = 'Company' + i,
                Email = 'test' + i + '@company' + i + '.com',
                Status = 'Open - Not Contacted'
            );
            
            // Vary the quality
            if (Math.mod(i, 3) == 0) {
                // High quality
                lead.AnnualRevenue = 2000000;
                lead.NumberOfEmployees = 200;
                lead.Industry = 'Technology';
                lead.LeadSource = 'Referral';
                lead.Title = 'VP of Engineering';
            } else if (Math.mod(i, 3) == 1) {
                // Medium quality
                lead.AnnualRevenue = 800000;
                lead.NumberOfEmployees = 80;
                lead.Industry = 'Retail';
                lead.LeadSource = 'Web';
                lead.Title = 'Manager';
            } else {
                // Low quality
                lead.AnnualRevenue = 100000;
                lead.NumberOfEmployees = 10;
                lead.Industry = 'Other';
                lead.LeadSource = 'Other';
                lead.Title = 'Staff';
            }
            
            leads.add(lead);
        }
        
        Test.startTest();
        insert leads;
        Test.stopTest();
        
        // Verify all leads were scored
        List<Lead> scoredLeads = [SELECT Id, Score__c, Rating FROM Lead WHERE Id IN :leads];
        System.assertEquals(200, scoredLeads.size(), 'All leads should be scored');
        
        // Verify we have different grades
        Set<String> grades = new Set<String>();
        for (Lead lead : scoredLeads) {
            System.assertNotEquals(null, lead.Score__c, 'Lead should have a score');
            System.assertNotEquals(null, lead.Rating, 'Lead should have a rating');
            grades.add(lead.Rating);
        }
        
        System.assert(grades.size() > 1, 'Should have multiple grade levels');
    }
    
    /**
     * @description Test corporate email detection
     */
    @isTest
    static void testCorporateEmailDetection() {
        Lead corporateLead = new Lead(
            FirstName = 'Corporate',
            LastName = 'User',
            Company = 'Big Corp',
            Email = 'user@bigcorp.com',
            Status = 'Open - Not Contacted'
        );
        
        Lead freemailLead = new Lead(
            FirstName = 'Personal',
            LastName = 'User',
            Company = 'Small Biz',
            Email = 'user@gmail.com',
            Status = 'Open - Not Contacted'
        );
        
        Test.startTest();
        insert new List<Lead>{ corporateLead, freemailLead };
        Test.stopTest();
        
        Lead scoredCorporate = [SELECT Id, Score__c FROM Lead WHERE Id = :corporateLead.Id];
        Lead scoredFreemail = [SELECT Id, Score__c FROM Lead WHERE Id = :freemailLead.Id];
        
        System.assert(scoredCorporate.Score__c > scoredFreemail.Score__c, 
            'Corporate email should result in higher score than free email');
    }
    
    /**
     * @description Test decision maker title detection
     */
    @isTest
    static void testDecisionMakerTitles() {
        List<Lead> leads = new List<Lead>();
        
        // Decision maker titles
        List<String> decisionMakerTitles = new List<String>{
            'CEO', 'CTO', 'CFO', 'VP of Sales', 'Director of Marketing', 
            'President', 'Chief Operating Officer', 'Owner'
        };
        
        for (String title : decisionMakerTitles) {
            leads.add(new Lead(
                FirstName = 'Decision',
                LastName = 'Maker',
                Company = 'Test Corp',
                Email = 'dm@testcorp.com',
                Title = title,
                Status = 'Open - Not Contacted'
            ));
        }
        
        // Non-decision maker
        leads.add(new Lead(
            FirstName = 'Staff',
            LastName = 'Member',
            Company = 'Test Corp',
            Email = 'staff@testcorp.com',
            Title = 'Associate',
            Status = 'Open - Not Contacted'
        ));
        
        Test.startTest();
        insert leads;
        Test.stopTest();
        
        List<Lead> decisionMakers = [SELECT Id, Score__c FROM Lead WHERE Title != 'Associate'];
        Lead nonDecisionMaker = [SELECT Id, Score__c FROM Lead WHERE Title = 'Associate'];
        
        for (Lead dm : decisionMakers) {
            System.assert(dm.Score__c > nonDecisionMaker.Score__c, 
                'Decision maker should have higher score than non-decision maker');
        }
    }
    
    /**
     * @description Test high value industries
     */
    @isTest
    static void testHighValueIndustries() {
        List<Lead> leads = new List<Lead>();
        
        // High value industries
        List<String> highValueIndustries = new List<String>{
            'Technology', 'Finance', 'Healthcare', 'Manufacturing'
        };
        
        for (String industry : highValueIndustries) {
            leads.add(new Lead(
                FirstName = 'Industry',
                LastName = 'Test',
                Company = 'Test Corp',
                Email = 'test@testcorp.com',
                Industry = industry,
                Status = 'Open - Not Contacted'
            ));
        }
        
        // Low value industry
        leads.add(new Lead(
            FirstName = 'Other',
            LastName = 'Industry',
            Company = 'Test Corp',
            Email = 'other@testcorp.com',
            Industry = 'Other',
            Status = 'Open - Not Contacted'
        ));
        
        Test.startTest();
        insert leads;
        Test.stopTest();
        
        List<Lead> highValueLeads = [SELECT Id, Score__c FROM Lead WHERE Industry != 'Other'];
        Lead lowValueLead = [SELECT Id, Score__c FROM Lead WHERE Industry = 'Other'];
        
        for (Lead hvl : highValueLeads) {
            System.assert(hvl.Score__c > lowValueLead.Score__c, 
                'High value industry should result in higher score');
        }
    }
}
