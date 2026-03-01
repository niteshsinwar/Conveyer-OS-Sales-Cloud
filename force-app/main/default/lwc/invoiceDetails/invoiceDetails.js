import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import getInvoiceDetails from '@salesforce/apex/InvoiceService.getInvoiceDetails';
import addLineItem from '@salesforce/apex/InvoiceService.addLineItem';
import updateInvoiceStatus from '@salesforce/apex/InvoiceService.updateInvoiceStatus';

export default class InvoiceDetails extends LightningElement {
    @api recordId; // Invoice ID passed from record page or parent component
    
    @track invoice;
    @track lineItems = [];
    @track error;
    @track isLoading = false;
    
    // Modal states
    @track showAddLineItemModal = false;
    @track showStatusModal = false;
    
    // New line item form
    @track newLineItem = {
        productName: '',
        quantity: 1,
        unitPrice: 0
    };
    
    // Status change
    @track selectedNewStatus = '';
    
    wiredInvoiceResult;
    
    statusOptions = [
        { label: 'Draft', value: 'Draft' },
        { label: 'Sent', value: 'Sent' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Overdue', value: 'Overdue' },
        { label: 'Cancelled', value: 'Cancelled' }
    ];
    
    @wire(getInvoiceDetails, { invoiceId: '$recordId' })
    wiredInvoice(result) {
        this.wiredInvoiceResult = result;
        if (result.data) {
            this.invoice = result.data.invoice;
            this.lineItems = result.data.lineItems.map(item => {
                const lineTotal = (item.Quantity__c || 0) * (item.Unit_Price__c || 0);
                return {
                    ...item,
                    formattedUnitPrice: this.formatCurrency(item.Unit_Price__c || 0),
                    formattedLineTotal: this.formatCurrency(lineTotal)
                };
            });
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
            this.invoice = null;
            this.lineItems = [];
        }
    }
    
    get customerName() {
        return this.invoice?.Customer_Account__r?.Name || 'No Customer';
    }
    
    get formattedCreatedDate() {
        if (!this.invoice?.CreatedDate) return '';
        return new Date(this.invoice.CreatedDate).toLocaleDateString();
    }
    
    get formattedTotal() {
        return this.formatCurrency(this.invoice?.Total_Amount__c || 0);
    }
    
    get statusBadgeClass() {
        const baseClass = 'status-badge ';
        const status = this.invoice?.Status__c?.toLowerCase() || 'draft';
        return baseClass + 'status-' + status;
    }
    
    get hasLineItems() {
        return this.lineItems && this.lineItems.length > 0;
    }
    
    get lineItemCount() {
        return this.lineItems ? this.lineItems.length : 0;
    }
    
    get addLineItemDisabled() {
        return !this.newLineItem.productName || 
               !this.newLineItem.quantity || 
               !this.newLineItem.unitPrice;
    }
    
    get updateStatusDisabled() {
        return !this.selectedNewStatus || 
               this.selectedNewStatus === this.invoice?.Status__c;
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    openAddLineItemModal() {
        this.showAddLineItemModal = true;
        this.newLineItem = {
            productName: '',
            quantity: 1,
            unitPrice: 0
        };
    }
    
    openStatusModal() {
        this.showStatusModal = true;
        this.selectedNewStatus = this.invoice?.Status__c || '';
    }
    
    closeModal() {
        this.showAddLineItemModal = false;
        this.showStatusModal = false;
    }
    
    handleLineItemFieldChange(event) {
        const field = event.target.dataset.field;
        const value = event.target.value;
        this.newLineItem = { ...this.newLineItem, [field]: value };
    }
    
    handleStatusChange(event) {
        this.selectedNewStatus = event.target.value;
    }
    
    async addLineItem() {
        this.isLoading = true;
        
        try {
            await addLineItem({
                invoiceId: this.recordId,
                productName: this.newLineItem.productName,
                quantity: parseFloat(this.newLineItem.quantity),
                unitPrice: parseFloat(this.newLineItem.unitPrice)
            });
            
            this.showToast('Success', 'Line item added successfully', 'success');
            this.closeModal();
            
            // Refresh the data
            await refreshApex(this.wiredInvoiceResult);
            
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    async updateStatus() {
        this.isLoading = true;
        
        try {
            await updateInvoiceStatus({
                invoiceId: this.recordId,
                newStatus: this.selectedNewStatus
            });
            
            this.showToast('Success', 'Status updated successfully', 'success');
            this.closeModal();
            
            // Refresh the data
            await refreshApex(this.wiredInvoiceResult);
            
        } catch (error) {
            this.showToast('Error', error.body.message, 'error');
        } finally {
            this.isLoading = false;
        }
    }
    
    async refreshData() {
        this.isLoading = true;
        await refreshApex(this.wiredInvoiceResult);
        this.isLoading = false;
        this.showToast('Success', 'Data refreshed', 'success');
    }
    
    handleLineItemAction(event) {
        const action = event.target.value;
        const itemId = event.target.dataset.itemId;
        
        if (action === 'edit') {
            // Implement edit functionality
            console.log('Edit line item:', itemId);
        } else if (action === 'delete') {
            // Implement delete functionality
            console.log('Delete line item:', itemId);
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