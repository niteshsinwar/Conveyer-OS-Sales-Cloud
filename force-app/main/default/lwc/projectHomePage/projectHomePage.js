import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import getProjects from '@salesforce/apex/ProjectController.getProjects';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class ProjectHomePage extends NavigationMixin(LightningElement) {
    @track projects = [];
    @track allProjects = [];
    @track error;
    @track sortedBy = 'Name';
    @track sortedDirection = 'asc';
    @track isLoading = true;
    @track searchTerm = '';
    
    wiredProjectsResult; // Store wire result for refreshApex
    channelName = '/data/Project__c';
    subscription = null;

    // Define columns including roll-up counts and actions
    columns = [
        {
            label: 'Index',
            fieldName: 'index',
            type: 'number',
            sortable: false
        },
        {
            label: 'Project Name',
            fieldName: 'recordLink',
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'Name' },
                target: '_self'
            },
            sortable: true
        },
        { 
            label: 'Start Date', 
            fieldName: 'StartDate__c', 
            type: 'date', 
            typeAttributes: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            sortable: true 
        },
        { 
            label: 'End Date', 
            fieldName: 'EndDate__c', 
            type: 'date', 
            typeAttributes: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            sortable: true 
        },
        {
            label: 'Status',
            fieldName: 'Status__c',
            type: 'text',
            sortable: true,
            cellAttributes: {
                class: { fieldName: 'statusClass' }
            }
        },
        {
            label: 'Priority',
            fieldName: 'Priority__c',
            type: 'text',
            sortable: true,
            cellAttributes: {
                class: { fieldName: 'priorityClass' }
            }
        },
        {
            label: 'Tasks Progress',
            fieldName: 'progressValue',
            type: 'percent',
            cellAttributes: {
                iconName: 'utility:chart',
                iconPosition: 'left',
                class: { fieldName: 'progressClass' }
            }
        },
        {
            label: 'Not Started',
            fieldName: 'notStartedCount',
            type: 'number',
            cellAttributes: {
                iconName: 'utility:pause',
                iconPosition: 'left'
            }
        },
        {
            label: 'On Hold',
            fieldName: 'onHoldCount',
            type: 'number',
            cellAttributes: {
                iconName: 'utility:pause',
                iconPosition: 'left'
            }
        },
        {
            label: 'Completed',
            fieldName: 'completedCount',
            type: 'number',
            cellAttributes: {
                iconName: 'utility:success',
                iconPosition: 'left'
            }
        },
        {
            label: 'Total Tasks',
            fieldName: 'totalTasks',
            type: 'number',
            cellAttributes: {
                iconName: 'utility:list',
                iconPosition: 'left'
            }
        },
        {
            type: 'action',
            typeAttributes: {
                rowActions: [
                    { label: 'View', name: 'view', iconName: 'utility:preview' },
                    { label: 'Edit', name: 'edit', iconName: 'utility:edit' },
                    { label: 'Delete', name: 'delete', iconName: 'utility:delete' }
                ]
            }
        }
    ];

    connectedCallback() {
        // Subscribe to platform events for real-time updates
        this.subscribeToChannel();
    }

    disconnectedCallback() {
        // Unsubscribe from channel when component is destroyed
        this.unsubscribeFromChannel();
    }

    subscribeToChannel() {
        // Register error listener       
        onError(error => {
            this.showToast('Error', 'Error receiving real-time updates: ' + error.body.message, 'error');
        });
        
        // Subscribe to platform event
        subscribe(this.channelName, -1, message => {
            this.handleProjectUpdate(message);
        }).then(response => {
            this.subscription = response;
        });
    }
    
    unsubscribeFromChannel() {
        if (this.subscription) {
            unsubscribe(this.subscription, () => {
                this.subscription = null;
            });
        }
    }
    
    handleProjectUpdate(message) {
        // Refresh data when real-time updates occur
        if (this.wiredProjectsResult) {
            this.isLoading = true;
            refreshApex(this.wiredProjectsResult)
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }

    @wire(getProjects)
    wiredProjects(result) {
        this.wiredProjectsResult = result;
        const { error, data } = result;
        
        if (data) {
            // Keep master list for filtering
            this.allProjects = data.map((p, index) => {
                // Build record link and roll-up counts from subquery
                const tasks = p.Tasks__r || [];
                const notStarted = tasks.filter(t => t.Status__c === 'Not Started').length;
                const onHold = tasks.filter(t => t.Status__c === 'On Hold').length;
                const completed = tasks.filter(t => t.Status__c === 'Completed').length;
                const total = tasks.length;
                
                // Calculate progress percentage
                const progressValue = total > 0 ? completed / total : 0;
                
                // Dynamic styling classes based on field values
                const statusClass = this.getStatusClass(p.Status__c);
                const priorityClass = this.getPriorityClass(p.Priority__c);
                const progressClass = this.getProgressClass(progressValue);
                
                return {
                    ...p,
                    index: index + 1, // Add index here
                    recordLink: `/lightning/r/Project__c/${p.Id}/view`,
                    notStartedCount: notStarted,
                    onHoldCount: onHold,
                    completedCount: completed,
                    totalTasks: total,
                    progressValue,
                    statusClass,
                    priorityClass,
                    progressClass
                };
            });
            
            // Apply current filter
            this.filterProjects();
            this.error = undefined;
        } else if (error) {
            this.handleError(error);
            this.projects = [];
        }
        
        this.isLoading = false;
    }

    getStatusClass(status) {
        switch (status) {
            case 'Completed': return 'slds-text-color_success';
            case 'In Progress': return 'slds-text-color_default';
            case 'Not Started': return 'slds-text-color_weak';
            case 'On Hold': return 'slds-text-color_warning';
            default: return '';
        }
    }
    
    getPriorityClass(priority) {
        switch (priority) {
            case 'High': return 'slds-text-color_error';
            case 'Medium': return 'slds-text-color_warning';
            case 'Low': return 'slds-text-color_success';
            default: return '';
        }
    }
    
    getProgressClass(progress) {
        if (progress >= 0.75) return 'slds-text-color_success';
        if (progress >= 0.5) return 'slds-text-color_default';
        if (progress >= 0.25) return 'slds-text-color_warning';
        return 'slds-text-color_error';
    }

    handleSearchChange(event) {
        this.searchTerm = event.target.value.toLowerCase();
        this.filterProjects();
    }
    
    filterProjects() {
        if (!this.searchTerm) {
            this.projects = [...this.allProjects];
            return;
        }
        
        this.projects = this.allProjects.filter(proj =>
            (proj.Name && proj.Name.toLowerCase().includes(this.searchTerm)) ||
            (proj.Status__c && proj.Status__c.toLowerCase().includes(this.searchTerm)) ||
            (proj.Priority__c && proj.Priority__c.toLowerCase().includes(this.searchTerm))
        );
    }

    handleSort(event) {
        const { fieldName, sortDirection } = event.detail;
        this.sortedBy = fieldName;
        this.sortedDirection = sortDirection;
        
        // Sort function with null/undefined handling
        this.projects = [...this.projects].sort((a, b) => {
            const aVal = a[fieldName] !== undefined && a[fieldName] !== null ? a[fieldName] : '';
            const bVal = b[fieldName] !== undefined && b[fieldName] !== null ? b[fieldName] : '';
            
            // String comparison for string values
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            
            // Numeric comparison for numbers and dates
            return sortDirection === 'asc'
                ? (aVal > bVal ? 1 : -1)
                : (aVal < bVal ? 1 : -1);
        });
    }

    handleRowAction(event) {
        const { action, row } = event.detail;
        
        switch (action.name) {
            case 'view':
                this.navigateToRecord(row.Id, 'view');
                break;
                
            case 'edit':
                this.navigateToRecord(row.Id, 'edit');
                break;
                
            case 'delete':
                this.handleDeleteProject(row);
                break;
                
            default:
                break;
        }
    }
    
    navigateToRecord(recordId, actionName) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Project__c',
                actionName: actionName
            }
        });
    }
    
    handleDeleteProject(row) {
        // Confirm before deleting
        if (!confirm(`Are you sure you want to delete the project "${row.Name}"?`)) {
            return;
        }
        
        this.isLoading = true;
        
        deleteRecord(row.Id)
            .then(() => {
                // Refresh local data
                this.projects = this.projects.filter(p => p.Id !== row.Id);
                this.allProjects = this.allProjects.filter(p => p.Id !== row.Id);
                
                this.showToast('Success', `Project "${row.Name}" was deleted.`, 'success');
            })
            .catch(error => {
                this.handleError(error);
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    handleAddProject() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Project__c',
                actionName: 'new'
            }
        });
    }
    
    handleRefresh() {
        this.isLoading = true;
        
        if (this.wiredProjectsResult) {
            refreshApex(this.wiredProjectsResult)
                .finally(() => {
                    this.isLoading = false;
                    this.showToast('Success', 'Project data refreshed', 'success');
                });
        } else {
            this.isLoading = false;
        }
    }
    
    handleError(error) {
        this.error = error;
        
        let errorMessage = 'Unknown error';
        if (Array.isArray(error.body)) {
            errorMessage = error.body.map(e => e.message).join(', ');
        } else if (error.body && typeof error.body.message === 'string') {
            errorMessage = error.body.message;
        } else if (typeof error.message === 'string') {
            errorMessage = error.message;
        }
        
        this.showToast('Error', errorMessage, 'error');
    }
    
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
    
    get hasProjects() {
        return this.projects && this.projects.length > 0;
    }
    
    get noProjectsMessage() {
        return this.searchTerm ? 
            'No projects match your search criteria.' : 
            'No projects found. Click "Add Project" to create one.';
    }
}