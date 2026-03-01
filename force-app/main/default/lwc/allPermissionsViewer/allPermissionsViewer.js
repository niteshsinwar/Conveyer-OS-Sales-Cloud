import { LightningElement, wire, track } from 'lwc';
import getPermissionsViewData from '@salesforce/apex/AllPermissionsViewController.getPermissionsViewData';

export default class AllPermissionsViewer extends LightningElement {
    @track permissionsColumns = [];
    @track permissionsData = null; // Use null initially to know when data arrives
    @track isLoading = true; // Start loading automatically
    @track errorMessage = null;
    @track isLimitError = false; // Flag for specific limit error message

    // Datatable sorting properties
    @track sortBy = 'sortKey'; // Default sort from Apex
    @track sortDirection = 'asc';

    profileAndPermSetCount = 0; // To display count in UI
    hasDataRows = false; // Flag to check if rows array actually has data

    // Wire the Apex method to fetch data on load
    @wire(getPermissionsViewData)
    wiredPermissions({ error, data }) {
        console.log('Wire adapter received: ', data, error); // LWC Debugging
        this.isLoading = false; // Stop loading once wire returns
        if (data) {
            this.errorMessage = null; // Clear previous errors
            this.permissionsColumns = data.headers || [];
            this.permissionsData = data.rows || []; // Ensure it's an array
            this.hasDataRows = this.permissionsData.length > 0; // Check if we got actual rows

            // Calculate total count from dynamic headers, even if rows are empty
            this.profileAndPermSetCount = this.permissionsColumns.filter(h => h.fieldName.startsWith('perm_')).length;

            // Set initial sort state (important even if data is empty)
            this.sortBy = 'sortKey';
            this.sortDirection = 'asc';

            // Handle explicit "no data found" scenario vs actual error
            if (!this.hasDataRows && this.profileAndPermSetCount > 0) {
                 console.log('Data received, but no permission rows were generated.');
                 // Message is displayed via template conditional
            } else if (this.profileAndPermSetCount === 0) {
                this.errorMessage = 'No relevant Profiles or Permission Sets found based on the applied filters.';
                this.permissionsData = []; // Ensure empty array
                this.hasDataRows = false;
            }


        } else if (error) {
            this.errorMessage = 'Error loading permissions: ' + this.reduceErrors(error);
            this.isLimitError = this.errorMessage.includes('limits') || this.errorMessage.includes('CPU time limit exceeded');
            this.permissionsData = null; // Clear data on error
            this.permissionsColumns = [];
            this.profileAndPermSetCount = 0;
            this.hasDataRows = false;
            console.error('Error loading permissions:', this.reduceErrors(error));
        }
    }

     // Handle datatable sorting (Client-side)
    handleSort(event) {
        if (!this.permissionsData || this.permissionsData.length === 0) {
            return; // Don't sort if no data
        }
        const { fieldName: sortedBy, sortDirection } = event.detail;
        // Use a clone to ensure reactivity for the datatable
        const cloneData = [...this.permissionsData];
        cloneData.sort(this.sortByField(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.permissionsData = cloneData;
        this.sortBy = sortedBy;
        this.sortDirection = sortDirection;
    }

    // Datatable sorting helper function
    sortByField(field, reverse, primer) {
        const key = primer
            ? function (x) { return primer(x[field]); }
            : function (x) { return x[field]; };

        return function (a, b) {
            a = key(a);
            b = key(b);
            // Handle Yes/No sorting (Yes=1, No=0), text, and nulls (-1)
            const valA = a === 'Yes' ? 1 : (a === 'No' ? 0 : (a ? String(a).toLowerCase() : -1));
            const valB = b === 'Yes' ? 1 : (b === 'No' ? 0 : (b ? String(b).toLowerCase() : -1));
            // Use numeric comparison for Yes/No, fallback to string localeCompare if needed (though unlikely with current data)
            let comparison = 0;
            if (valA > valB) {
                comparison = 1;
            } else if (valA < valB) {
                comparison = -1;
            }
            return comparison * reverse;
        };
    }

    // Utility function to flatten and simplify error objects
    reduceErrors(errors) {
         if (!Array.isArray(errors)) { errors = [errors]; }
         return ( errors
                .filter((error) => !!error)
                .map((error) => {
                    // Standard LWC wire error structure
                    if (error.body) {
                        if (Array.isArray(error.body)) {
                            return error.body.map((e) => e.message);
                        } else if (typeof error.body.message === 'string') {
                            return error.body.message;
                        }
                    }
                    // Apex AuraHandledException
                    else if(error.message && typeof error.message === 'string'){
                         return error.message;
                    }
                    // JS errors
                    else if (typeof error.message === 'string') {
                        return error.message;
                    }
                    // Unknown error shape
                    return error.statusText || JSON.stringify(error) || 'Unknown error';
                })
                .reduce((prev, curr) => prev.concat(curr), []) // Flatten nested arrays
                .filter((message) => !!message) // Remove empty messages
                .join('; ') // Join multiple messages
        );
    }
}