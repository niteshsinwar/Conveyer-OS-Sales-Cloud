@isTest
public class LoyaltyPointsControllerTest {

    @testSetup
    static void setupData() {
        Account acc = new Account(Name = 'Test Account', Loyalty_Points__c = 100);
        insert acc;
    }

    @isTest
    static void testGetLoyaltyPoints() {
        Account acc = [SELECT Id FROM Account WHERE Name = 'Test Account' LIMIT 1];
        Test.startTest();
        Decimal points = LoyaltyPointsController.getLoyaltyPoints(acc.Id);
        Test.stopTest();
        System.assertEquals(100, points);
    }

    @isTest
    static void testAddLoyaltyPoints() {
        Account acc = [SELECT Id FROM Account WHERE Name = 'Test Account' LIMIT 1];
        Test.startTest();
        Decimal newPoints = LoyaltyPointsController.addLoyaltyPoints(acc.Id, 50);
        Test.stopTest();
        System.assertEquals(150, newPoints);
    }

    @isTest
    static void testResetLoyaltyPoints() {
        Account acc = [SELECT Id FROM Account WHERE Name = 'Test Account' LIMIT 1];
        Test.startTest();
        LoyaltyPointsController.resetLoyaltyPoints(acc.Id);
        Test.stopTest();
        acc = [SELECT Loyalty_Points__c FROM Account WHERE Id = :acc.Id];
        System.assertEquals(0, acc.Loyalty_Points__c);
    }
}