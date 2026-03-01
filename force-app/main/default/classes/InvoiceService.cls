/**
 * InvoiceService - Business logic for Invoice Management System
 */
public with sharing class InvoiceService {
    
    // Status constants
    public static final String STATUS_DRAFT = 'Draft';
    public static final String STATUS_SENT = 'Sent';
    public static final String STATUS_PAID = 'Paid';
    public static final String STATUS_OVERDUE = 'Overdue';
    public static final String STATUS_CANCELLED = 'Cancelled';
    
    /**
     * Create new invoice
     */
    @AuraEnabled
    public static Id createInvoice(String accountId, String invoiceNumber) {
        try {
            // Validate account exists
            List<Account> accounts = [SELECT Id FROM Account WHERE Id = :accountId LIMIT 1];
            if (accounts.isEmpty()) {
                throw new AuraHandledException('Account not found');
            }
            
            Invoice__c invoice = new Invoice__c();
            invoice.Customer_Account__c = accountId;
            invoice.Invoice_Number__c = invoiceNumber;
            invoice.Status__c = STATUS_DRAFT;
            invoice.Total_Amount__c = 0.00;
            
            insert invoice;
            return invoice.Id;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error creating invoice: ' + e.getMessage());
        }
    }
    
    /**
     * Get invoice with line items
     */
    @AuraEnabled(cacheable=true)
    public static InvoiceWrapper getInvoiceDetails(String invoiceId) {
        try {
            List<Invoice__c> invoices = [
                SELECT Id, Name, Invoice_Number__c, Status__c, Total_Amount__c,
                       Customer_Account__c, Customer_Account__r.Name,
                       CreatedDate, LastModifiedDate
                FROM Invoice__c 
                WHERE Id = :invoiceId
                LIMIT 1
            ];
            
            if (invoices.isEmpty()) {
                throw new AuraHandledException('Invoice not found');
            }
            
            List<Invoice_Line_Item__c> lineItems = [
                SELECT Id, Name, Product_Name__c, Quantity__c, Unit_Price__c
                FROM Invoice_Line_Item__c 
                WHERE Invoice__c = :invoiceId
                ORDER BY CreatedDate
            ];
            
            return new InvoiceWrapper(invoices[0], lineItems);
            
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving invoice: ' + e.getMessage());
        }
    }
    
    /**
     * Get all invoices
     */
    @AuraEnabled(cacheable=true)
    public static List<Invoice__c> getAllInvoices() {
        try {
            return [
                SELECT Id, Name, Invoice_Number__c, Status__c, Total_Amount__c,
                       Customer_Account__r.Name, CreatedDate
                FROM Invoice__c 
                ORDER BY CreatedDate DESC
                LIMIT 50
            ];
            
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving invoices: ' + e.getMessage());
        }
    }
    
    /**
     * Add line item to invoice
     */
    @AuraEnabled
    public static String addLineItem(String invoiceId, String productName, 
                                   Decimal quantity, Decimal unitPrice) {
        try {
            Invoice_Line_Item__c lineItem = new Invoice_Line_Item__c();
            lineItem.Invoice__c = invoiceId;
            lineItem.Product_Name__c = productName;
            lineItem.Quantity__c = quantity;
            lineItem.Unit_Price__c = unitPrice;
            
            insert lineItem;
            
            // Recalculate total
            recalculateInvoiceTotal(invoiceId);
            
            return lineItem.Id;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error adding line item: ' + e.getMessage());
        }
    }
    
    /**
     * Update invoice status
     */
    @AuraEnabled
    public static void updateInvoiceStatus(String invoiceId, String newStatus) {
        try {
            List<Invoice__c> invoices = [SELECT Id, Status__c FROM Invoice__c WHERE Id = :invoiceId LIMIT 1];
            if (invoices.isEmpty()) {
                throw new AuraHandledException('Invoice not found');
            }
            
            Invoice__c invoice = invoices[0];
            
            // Business rule validation
            if (invoice.Status__c == STATUS_PAID && newStatus == STATUS_DRAFT) {
                throw new AuraHandledException('Cannot change paid invoice back to draft');
            }
            
            invoice.Status__c = newStatus;
            update invoice;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error updating status: ' + e.getMessage());
        }
    }
    
    /**
     * Calculate total from line items
     */
    public static void recalculateInvoiceTotal(String invoiceId) {
        List<Invoice_Line_Item__c> lineItems = [
            SELECT Quantity__c, Unit_Price__c 
            FROM Invoice_Line_Item__c 
            WHERE Invoice__c = :invoiceId
        ];
        
        Decimal total = 0;
        for (Invoice_Line_Item__c item : lineItems) {
            if (item.Quantity__c != null && item.Unit_Price__c != null) {
                total += (item.Quantity__c * item.Unit_Price__c);
            }
        }
        
        Invoice__c invoice = new Invoice__c(Id = invoiceId, Total_Amount__c = total);
        update invoice;
    }
    
    /**
     * Get invoice statistics
     */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getInvoiceStats() {
        try {
            AggregateResult[] results = [
                SELECT Status__c, COUNT(Id) cnt, SUM(Total_Amount__c) total
                FROM Invoice__c 
                GROUP BY Status__c
            ];
            
            Map<String, Decimal> statusCounts = new Map<String, Decimal>();
            Map<String, Decimal> statusTotals = new Map<String, Decimal>();
            Decimal grandTotal = 0;
            
            for (AggregateResult ar : results) {
                String status = (String) ar.get('Status__c');
                Decimal count = (Decimal) ar.get('cnt');
                Decimal total = (Decimal) ar.get('total');
                
                statusCounts.put(status, count);
                statusTotals.put(status, total != null ? total : 0);
                grandTotal += (total != null ? total : 0);
            }
            
            Map<String, Object> stats = new Map<String, Object>();
            stats.put('statusCounts', statusCounts);
            stats.put('statusTotals', statusTotals);
            stats.put('grandTotal', grandTotal);
            
            return stats;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error getting statistics: ' + e.getMessage());
        }
    }
    
    /**
     * Wrapper class for invoice details
     */
    public class InvoiceWrapper {
        @AuraEnabled public Invoice__c invoice { get; set; }
        @AuraEnabled public List<Invoice_Line_Item__c> lineItems { get; set; }
        
        public InvoiceWrapper(Invoice__c inv, List<Invoice_Line_Item__c> items) {
            this.invoice = inv;
            this.lineItems = items;
        }
    }
}