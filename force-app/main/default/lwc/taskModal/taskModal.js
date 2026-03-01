// taskModal.js
import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskModal extends LightningElement {
    @api task;
    @api projectId;
    
    isLoading = false;
    
    get taskId() {
        return this.task?.Id || null;
    }
    
    get modalTitle() {
        return this.taskId ? 'Edit Task' : 'New Task';
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.isLoading = true;
        
        const fields = event.detail.fields;
        fields.Project__c = this.projectId;
        
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
    
    handleSuccess() {
        this.isLoading = false;
        this.dispatchEvent(new CustomEvent('success'));
    }
    
    handleError(event) {
        this.isLoading = false;
        const errorMessage = event.detail?.message || 'An unknown error occurred';
        this.dispatchEvent(new CustomEvent('error', { detail: { message: errorMessage } }));
    }
    
    handleCancel() {
        this.dispatchEvent(new CustomEvent('close'));
    }
}