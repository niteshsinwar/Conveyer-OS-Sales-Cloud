/**
 * @description Service class for Lead Scoring logic
 * @author SCRUM-21
 * @date 2024
 */
public with sharing class LeadScoringService {
    
    // Scoring constants
    private static final Integer SCORE_HIGH_REVENUE = 15;
    private static final Integer SCORE_LARGE_COMPANY = 10;
    private static final Integer SCORE_HIGH_QUALITY_SOURCE = 20;
    private static final Integer SCORE_HIGH_VALUE_INDUSTRY = 10;
    private static final Integer SCORE_CORPORATE_EMAIL = 5;
    private static final Integer SCORE_DECISION_MAKER = 15;
    
    // Grade thresholds
    private static final Integer GRADE_A_THRESHOLD = 60;
    private static final Integer GRADE_B_THRESHOLD = 41;
    
    // Revenue threshold
    private static final Decimal REVENUE_THRESHOLD = 1000000;
    
    // Employee threshold
    private static final Integer EMPLOYEE_THRESHOLD = 100;
    
    /**
     * @description Calculate lead score based on various criteria
     * @param leads List of leads to score
     * @return Map of Lead Id to calculated score
     */
    @InvocableMethod(label='Calculate Lead Score' description='Calculates lead score based on multiple criteria')
    public static List<LeadScoringResult> calculateLeadScore(List<LeadScoringInput> inputs) {
        List<LeadScoringResult> results = new List<LeadScoringResult>();
        
        for (LeadScoringInput input : inputs) {
            LeadScoringResult result = new LeadScoringResult();
            result.leadId = input.leadId;
            result.score = calculateScore(input);
            result.grade = determineGrade(result.score);
            results.add(result);
        }
        
        return results;
    }
    
    /**
     * @description Calculate the score for a single lead
     * @param input Lead scoring input data
     * @return Calculated score
     */
    private static Decimal calculateScore(LeadScoringInput input) {
        Decimal score = 0;
        
        // Annual Revenue scoring
        if (input.annualRevenue != null && input.annualRevenue >= REVENUE_THRESHOLD) {
            score += SCORE_HIGH_REVENUE;
        }
        
        // Company size scoring
        if (input.numberOfEmployees != null && input.numberOfEmployees >= EMPLOYEE_THRESHOLD) {
            score += SCORE_LARGE_COMPANY;
        }
        
        // Lead source scoring
        if (isHighQualitySource(input.leadSource)) {
            score += SCORE_HIGH_QUALITY_SOURCE;
        }
        
        // Industry scoring
        if (isHighValueIndustry(input.industry)) {
            score += SCORE_HIGH_VALUE_INDUSTRY;
        }
        
        // Email domain scoring
        if (isCorporateEmail(input.email)) {
            score += SCORE_CORPORATE_EMAIL;
        }
        
        // Title scoring
        if (isDecisionMaker(input.title)) {
            score += SCORE_DECISION_MAKER;
        }
        
        return score;
    }
    
    /**
     * @description Check if lead source is high quality
     * @param leadSource Lead source value
     * @return True if high quality source
     */
    private static Boolean isHighQualitySource(String leadSource) {
        if (String.isBlank(leadSource)) {
            return false;
        }
        
        Set<String> highQualitySources = new Set<String>{
            'Web', 'Referral', 'Partner', 'Advertisement'
        };
        
        return highQualitySources.contains(leadSource);
    }
    
    /**
     * @description Check if industry is high value
     * @param industry Industry value
     * @return True if high value industry
     */
    private static Boolean isHighValueIndustry(String industry) {
        if (String.isBlank(industry)) {
            return false;
        }
        
        Set<String> highValueIndustries = new Set<String>{
            'Technology', 'Finance', 'Healthcare', 'Manufacturing', 
            'Banking', 'Insurance', 'Telecommunications'
        };
        
        return highValueIndustries.contains(industry);
    }
    
    /**
     * @description Check if email is corporate (not free email provider)
     * @param email Email address
     * @return True if corporate email
     */
    private static Boolean isCorporateEmail(String email) {
        if (String.isBlank(email)) {
            return false;
        }
        
        Set<String> freeEmailProviders = new Set<String>{
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
            'aol.com', 'mail.com', 'protonmail.com'
        };
        
        String domain = email.toLowerCase().substringAfter('@');
        return !freeEmailProviders.contains(domain);
    }
    
    /**
     * @description Check if title indicates decision maker
     * @param title Job title
     * @return True if decision maker title
     */
    private static Boolean isDecisionMaker(String title) {
        if (String.isBlank(title)) {
            return false;
        }
        
        String titleLower = title.toLowerCase();
        Set<String> decisionMakerKeywords = new Set<String>{
            'vp', 'vice president', 'director', 'manager', 'head',
            'ceo', 'cto', 'cfo', 'cio', 'coo', 'president', 
            'chief', 'owner', 'founder', 'partner'
        };
        
        for (String keyword : decisionMakerKeywords) {
            if (titleLower.contains(keyword)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @description Determine grade based on score
     * @param score Calculated score
     * @return Grade (A-Hot, B-Warm, C-Cold)
     */
    private static String determineGrade(Decimal score) {
        if (score >= GRADE_A_THRESHOLD) {
            return 'A - Hot';
        } else if (score >= GRADE_B_THRESHOLD) {
            return 'B - Warm';
        } else {
            return 'C - Cold';
        }
    }
    
    /**
     * @description Input class for invocable method
     */
    public class LeadScoringInput {
        @InvocableVariable(label='Lead ID' required=true)
        public Id leadId;
        
        @InvocableVariable(label='Annual Revenue')
        public Decimal annualRevenue;
        
        @InvocableVariable(label='Number of Employees')
        public Integer numberOfEmployees;
        
        @InvocableVariable(label='Lead Source')
        public String leadSource;
        
        @InvocableVariable(label='Industry')
        public String industry;
        
        @InvocableVariable(label='Email')
        public String email;
        
        @InvocableVariable(label='Title')
        public String title;
    }
    
    /**
     * @description Result class for invocable method
     */
    public class LeadScoringResult {
        @InvocableVariable(label='Lead ID')
        public Id leadId;
        
        @InvocableVariable(label='Score')
        public Decimal score;
        
        @InvocableVariable(label='Grade')
        public String grade;
    }
}
