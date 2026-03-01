import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createRecord from '@salesforce/apex/NiteshController.createNiteshObject';
import getRecords from '@salesforce/apex/NiteshController.getAllNiteshObjects';
import getCount from '@salesforce/apex/NiteshController.getNiteshObjectCount';

export default class Niteshlwc extends LightningElement {
    @track fieldValue = '';
    @track records = [];
    @track recordCount = 0;

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
        
        try {
            await createRecord({ fieldValue: this.fieldValue });
            this.showToast('Success', 'Record created successfully', 'success');
            this.fieldValue = '';
            this.loadData();
        } catch (error) {
            this.showToast('Error', 'Failed to create record', 'error');
        }
    }

    async loadData() {
        try {
            this.records = await getRecords();
            this.recordCount = await getCount();
        } catch (error) {
            this.showToast('Error', 'Failed to load data', 'error');
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