/**
 * Test class for InvoiceService
 */
@isTest
public class InvoiceServiceTest {
    
    @TestSetup
    static void setupTestData() {
        // Create test account
        Account testAccount = new Account(Name = 'Test Customer Inc');
        insert testAccount;
        
        // Create test invoice
        Invoice__c testInvoice = new Invoice__c();
        testInvoice.Customer_Account__c = testAccount.Id;
        testInvoice.Invoice_Number__c = 'INV-001';
        testInvoice.Status__c = InvoiceService.STATUS_DRAFT;
        testInvoice.Total_Amount__c = 0;
        insert testInvoice;
        
        // Create test line items
        List<Invoice_Line_Item__c> lineItems = new List<Invoice_Line_Item__c>();
        
        Invoice_Line_Item__c item1 = new Invoice_Line_Item__c();
        item1.Invoice__c = testInvoice.Id;
        item1.Product_Name__c = 'Product A';
        item1.Quantity__c = 2;
        item1.Unit_Price__c = 100;
        lineItems.add(item1);
        
        Invoice_Line_Item__c item2 = new Invoice_Line_Item__c();
        item2.Invoice__c = testInvoice.Id;
        item2.Product_Name__c = 'Product B';
        item2.Quantity__c = 1;
        item2.Unit_Price__c = 50;
        lineItems.add(item2);
        
        insert lineItems;
    }
    
    @isTest
    static void testCreateInvoice() {
        Account testAccount = [SELECT Id FROM Account LIMIT 1];
        
        Test.startTest();
        Id invoiceId = InvoiceService.createInvoice(testAccount.Id, 'INV-002');
        Test.stopTest();
        
        Invoice__c createdInvoice = [SELECT Id, Invoice_Number__c, Status__c, Customer_Account__c 
                                     FROM Invoice__c WHERE Id = :invoiceId];
        
        System.assertEquals('INV-002', createdInvoice.Invoice_Number__c);
        System.assertEquals(InvoiceService.STATUS_DRAFT, createdInvoice.Status__c);
        System.assertEquals(testAccount.Id, createdInvoice.Customer_Account__c);
    }
    
    @isTest
    static void testGetInvoiceDetails() {
        Invoice__c testInvoice = [SELECT Id FROM Invoice__c LIMIT 1];
        
        Test.startTest();
        InvoiceService.InvoiceWrapper wrapper = InvoiceService.getInvoiceDetails(testInvoice.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, wrapper);
        System.assertNotEquals(null, wrapper.invoice);
        System.assertEquals(2, wrapper.lineItems.size());
    }
    
    @isTest
    static void testGetAllInvoices() {
        Test.startTest();
        List<Invoice__c> invoices = InvoiceService.getAllInvoices();
        Test.stopTest();
        
        System.assertEquals(1, invoices.size());
    }
    
    @isTest
    static void testAddLineItem() {
        Invoice__c testInvoice = [SELECT Id FROM Invoice__c LIMIT 1];
        
        Test.startTest();
        String lineItemId = InvoiceService.addLineItem(testInvoice.Id, 'Product C', 3, 75);
        Test.stopTest();
        
        Invoice_Line_Item__c createdItem = [SELECT Product_Name__c, Quantity__c, Unit_Price__c 
                                            FROM Invoice_Line_Item__c WHERE Id = :lineItemId];
        
        System.assertEquals('Product C', createdItem.Product_Name__c);
        System.assertEquals(3, createdItem.Quantity__c);
        System.assertEquals(75, createdItem.Unit_Price__c);
        
        // Check if invoice total was recalculated
        Invoice__c updatedInvoice = [SELECT Total_Amount__c FROM Invoice__c WHERE Id = :testInvoice.Id];
        System.assertEquals(475, updatedInvoice.Total_Amount__c); // (2*100) + (1*50) + (3*75)
    }
    
    @isTest
    static void testUpdateInvoiceStatus() {
        Invoice__c testInvoice = [SELECT Id FROM Invoice__c LIMIT 1];
        
        Test.startTest();
        InvoiceService.updateInvoiceStatus(testInvoice.Id, InvoiceService.STATUS_SENT);
        Test.stopTest();
        
        Invoice__c updatedInvoice = [SELECT Status__c FROM Invoice__c WHERE Id = :testInvoice.Id];
        System.assertEquals(InvoiceService.STATUS_SENT, updatedInvoice.Status__c);
    }
    
    @isTest
    static void testUpdateInvoiceStatusValidation() {
        Invoice__c testInvoice = [SELECT Id FROM Invoice__c LIMIT 1];
        
        // First set status to paid
        testInvoice.Status__c = InvoiceService.STATUS_PAID;
        update testInvoice;
        
        Test.startTest();
        try {
            InvoiceService.updateInvoiceStatus(testInvoice.Id, InvoiceService.STATUS_DRAFT);
            System.assert(false, 'Exception should have been thrown');
        } catch (AuraHandledException e) {
            System.assert(e.getMessage().contains('Cannot change paid invoice back to draft'));
        }
        Test.stopTest();
    }
    
    @isTest
    static void testGetInvoiceStats() {
        Test.startTest();
        Map<String, Object> stats = InvoiceService.getInvoiceStats();
        Test.stopTest();
        
        System.assertNotEquals(null, stats);
        System.assert(stats.containsKey('statusCounts'));
        System.assert(stats.containsKey('statusTotals'));
        System.assert(stats.containsKey('grandTotal'));
    }
    
    @isTest
    static void testRecalculateInvoiceTotal() {
        Invoice__c testInvoice = [SELECT Id FROM Invoice__c LIMIT 1];
        
        Test.startTest();
        InvoiceService.recalculateInvoiceTotal(testInvoice.Id);
        Test.stopTest();
        
        Invoice__c updatedInvoice = [SELECT Total_Amount__c FROM Invoice__c WHERE Id = :testInvoice.Id];
        System.assertEquals(250, updatedInvoice.Total_Amount__c); // (2*100) + (1*50)
    }
}