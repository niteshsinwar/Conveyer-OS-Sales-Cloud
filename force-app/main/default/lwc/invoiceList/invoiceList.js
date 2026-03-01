import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

import getAllInvoices from '@salesforce/apex/InvoiceService.getAllInvoices';
import getInvoiceStats from '@salesforce/apex/InvoiceService.getInvoiceStats';
import createInvoice from '@salesforce/apex/InvoiceService.createInvoice';
import updateInvoiceStatus from '@salesforce/apex/InvoiceService.updateInvoiceStatus';

export default class InvoiceList extends NavigationMixin(LightningElement) {
    @track invoices = [];
    @track statsCards = [];
    @track error;
    @track isLoading = false;
    @track searchTerm = '';
    @track selectedStatus = '';
    
    // Modal properties
    @track showNewInvoiceModal = false;
    @track selectedAccountId = '';
    @track newInvoiceNumber = '';
    
    // Wired data
    wiredInvoicesResult;
    wiredStatsResult;
    
    // Data table columns
    columns = [
        {
            label: 'Invoice Number',
            fieldName: 'Invoice_Number__c',
            type: 'text',
            sortable: true
        },
        {
            label: 'Customer',
            fieldName: 'CustomerName',
            type: 'text',
            sortable: true
        },
        {
            label: 'Status',
            fieldName: 'Status__c',
            type: 'text',
            cellAttributes: {
                class: { fieldName: 'statusClass' }
            }
        },
        {
            label: 'Total Amount',
            fieldName: 'Total_Amount__c',
            type: 'currency',
            sortable: true
        },
        {
            label: 'Created Date',
            fieldName: 'CreatedDate',
            type: 'date',
            sortable: true
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'View', name: 'view' },
                    { label: 'Edit Status', name: 'edit_status' },
                    { label: 'Add Line Items', name: 'add_items' }
                ]
            }
        }
    ];
    
    // Status options for filter
    statusOptions = [
        { label: 'All', value: '' },
        { label: 'Draft', value: 'Draft' },
        { label: 'Sent', value: 'Sent' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Overdue', value: 'Overdue' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];
    
    @wire(getAllInvoices)
    wiredInvoices(result) {
        this.wiredInvoicesResult = result;
        if (result.data) {
            this.invoices = result.data.map(invoice => {
                return {
                    ...invoice,
                    CustomerName: invoice.Customer_Account__r ? invoice.Customer_Account__r.Name : 'No Customer',
                    statusClass: this.getStatusClass(invoice.Status__c)
                };
            });
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
            this.invoices = [];
        }
    }
    
    @wire(getInvoiceStats)
    wiredStats(result) {
        this.wiredStatsResult = result;
        if (result.data) {
            this.processStatsData(result.data);
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
        }
    }
    
    processStatsData(stats) {
        const statusCounts = stats.statusCounts || {};
        const statusTotals = stats.statusTotals || {};
        
        this.statsCards = [
            {
                title: 'Draft',
                count: statusCounts.Draft || 0,
                total: this.formatCurrency(statusTotals.Draft || 0)
            },
            {
                title: 'Sent', 
                count: statusCounts.Sent || 0,
                total: this.formatCurrency(statusTotals.Sent || 0)
            },
            {
                title: 'Paid',
                count: statusCounts.Paid || 0,
                total: this.formatCurrency(statusTotals.Paid || 0)
            },
            {
                title: 'Total Value',
                count: '',
                total: this.formatCurrency(stats.grandTotal || 0)
            }
        ];
    }
    
    getStatusClass(status) {
        const statusClasses = {
            'Draft': 'slds-text-color_weak',
            'Sent': 'slds-text-color_default',
            'Paid': 'slds-text-color_success',
            'Overdue': 'slds-text-color_error',
            'Cancelled': 'slds-text-color_weak'
        };
        return statusClasses[status] || '';
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        
        switch (actionName) {
            case 'view':
                this.viewInvoice(row.Id);
                break;
            case 'edit_status':
                this.editInvoiceStatus(row);
                break;
            case 'add_items':
                this.addLineItems(row.Id);
                break;
        }
    }
    
    viewInvoice(invoiceId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: invoiceId,
                actionName: 'view'
            }
        });
    }
    
    editInvoiceStatus(invoice) {
        // This would open a modal or inline edit
        console.log('Edit status for:', invoice.Id);
    }
    
    addLineItems(invoiceId) {
        // Navigate to line items component
        console.log('Add line items for:', invoiceId);
    }
    
    handleSearchChange(event) {
        this.searchTerm = event.target.value;
        // Implement search logic
    }
    
    handleStatusChange(event) {
        this.selectedStatus = event.target.value;
        // Implement filtering logic
    }
    
    openNewInvoiceModal() {
        this.showNewInvoiceModal = true;
        this.selectedAccountId = '';
        this.newInvoiceNumber = this.generateInvoiceNumber();
    }
    
    closeModal() {
        this.showNewInvoiceModal = false;
    }
    
    handleAccountChange(event) {
        this.selectedAccountId = event.target.value;
    }
    
    handleInvoiceNumberChange(event) {
        this.newInvoiceNumber = event.target.value;
    }
    
    get createDisabled() {
        return !this.selectedAccountId || !this.newInvoiceNumber;
    }
    
    generateInvoiceNumber() {
        const now = new Date();
        const timestamp = now.getTime().toString().slice(-6);
        return `INV-${timestamp}`;
    }
    
    async createNewInvoice() {
        this.isLoading = true;
        
        try {
            await createInvoice({
                accountId: this.selectedAccountId,
                invoiceNumber: this.newInvoiceNumber
            });
            
            this.showToast('Success', 'Invoice created successfully', 'success');
            this.closeModal();
            
            // Refresh the data
            await refreshApex(this.wiredInvoicesResult);
            await refreshApex(this.wiredStatsResult);
            
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        }));
    }
}