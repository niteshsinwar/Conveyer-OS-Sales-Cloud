/**
 * Data Generator for testing Invoice Management System
 */
public class InvoiceDataGenerator {
    
    @AuraEnabled
    public static void createTestData() {
        try {
            List<Account> accounts = [SELECT Id FROM Account LIMIT 5];
            if (accounts.isEmpty()) {
                throw new AuraHandledException('No accounts found. Please create some accounts first.');
            }
            
            List<Invoice__c> invoices = new List<Invoice__c>();
            
            // Create sample invoices
            Invoice__c inv1 = new Invoice__c();
            inv1.Customer_Account__c = accounts[0].Id;
            inv1.Invoice_Number__c = 'INV-001';
            inv1.Status__c = 'Draft';
            inv1.Total_Amount__c = 0;
            invoices.add(inv1);
            
            Invoice__c inv2 = new Invoice__c();
            inv2.Customer_Account__c = accounts[1].Id;
            inv2.Invoice_Number__c = 'INV-002';
            inv2.Status__c = 'Sent';
            inv2.Total_Amount__c = 0;
            invoices.add(inv2);
            
            Invoice__c inv3 = new Invoice__c();
            inv3.Customer_Account__c = accounts[2].Id;
            inv3.Invoice_Number__c = 'INV-003';
            inv3.Status__c = 'Paid';
            inv3.Total_Amount__c = 0;
            invoices.add(inv3);
            
            insert invoices;
            
            // Create line items for each invoice
            List<Invoice_Line_Item__c> lineItems = new List<Invoice_Line_Item__c>();
            
            // Line items for INV-001
            Invoice_Line_Item__c item1 = new Invoice_Line_Item__c();
            item1.Invoice__c = invoices[0].Id;
            item1.Product_Name__c = 'Product A';
            item1.Quantity__c = 2;
            item1.Unit_Price__c = 100;
            lineItems.add(item1);
            
            Invoice_Line_Item__c item2 = new Invoice_Line_Item__c();
            item2.Invoice__c = invoices[0].Id;
            item2.Product_Name__c = 'Product B';
            item2.Quantity__c = 1;
            item2.Unit_Price__c = 50;
            lineItems.add(item2);
            
            // Line items for INV-002
            Invoice_Line_Item__c item3 = new Invoice_Line_Item__c();
            item3.Invoice__c = invoices[1].Id;
            item3.Product_Name__c = 'Service X';
            item3.Quantity__c = 5;
            item3.Unit_Price__c = 75;
            lineItems.add(item3);
            
            // Line items for INV-003
            Invoice_Line_Item__c item4 = new Invoice_Line_Item__c();
            item4.Invoice__c = invoices[2].Id;
            item4.Product_Name__c = 'Premium Package';
            item4.Quantity__c = 1;
            item4.Unit_Price__c = 500;
            lineItems.add(item4);
            
            insert lineItems;
            
            // Recalculate totals for all invoices
            for (Invoice__c inv : invoices) {
                InvoiceService.recalculateInvoiceTotal(inv.Id);
            }
            
        } catch (Exception e) {
            throw new AuraHandledException('Error creating test data: ' + e.getMessage());
        }
    }
    
    @AuraEnabled
    public static void deleteAllTestData() {
        try {
            List<Invoice_Line_Item__c> lineItems = [SELECT Id FROM Invoice_Line_Item__c];
            if (!lineItems.isEmpty()) {
                delete lineItems;
            }
            
            List<Invoice__c> invoices = [SELECT Id FROM Invoice__c];
            if (!invoices.isEmpty()) {
                delete invoices;
            }
            
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting test data: ' + e.getMessage());
        }
    }
}