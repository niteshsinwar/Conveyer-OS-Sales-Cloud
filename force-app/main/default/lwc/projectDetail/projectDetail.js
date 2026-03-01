import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex }                 from '@salesforce/apex';
import { ShowToastEvent }              from 'lightning/platformShowToastEvent';

import getProjectDetails from '@salesforce/apex/ProjectController.getProjectDetails';
import getRelatedTasks    from '@salesforce/apex/TaskController.getRelatedTasks';
import deleteTask         from '@salesforce/apex/TaskController.deleteTask';

export default class ProjectDetail extends LightningElement {
    @api recordId;
    @track project;
    @track tasks;
    @track error;
    @track taskError;

    isModalOpen = false;
    isLoading   = false;
    selectedTask;
    wiredTasksResult;

    columns = [
        { label: 'Task Name',   fieldName: 'TaskName__c' },
        { label: 'Assigned To', fieldName: 'AssignedTo__c' },
        { label: 'Due Date',    fieldName: 'DueDate__c', type: 'date' },
        { label: 'Status',      fieldName: 'Status__c' },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'Edit',   name: 'edit'   },
                    { label: 'Delete', name: 'delete' }
                ]
            }
        }
    ];

    @wire(getProjectDetails, { projectId: '$recordId' })
    wiredProject({ error, data }) {
        if (data) {
            this.project = data;
            this.error   = undefined;
        } else if (error) {
            this.error   = error;
            this.project = undefined;
            this.showToast('Error', 'Error loading project details', 'error');
        }
    }

    @wire(getRelatedTasks, { projectId: '$recordId' })
    wiredTasks(result) {
        this.wiredTasksResult = result;
        const { error, data } = result;
        if (data) {
            this.tasks     = data;
            this.taskError = undefined;
        } else if (error) {
            this.taskError = error;
            this.tasks     = undefined;
            this.showToast('Error', 'Error loading tasks', 'error');
        }
    }

    // --- Getters for template ---
    get projectName()   { return this.project?.Name; }
    get description()   { return this.project?.Description__c; }
    get startDate()     { return this.project?.StartDate__c; }
    get endDate()       { return this.project?.EndDate__c; }
    get status()        { return this.project?.Status__c; }
    get priority()      { return this.project?.Priority__c; }
    get modalHeader()   { return this.selectedTask ? 'Edit Task' : 'New Task'; }

    // --- Task‐Completion Progress ---
    get hasTasks() {
        return Array.isArray(this.tasks) && this.tasks.length > 0;
    }
    get totalTasks() {
        return this.hasTasks ? this.tasks.length : 0;
    }
    get completedTasks() {
        return this.hasTasks
            ? this.tasks.filter(t => t.Status__c === 'Completed').length
            : 0;
    }
    get taskCompletionPercentage() {
        return this.totalTasks > 0
            ? Math.round((this.completedTasks / this.totalTasks) * 100)
            : 0;
    }

    // --- Days Remaining Text ---
    get daysRemainingText() {
        if (!this.startDate || !this.endDate) return '';
        const today = new Date();
        const end   = new Date(this.endDate);
        const days  = Math.max(
            Math.ceil((end - today) / (1000 * 60 * 60 * 24)),
            0
        );
        return `${days} day(s) remaining`;
    }

    // --- Row actions ---
    handleRowAction(event) {
        const { name } = event.detail.action;
        const row      = event.detail.row;
        if (name === 'edit') {
            this.selectedTask = row;
            this.isModalOpen  = true;
        } else if (name === 'delete') {
            if (confirm('Are you sure you want to delete this task?')) {
                this.deleteTask(row.Id);
            }
        }
    }

    openCreateModal() {
        this.selectedTask = null;
        this.isModalOpen  = true;
    }

    closeModal() {
        this.isModalOpen  = false;
        this.selectedTask = null;
    }

    async refreshTasks() {
        this.isLoading = true;
        try {
            await refreshApex(this.wiredTasksResult);
        } finally {
            this.isLoading = false;
        }
    }

    async deleteTask(taskId) {
        this.isLoading = true;
        try {
            await deleteTask({ taskId });
            this.showToast('Success', 'Task deleted successfully', 'success');
            await this.refreshTasks();
        } catch (err) {
            console.error(err);
            this.showToast('Error', 'Error deleting task', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    handleTaskModalSuccess() {
        this.showToast('Success', 'Task saved successfully', 'success');
        this.closeModal();
        this.refreshTasks();
    }

    handleTaskModalError(event) {
        const msg = event.detail.message || 'Unknown error';
        this.showToast('Error', msg, 'error');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}