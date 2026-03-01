import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

// Apex Methods
import getAllAllowedObjectConfigs from '@salesforce/apex/AllowedObjectsManagerController.getAllAllowedObjectConfigs';
import getSObjectOptions from '@salesforce/apex/AllowedObjectsManagerController.getSObjectOptions';
import getFieldOptions from '@salesforce/apex/AllowedObjectsManagerController.getFieldOptions';
import saveAllowedObjectConfig from '@salesforce/apex/AllowedObjectsManagerController.saveAllowedObjectConfig';
import deleteAllowedObjectConfig from '@salesforce/apex/AllowedObjectsManagerController.deleteAllowedObjectConfig';
import fetchAllowedObjectRecords from '@salesforce/apex/AllowedObjectsManagerController.fetchAllowedObjectRecords';

const ACTIONS = [ /* ... as before ... */ ];
const CONFIG_COLUMNS = [ /* ... as before ... */ ];

export default class AllowedObjectsManager extends LightningElement {
    // --- PROPERTIES FOR DISPLAYING CONFIGURATIONS ---
    @track columns = CONFIG_COLUMNS;
    @track allowedConfigs = [];
    @track wiredConfigsResult; // To hold the provisioned data from wire for refreshApex
    @track isLoading = true; // Spinner for main table loading
    @track sortDirection = 'asc';
    @track sortedBy = 'objectApiName';

    // --- PROPERTIES FOR CONFIGURATION MODAL (ADD/EDIT) ---
    @track showModal = false;
    @track modalTitle = '';
    @track currentConfig; // This will hold the data for the record being edited or created
    @track isEditMode = false;
    @track isSaving = false; // Spinner for save button

    // --- PROPERTIES FOR SOBJECT AND FIELD SELECTION IN MODAL ---
    @track sObjectOptions = []; // Options for the SObject combobox
    @track _allFieldOptionsCache = {}; // Cache: { objectApiName: [fieldOptions] }
    @track fieldOptions = []; // Field options for the currently selected SObject in the dual-listbox
    @track selectedFields = []; // Values (field API names) selected in the dual-listbox

    // --- PROPERTIES FOR RECORD VIEW MODAL ---
    @track showRecordModal = false;
    @track recordsData = [];
    @track recordColumns = [];
    @track isLoadingRecords = false; // Spinner for record view modal
    @track selectedObjectConfigName = ''; // For record modal title
    @track recordsFound = 0;

    // --- LIFECYCLE & INITIALIZATION ---
    constructor() {
        super();
        // Initialize currentConfig when the component is created.
        // This ensures 'this.currentConfig' is always an object with a defined structure.
        this.currentConfig = this.getInitialCurrentConfig();
        console.log('LWC_LIFE: Constructor - Initial currentConfig:', JSON.parse(JSON.stringify(this.currentConfig)));
    }

    connectedCallback() {
        console.log('LWC_LIFE: connectedCallback started.');
        this.loadSObjectOptions(); // Load SObject options once
    }

    /**
     * Returns a fresh, default object for 'currentConfig'.
     * This is the blueprint for a new configuration.
     */
    getInitialCurrentConfig() {
        const initialConfig = {
            recordId: null,             // Null for new records
            objectApiName: '',          // Empty string, not null
            allowedFieldsApiNames: '',  // Empty string, not null
            description: '',            // Empty string, not null
            isActive: true,             // Default to true for new configurations
            technicalNotes: ''          // Empty string, not null
        };
        console.log('LWC_FN: getInitialCurrentConfig executed, returning:', JSON.parse(JSON.stringify(initialConfig)));
        return initialConfig;
    }

    // --- DATA LOADING (SObjects, Configs, Fields) ---
    loadSObjectOptions() {
        console.log('LWC_DATA: loadSObjectOptions called.');
        getSObjectOptions()
            .then(data => {
                this.sObjectOptions = data || [];
                console.log('LWC_DATA: SObject options loaded successfully:', data);
            })
            .catch(error => {
                console.error('LWC_DATA_ERROR: Failed to load SObject options:', this.getErrorMessage(error));
                this.showToast('Error Loading SObjects', this.getErrorMessage(error), 'error');
            });
    }

    @wire(getAllAllowedObjectConfigs)
    wiredAllowedConfigs(result) {
        console.log('LWC_WIRE: wiredAllowedConfigs triggered.');
        this.isLoading = true;
        this.wiredConfigsResult = result; // Store the provisioned value
        if (result.data) {
            console.log('LWC_WIRE: Data received for allowedConfigs:', result.data);
            // Process data for display (e.g., creating 'allowedFieldsDisplay')
            const processedData = result.data.map(item => {
                const fieldCount = item.allowedFieldsApiNames ? item.allowedFieldsApiNames.split(',').filter(f => f.trim()).length : 0;
                return {
                    ...item, // Spread existing item properties
                    // Create a display string for the number of fields
                    allowedFieldsDisplay: `${fieldCount} field(s)${fieldCount > 0 && fieldCount < 5 && item.allowedFieldsApiNames ? ': ' + item.allowedFieldsApiNames.split(',').slice(0,3).join(', ') + (fieldCount > 3 ? '...' : '') : ''}`,
                };
            });
            this.allowedConfigs = this.sortData(this.sortedBy, this.sortDirection, processedData);
            console.log('LWC_WIRE: Processed allowedConfigs for datatable:', JSON.parse(JSON.stringify(this.allowedConfigs)));
        } else if (result.error) {
            console.error('LWC_WIRE_ERROR: Error in wiredAllowedConfigs:', this.getErrorMessage(result.error));
            this.showToast('Error Loading Configurations', this.getErrorMessage(result.error), 'error');
            this.allowedConfigs = [];
        }
        this.isLoading = false;
    }

    // --- MODAL INPUT HANDLERS (UPDATING `currentConfig` and `selectedFields`) ---

    /**
     * Handles changes to the SObject combobox.
     * Updates `currentConfig.objectApiName` and fetches/loads field options.
     */
    async handleSObjectChange(event) {
        const selectedObjectApiName = event.detail.value;
        console.log('LWC_INPUT: handleSObjectChange - Selected Object API Name:', selectedObjectApiName);
        console.log('LWC_INPUT: handleSObjectChange - currentConfig BEFORE SObject change:', JSON.parse(JSON.stringify(this.currentConfig)));

        // To update 'currentConfig' reactively, create a new object.
        this.currentConfig = {
            ...this.currentConfig, // Preserve other existing values from currentConfig
            objectApiName: selectedObjectApiName, // Update the objectApiName
            allowedFieldsApiNames: '' // Reset related fields because the object changed
        };
        this.selectedFields = []; // Reset the dual-listbox selection

        console.log('LWC_INPUT: handleSObjectChange - currentConfig AFTER SObject change:', JSON.parse(JSON.stringify(this.currentConfig)));

        this.fieldOptions = []; // Clear previous field options
        if (selectedObjectApiName) {
            if (this._allFieldOptionsCache[selectedObjectApiName]) {
                this.fieldOptions = this._allFieldOptionsCache[selectedObjectApiName];
                console.log('LWC_INPUT: handleSObjectChange - Loaded field options from cache for:', selectedObjectApiName);
            } else {
                console.log('LWC_INPUT: handleSObjectChange - Fetching field options for:', selectedObjectApiName);
                // Add a local loading indicator if desired for fields, or rely on modal state
                try {
                    const data = await getFieldOptions({ objectApiName: selectedObjectApiName });
                    this.fieldOptions = data || [];
                    this._allFieldOptionsCache[selectedObjectApiName] = data || [];
                    console.log('LWC_INPUT: handleSObjectChange - Fetched and cached field options:', data);
                } catch (error) {
                    console.error('LWC_INPUT_ERROR: handleSObjectChange - Error loading fields:', this.getErrorMessage(error));
                    this.showToast('Error Loading Fields', `Failed to load fields for ${selectedObjectApiName}: ${this.getErrorMessage(error)}`, 'error');
                }
            }
        }
    }

    /**
     * Handles changes to the fields selected in the dual-listbox.
     * Updates `this.selectedFields` (the array of selected field API names).
     * Updates `this.currentConfig.allowedFieldsApiNames` (the comma-separated string).
     */
    handleFieldSelectionChange(event) {
        // event.detail.value is an array of selected field API names from the dual-listbox
        this.selectedFields = event.detail.value || [];
        const newAllowedFieldsApiNames = this.selectedFields.join(',');

        console.log('LWC_INPUT: handleFieldSelectionChange - New selectedFields array:', JSON.parse(JSON.stringify(this.selectedFields)));
        console.log('LWC_INPUT: handleFieldSelectionChange - Derived allowedFieldsApiNames string:', newAllowedFieldsApiNames);
        console.log('LWC_INPUT: handleFieldSelectionChange - currentConfig BEFORE field change:', JSON.parse(JSON.stringify(this.currentConfig)));
        
        // Update currentConfig with the new comma-separated string of field names
        this.currentConfig = {
            ...this.currentConfig, // Preserve other values
            allowedFieldsApiNames: newAllowedFieldsApiNames
        };
        console.log('LWC_INPUT: handleFieldSelectionChange - currentConfig AFTER field change:', JSON.parse(JSON.stringify(this.currentConfig)));
    }

    /**
     * Generic handler for textareas (Description, Technical Notes) and the 'Is Active' checkbox.
     * Updates the corresponding property in `currentConfig`.
     */
    handleInputChange(event) {
        const { name, value, type, checked } = event.target; // 'name' matches the property in currentConfig
        const inputValue = type === 'checkbox' ? checked : value; // For checkbox, use 'checked'; otherwise, use 'value'

        console.log(`LWC_INPUT: handleInputChange - Field Name: ${name}, Type: ${type}, Raw Value: ${value}, Checked Status: ${checked}, Effective InputValue: ${inputValue}`);
        console.log('LWC_INPUT: handleInputChange - currentConfig BEFORE this change:', JSON.parse(JSON.stringify(this.currentConfig)));

        // Update currentConfig reactively
        this.currentConfig = {
            ...this.currentConfig,         // Spread existing properties
            [name]: inputValue             // Update the specific property using its name
        };
        console.log('LWC_INPUT: handleInputChange - currentConfig AFTER this change:', JSON.parse(JSON.stringify(this.currentConfig)));
    }

    // --- MODAL LIFECYCLE (Opening, Populating for Add/Edit) ---

    /**
     * Opens the modal for adding a new configuration.
     * Resets `currentConfig` to its initial default state.
     */
    handleAddNew() {
        console.log('LWC_MODAL: handleAddNew called.');
        this.isEditMode = false;
        this.modalTitle = 'Add New Allowed Object Configuration';
        // CRITICAL: Reset currentConfig to a fresh, default state.
        this.currentConfig = this.getInitialCurrentConfig();
        this.selectedFields = []; // Reset dual-listbox selection
        this.fieldOptions = [];   // Clear field options as no SObject is selected yet
        this.showModal = true;
        console.log('LWC_MODAL: handleAddNew - Modal opened. currentConfig set to:', JSON.parse(JSON.stringify(this.currentConfig)));
    }

    /**
     * Opens the modal for editing an existing configuration.
     * Populates `currentConfig` with data from the selected row.
     */
    async editConfig(row) {
        console.log('LWC_MODAL: editConfig called for row:', JSON.parse(JSON.stringify(row)));
        this.isEditMode = true;
        this.modalTitle = `Edit Configuration: ${row.objectApiName}`;
        
        // Deep clone the row to avoid modifying the original datatable data
        const clonedRow = JSON.parse(JSON.stringify(row));

        // Populate currentConfig from the cloned row, ensuring defaults for any missing properties
        this.currentConfig = {
            recordId: clonedRow.recordId || null,
            objectApiName: clonedRow.objectApiName || '',
            allowedFieldsApiNames: clonedRow.allowedFieldsApiNames || '',
            description: clonedRow.description || '',
            isActive: clonedRow.isActive !== undefined ? clonedRow.isActive : false, // Handle boolean carefully
            technicalNotes: clonedRow.technicalNotes || ''
        };

        // Populate 'selectedFields' for the dual-listbox from 'allowedFieldsApiNames'
        if (this.currentConfig.allowedFieldsApiNames) {
            this.selectedFields = this.currentConfig.allowedFieldsApiNames.split(',').map(f => f.trim()).filter(f => f);
        } else {
            this.selectedFields = [];
        }
        console.log('LWC_MODAL: editConfig - currentConfig populated:', JSON.parse(JSON.stringify(this.currentConfig)));
        console.log('LWC_MODAL: editConfig - selectedFields (for dual-listbox) populated:', JSON.parse(JSON.stringify(this.selectedFields)));

        // Load field options for the SObject being edited
        this.fieldOptions = []; // Clear previous options
        if (this.currentConfig.objectApiName) {
            if (this._allFieldOptionsCache[this.currentConfig.objectApiName]) {
                this.fieldOptions = this._allFieldOptionsCache[this.currentConfig.objectApiName];
                console.log('LWC_MODAL: editConfig - Loaded field options from cache.');
            } else {
                console.log('LWC_MODAL: editConfig - Fetching field options for:', this.currentConfig.objectApiName);
                try {
                    const data = await getFieldOptions({ objectApiName: this.currentConfig.objectApiName });
                    this.fieldOptions = data || [];
                    this._allFieldOptionsCache[this.currentConfig.objectApiName] = data || [];
                } catch (error) {
                    console.error('LWC_MODAL_ERROR: editConfig - Error loading fields:', this.getErrorMessage(error));
                }
            }
        }
        this.showModal = true;
    }

    /**
     * Handles the save operation.
     * Validates inputs, constructs the payload from `currentConfig`, and calls Apex.
     */
    async handleSave() {
        console.log('LWC_SAVE: handleSave CALLED.');
        // Log the state of currentConfig and selectedFields AT THE VERY START of handleSave
        console.log('LWC_SAVE_STATE_START: currentConfig:', JSON.parse(JSON.stringify(this.currentConfig)));
        console.log('LWC_SAVE_STATE_START: selectedFields (for dual-listbox):', JSON.parse(JSON.stringify(this.selectedFields)));

        // --- Client-Side Validation ---
        let allValid = true;
        // Check validity of standard LWC input components
        const inputComponents = this.template.querySelectorAll('lightning-combobox, lightning-dual-listbox, lightning-textarea, lightning-input');
        inputComponents.forEach(inputCmp => {
            if (!inputCmp.reportValidity()) { // reportValidity() also shows messages to the user
                allValid = false;
            }
        });

        // Additional explicit checks for critical data
        if (!this.currentConfig.objectApiName || String(this.currentConfig.objectApiName).trim() === '') {
            allValid = false;
            console.warn('LWC_SAVE_VALIDATION: objectApiName is missing or empty.');
            // Potentially find the combobox and call reportValidity on it again if not already done
        }
        if (!this.selectedFields || this.selectedFields.length === 0) {
            // `allowedFieldsApiNames` in currentConfig should be derived from `selectedFields`.
            // This check ensures at least one field is selected in the dual-listbox.
            allValid = false;
            console.warn('LWC_SAVE_VALIDATION: No fields selected in dual-listbox.');
             const dualListBox = this.template.querySelector('lightning-dual-listbox[name="allowedFields"]');
            if(dualListBox && !dualListBox.checkValidity()) dualListBox.reportValidity(); // Ensure message is shown
        }
        
        if (!allValid) {
            this.showToast('Validation Error', 'Please review the form and correct all errors.', 'warning');
            console.warn('LWC_SAVE_VALIDATION: Overall validation failed.');
            return; // Stop if validation fails
        }

        this.isSaving = true; // Show spinner on save button

        // --- Payload Construction ---
        // Ensure `allowedFieldsApiNames` in `currentConfig` is up-to-date from `selectedFields`
        // This is a safeguard; `handleFieldSelectionChange` should have already set it.
        const finalAllowedFieldsApiNames = (this.selectedFields || []).join(',').trim();
        if (this.currentConfig.allowedFieldsApiNames !== finalAllowedFieldsApiNames) {
             console.warn('LWC_SAVE_PAYLOAD_WARN: currentConfig.allowedFieldsApiNames was out of sync with selectedFields. Syncing now.');
             this.currentConfig.allowedFieldsApiNames = finalAllowedFieldsApiNames;
        }


        // Construct the 'configToSave' object meticulously from 'this.currentConfig'.
        // This object's structure MUST match the Apex 'AllowedObjectWrapper'.
        const configToSave = {
            recordId: this.currentConfig.recordId || null,
            objectApiName: (this.currentConfig.objectApiName || '').trim(),
            // Use the most up-to-date derived value for allowedFieldsApiNames
            allowedFieldsApiNames: finalAllowedFieldsApiNames,
            description: (this.currentConfig.description || '').trim(),
            // Ensure isActive is a boolean. Default to false if somehow undefined or null.
            isActive: (this.currentConfig.isActive === true || this.currentConfig.isActive === false) ? this.currentConfig.isActive : false,
            technicalNotes: (this.currentConfig.technicalNotes || '').trim()
        };

        console.log('LWC_SAVE_PAYLOAD: configToSave object prepared for Apex:', JSON.parse(JSON.stringify(configToSave)));

        try {
            console.log('LWC_SAVE_APEX_CALL: Calling Apex saveAllowedObjectConfig with payload...');
            // The key in the object passed to Apex must match the Apex method's parameter name.
            // Apex: public static Id saveAllowedObjectConfig(AllowedObjectWrapper configData)
            // LWC:                                        { configData: configToSave }
            const resultId = await saveAllowedObjectConfig({ configData: configToSave });
            console.log('LWC_SAVE_APEX_SUCCESS: Apex call successful. Record ID:', resultId);
            this.showToast('Success', 'Configuration saved successfully!', 'success');
            this.closeModal();
            return refreshApex(this.wiredConfigsResult); // Refresh the main table
        } catch (error) {
            console.error('LWC_SAVE_APEX_ERROR: Error saving configuration:', JSON.parse(JSON.stringify(error)));
            this.showToast('Error Saving Configuration', this.getErrorMessage(error), 'error');
        } finally {
            this.isSaving = false; // Hide spinner
            console.log('LWC_SAVE: Save operation finished.');
        }
    }


    // --- UTILITY METHODS (Close Modals, Toast, Error Handling, Sorting) ---
    closeModal() {
        console.log('LWC_MODAL: closeModal called.');
        this.showModal = false;
        // Reset state for the next time the modal is opened for 'Add New'
        this.currentConfig = this.getInitialCurrentConfig();
        this.selectedFields = [];
        this.fieldOptions = [];
        this.isEditMode = false;
        this.isSaving = false; // Also reset saving flag
    }

    // ... (Other methods like handleRowAction, deleteConfig, viewRecords, sortData, getErrorMessage, showToast, closeRecordModal, etc., remain largely the same as the previous "good" version with debugging logs if you added them there)
    // Ensure those methods also correctly manage their respective states if they modify anything that could impact `currentConfig` or `selectedFields` indirectly,
    // though they primarily deal with other UI aspects or data fetching.

    // Placeholder for other methods from previous version
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log(`LWC_ACTION: Row action '${actionName}' on row:`, JSON.parse(JSON.stringify(row)));
        switch (actionName) {
            case 'edit': this.editConfig(row); break;
            case 'delete': this.confirmDeleteConfig(row); break;
            case 'viewRecords': this.viewRecords(row); break;
            default: console.warn(`LWC_ACTION_WARN: Unknown row action: ${actionName}`);
        }
    }
    confirmDeleteConfig(row) { /* ... */ }
    async deleteConfig(row) { /* ... */ }
    async viewRecords(row) { /* ... */ }
    processRecordsForDisplay(records) { return records.map(record => ({...record})); }
    determineFieldType(sampleValue, fieldName) { /* ... */ }
    closeRecordModal() { /* ... */ }
    sortData(fieldName, sortDirection, dataToSort) { /* ... as before ... */ return dataToSort; }
    showToast(title, message, variant = 'info', mode = 'dismissable') { const event = new ShowToastEvent({ title, message, variant, mode }); this.dispatchEvent(event); }
    getErrorMessage(error) { /* ... as before ... */ return 'Unknown error'; }
    get selectedObjectLabel() { const selected = this.sObjectOptions.find(opt => opt.value === this.currentConfig.objectApiName); return selected ? selected.label.split(' (')[0] : this.currentConfig.objectApiName; }
}