public with sharing class LoyaltyPointsController {
    
    // Get current loyalty points
    @AuraEnabled(cacheable=true)
    public static Decimal getLoyaltyPoints(Id accountId) {
        Account acc = [SELECT Loyalty_Points__c FROM Account WHERE Id = :accountId LIMIT 1];
        return acc.Loyalty_Points__c != null ? acc.Loyalty_Points__c : 0;
    }

    // Add points
    @AuraEnabled
    public static Decimal addLoyaltyPoints(Id accountId, Integer pointsToAdd) {
        Account acc = [SELECT Loyalty_Points__c FROM Account WHERE Id = :accountId LIMIT 1];
        acc.Loyalty_Points__c = (acc.Loyalty_Points__c != null ? acc.Loyalty_Points__c : 0) + pointsToAdd;
        update acc;
        return acc.Loyalty_Points__c;
    }

    // Reset points to zero
    @AuraEnabled
    public static void resetLoyaltyPoints(Id accountId) {
        Account acc = new Account(Id = accountId);
        acc.Loyalty_Points__c = 0;
        update acc;
    }
}