import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import getInvoiceStats from '@salesforce/apex/InvoiceService.getInvoiceStats';
import getAllInvoices from '@salesforce/apex/InvoiceService.getAllInvoices';

export default class InvoiceDashboard extends NavigationMixin(LightningElement) {
    @track statsCards = [];
    @track recentInvoices = [];
    @track error;
    
    @wire(getInvoiceStats)
    wiredStats({ error, data }) {
        if (data) {
            this.processStatsData(data);
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
        }
    }
    
    @wire(getAllInvoices)
    wiredInvoices({ error, data }) {
        if (data) {
            this.processRecentInvoices(data);
            this.error = undefined;
        } else if (error) {
            this.error = error.body.message;
        }
    }
    
    processStatsData(stats) {
        const statusCounts = stats.statusCounts || {};
        const statusTotals = stats.statusTotals || {};
        
        this.statsCards = [
            {
                label: 'Total Invoices',
                count: this.calculateTotalCount(statusCounts),
                amount: this.formatCurrency(stats.grandTotal || 0),
                numberClass: 'stat-number slds-text-color_default'
            },
            {
                label: 'Draft',
                count: statusCounts.Draft || 0,
                amount: this.formatCurrency(statusTotals.Draft || 0),
                numberClass: 'stat-number slds-text-color_weak'
            },
            {
                label: 'Paid',
                count: statusCounts.Paid || 0,
                amount: this.formatCurrency(statusTotals.Paid || 0),
                numberClass: 'stat-number slds-text-color_success'
            },
            {
                label: 'Overdue',
                count: statusCounts.Overdue || 0,
                amount: this.formatCurrency(statusTotals.Overdue || 0),
                numberClass: 'stat-number slds-text-color_error'
            }
        ];
    }
    
    processRecentInvoices(invoices) {
        this.recentInvoices = invoices.slice(0, 5).map(invoice => ({
            ...invoice,
            customerName: invoice.Customer_Account__r ? invoice.Customer_Account__r.Name : 'No Customer',
            formattedAmount: this.formatCurrency(invoice.Total_Amount__c || 0),
            statusClass: this.getStatusClass(invoice.Status__c)
        }));
    }
    
    calculateTotalCount(statusCounts) {
        return Object.values(statusCounts).reduce((total, count) => total + (count || 0), 0);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    getStatusClass(status) {
        const statusClasses = {
            'Draft': 'slds-text-color_weak',
            'Sent': 'slds-text-color_default', 
            'Paid': 'slds-text-color_success',
            'Overdue': 'slds-text-color_error',
            'Cancelled': 'slds-text-color_weak'
        };
        return statusClasses[status] || 'slds-text-color_default';
    }
    
    get hasRecentInvoices() {
        return this.recentInvoices && this.recentInvoices.length > 0;
    }
    
    navigateToInvoiceList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Invoice__c',
                actionName: 'list'
            }
        });
    }
}