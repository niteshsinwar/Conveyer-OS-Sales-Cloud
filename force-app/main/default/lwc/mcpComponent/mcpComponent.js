import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createRecord from '@salesforce/apex/MCPController.createMCPObject';
import getRecords from '@salesforce/apex/MCPController.getAllMCPObjects';
import deleteRecord from '@salesforce/apex/MCPController.deleteMCPObject';
import getCount from '@salesforce/apex/MCPController.getMCPObjectCount';

export default class McpComponent extends LightningElement {
    @track fieldValue = '';
    @track records = [];
    @track recordCount = 0;
    @track isLoading = false;

    connectedCallback() {
        this.loadData();
    }

    handleChange(event) {
        this.fieldValue = event.target.value;
    }

    async handleCreate() {
        if (!this.fieldValue.trim()) {
            this.showToast('Error', 'Please enter a value', 'error');
            return;
        }
        
        this.isLoading = true;
        try {
            await createRecord({ fieldValue: this.fieldValue });
            this.showToast('Success', 'MCP Record created successfully', 'success');
            this.fieldValue = '';
            this.loadData();
        } catch (error) {
            this.showToast('Error', 'Failed to create MCP record', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async handleDelete(event) {
        const recordId = event.target.dataset.id;
        this.isLoading = true;
        try {
            await deleteRecord({ recordId: recordId });
            this.showToast('Success', 'MCP Record deleted successfully', 'success');
            this.loadData();
        } catch (error) {
            this.showToast('Error', 'Failed to delete MCP record', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async loadData() {
        this.isLoading = true;
        try {
            this.records = await getRecords();
            this.recordCount = await getCount();
        } catch (error) {
            this.showToast('Error', 'Failed to load MCP data', 'error');
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