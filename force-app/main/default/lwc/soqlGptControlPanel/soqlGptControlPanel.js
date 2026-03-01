import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import testConnection from '@salesforce/apex/SoqlGptController.testConnection';
import getWorkspaces from '@salesforce/apex/SoqlGptController.getWorkspaces';
import generateIntent from '@salesforce/apex/SoqlGptController.generateIntent';
import generateObjects from '@salesforce/apex/SoqlGptController.generateObjects';
import generateFields from '@salesforce/apex/SoqlGptController.generateFields';
import generateSoql from '@salesforce/apex/SoqlGptController.generateSoql';
import regenerateObjects from '@salesforce/apex/SoqlGptController.regenerateObjects';
import regenerateFields from '@salesforce/apex/SoqlGptController.regenerateFields';
import regenerateSoql from '@salesforce/apex/SoqlGptController.regenerateSoql';
import executeSoqlQuery from '@salesforce/apex/SoqlGptController.executeSoqlQuery';
import endSession from '@salesforce/apex/SoqlGptController.endSession';
import CHARTJS from '@salesforce/resourceUrl/chartJS';

export default class SoqlGptControlPanel extends LightningElement {
    // API Configuration
    @api apiBaseUrl = 'https://soql-gpt-desktop.onrender.com';
    
    // Session Management (v3.0)
    @track sessionId = null;
    
    // Wizard State - 7 screens
    @track currentScreen = 1; // 1=Input, 2=Intent(optional), 3=Objects, 4=Fields, 5=SOQL, 6=Results, 7=Complete
    @track connectionStatus = 'Not Connected';
    @track isConnected = false;
    @track workspaceOptions = [];
    @track selectedWorkspace = '';
    @track selectedWorkspaceDescription = '';
    @track userQuery = '';
    @track userId = 'test_user'; // Simple user ID for now
    @track isLoading = false;
    @track loadingMessage = '';
    @track errorMessage = '';
    
    // Pipeline Data
    @track intentWorkspace = '';
    @track intentRationale = '';
    @track intentConfidence = 0;
    @track proposedObjects = [];
    @track selectedObjects = [];
    @track objectRationale = '';
    @track objectFeedback = '';
    @track proposedFields = [];
    @track selectedFields = [];
    @track fieldsByObject = {};
    @track fieldRationale = '';
    @track fieldFeedback = '';
    @track soqlQuery = '';
    @track chartRecommendation = {};
    @track soqlRationale = '';
    @track soqlFeedback = '';
    
    // Query Results
    @track queryResults = [];
    @track tableData = [];
    @track tableColumns = [];
    @track recordCount = 0;
    chartInstance = null;
    chartJsInitialized = false;
    chartJsLoaded = false;
    chartRetryCount = 0;

    // Lifecycle
    connectedCallback() {
        this.testConnection();
    }
    
    renderedCallback() {
        // Initialize Chart.js library once
        if (!this.chartJsInitialized) {
            this.chartJsInitialized = true;
            
            loadScript(this, CHARTJS)
                .then(() => {
                    this.chartJsLoaded = true;
                    console.log('Chart.js loaded successfully');
                })
                .catch(error => {
                    this.chartJsInitialized = false; // Reset to try again
                    console.error('Error loading Chart.js:', error);
                    this.showToast('Warning', 'Chart.js failed to load. Charts will not be displayed.', 'warning');
                });
        }
        
        // Render chart when on results screen with data and chart is recommended
        if (this.currentScreen === 6 && this.queryResults.length > 0 && this.hasChartRecommendation && this.chartJsLoaded && !this.chartInstance) {
            console.log('renderedCallback: Attempting to render chart...');
            setTimeout(() => {
                this.renderChart();
            }, 100);
        }
    }

    // Computed Properties - Screen Visibility
    get isScreen1() { return this.currentScreen === 1; }
    get isScreen2() { return this.currentScreen === 2; }
    get isScreen3() { return this.currentScreen === 3; }
    get isScreen4() { return this.currentScreen === 4; }
    get isScreen5() { return this.currentScreen === 5; }
    get isScreen6() { return this.currentScreen === 6; }
    get isScreen7() { return this.currentScreen === 7; }

    get statusIcon() {
        return this.isConnected ? 'utility:success' : 'utility:error';
    }

    get statusIconClass() {
        return this.isConnected 
            ? 'slds-icon_container slds-icon-utility-success' 
            : 'slds-icon_container slds-icon-utility-error';
    }

    get statusIconVariant() {
        return this.isConnected ? 'success' : 'error';
    }

    get canProceedFromScreen1() {
        return !this.isLoading && this.userQuery && (this.selectedWorkspace || !this.workspaceOptions.length);
    }

    get disableProceedScreen1() {
        return this.isLoading || !this.userQuery;
    }

    get needsIntentAgent() {
        return !this.selectedWorkspace; // If no workspace selected, use Intent Agent
    }

    get hasChartRecommendation() {
        const hasRec = !!(this.chartRecommendation && this.chartRecommendation.recommended_chart_type);
        
        if (!hasRec) {
            console.log('No chart recommendation');
            return false;
        }
        
        console.log('Chart recommendation:', {
            type: this.chartRecommendation.recommended_chart_type,
            supportedTypes: this.chartRecommendation.supported_chart_types
        });
        
        // If recommendation is 'table' but other chart types are supported, use the first supported type
        if (this.chartRecommendation.recommended_chart_type === 'table') {
            const supportedTypes = this.chartRecommendation.supported_chart_types || [];
            const visualChartTypes = supportedTypes.filter(type => type !== 'table');
            const hasVisual = visualChartTypes.length > 0;
            console.log('Table type with visual alternatives:', hasVisual);
            return hasVisual;
        }
        
        console.log('Has valid chart recommendation: true');
        return true;
    }

    get chartType() {
        let type = this.chartRecommendation?.recommended_chart_type || '';
        // If type is 'table', resolve to first visual chart type
        if (type === 'table') {
            const supportedTypes = this.chartRecommendation?.supported_chart_types || [];
            const visualTypes = supportedTypes.filter(t => t !== 'table');
            type = visualTypes.length > 0 ? visualTypes[0] : 'bar';
        }
        return type;
    }

    get xField() {
        return this.chartRecommendation?.x_field || '';
    }

    get yField() {
        return this.chartRecommendation?.y_field || '';
    }

    get chartRationale() {
        return this.chartRecommendation?.rationale || '';
    }

    get supportedChartTypes() {
        const types = this.chartRecommendation?.supported_chart_types || [];
        // Filter out 'table' and return remaining types
        return types.filter(type => type !== 'table');
    }

    get progressPercentage() {
        // Calculate progress based on screen
        const totalScreens = this.needsIntentAgent ? 7 : 6;
        return Math.round((this.currentScreen / totalScreens) * 100);
    }

    get disableProceedScreen3() {
        return this.selectedObjects.length === 0;
    }

    get disableProceedScreen4() {
        return this.selectedFields.length === 0;
    }

    // Alias properties for HTML compatibility
    get suggestedObjects() {
        return this.proposedObjects;
    }

    get suggestedFields() {
        return this.proposedFields.map(f => f.label);
    }

    get objectAgentRationale() {
        return this.objectRationale;
    }

    get fieldAgentRationale() {
        return this.fieldRationale;
    }

    // Event Handlers
    handleWorkspaceChange(event) {
        this.selectedWorkspace = event.detail.value;
        const selectedOption = this.workspaceOptions.find(opt => opt.value === this.selectedWorkspace);
        this.selectedWorkspaceDescription = selectedOption ? selectedOption.description : '';
    }

    handleQueryChange(event) {
        this.userQuery = event.detail.value;
    }

    handleObjectSelection(event) {
        const objectName = event.target.dataset.object;
        if (event.target.checked) {
            this.selectedObjects = [...this.selectedObjects, objectName];
        } else {
            this.selectedObjects = this.selectedObjects.filter(obj => obj !== objectName);
        }
    }

    handleFieldSelection(event) {
        const fieldName = event.target.dataset.field;
        if (event.target.checked) {
            this.selectedFields = [...this.selectedFields, fieldName];
        } else {
            this.selectedFields = this.selectedFields.filter(fld => fld !== fieldName);
        }
    }

    handleObjectFeedbackChange(event) {
        this.objectFeedback = event.detail.value;
    }

    handleFieldFeedbackChange(event) {
        this.fieldFeedback = event.detail.value;
    }

    handleSoqlChange(event) {
        this.soqlQuery = event.detail.value;
    }

    handleSoqlFeedbackChange(event) {
        this.soqlFeedback = event.detail.value;
    }

    async handleRegenerateObjects() {
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Regenerating object suggestions with your feedback...';
            
            // Build previous result
            const previousResult = {
                proposed_objects: this.proposedObjects,
                rationale: this.objectRationale
            };
            
            // Call regenerate endpoint (stores in RAG)
            const result = await regenerateObjects({
                baseUrl: this.apiBaseUrl,
                userQuery: this.userQuery,
                workspace: this.intentWorkspace,
                previousResult: previousResult,
                userFeedback: this.objectFeedback || '',
                userId: this.userId,
                sessionId: this.sessionId
            });
            
            if (!result.success) {
                throw new Error(result.error || 'Regeneration failed');
            }
            
            // Parse and update UI with ALL returned fields
            const data = JSON.parse(result.data);
            this.proposedObjects = data.proposed_objects || [];
            this.selectedObjects = [...this.proposedObjects]; // Auto-select regenerated objects
            this.objectRationale = data.rationale || '';
            // Note: alternatives and confidence_by_object available but not displayed in current UI
            
            this.showToast('Success', 'Object suggestions regenerated! Your feedback has been saved for future queries.', 'success');
            this.objectFeedback = ''; // Clear feedback
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Regeneration failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async handleRegenerateFields() {
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Regenerating field suggestions with your feedback...';
            
            // Build previous result
            const previousResult = {
                proposed_fields: this.proposedFields,
                rationale: this.fieldRationale
            };
            
            // Call regenerate endpoint (stores in RAG)
            const result = await regenerateFields({
                baseUrl: this.apiBaseUrl,
                userQuery: this.userQuery,
                workspace: this.intentWorkspace,
                selectedObjects: this.selectedObjects,
                intentRationale: this.intentRationale,
                objectRationale: this.objectRationale,
                previousResult: previousResult,
                userFeedback: this.fieldFeedback || '',
                userId: this.userId,
                sessionId: this.sessionId
            });
            
            if (!result.success) {
                throw new Error(result.error || 'Regeneration failed');
            }
            
            // Parse and update UI with ALL returned fields
            const data = JSON.parse(result.data);
            this.fieldsByObject = data.fields_by_object || {};
            this.fieldRationale = data.rationale || '';
            
            // Flatten fields for selection (same logic as callFieldAgent)
            this.proposedFields = [];
            for (const [obj, fields] of Object.entries(this.fieldsByObject)) {
                fields.forEach(field => {
                    this.proposedFields.push({ object: obj, field: field, label: `${obj}.${field}` });
                });
            }
            this.selectedFields = this.proposedFields.map(f => f.label); // Auto-select all
            
            this.showToast('Success', 'Field suggestions regenerated! Your feedback has been saved for future queries.', 'success');
            this.fieldFeedback = ''; // Clear feedback
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Regeneration failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async handleRegenerateSoql() {
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Regenerating SOQL query with your feedback...';
            
            // Build previous result matching API response structure
            const previousResult = {
                soql_query: this.soqlQuery,
                chart_recommendation: this.chartRecommendation,
                rationale: this.soqlRationale
            };
            
            // Convert selectedFields to the correct format for the API
            const fieldsMap = {};
            this.selectedObjects.forEach(obj => {
                fieldsMap[obj] = this.fieldsByObject[obj] || [];
            });
            
            // Call regenerate endpoint (stores in RAG)
            const result = await regenerateSoql({
                baseUrl: this.apiBaseUrl,
                userQuery: this.userQuery,
                workspace: this.intentWorkspace,
                selectedObjects: this.selectedObjects,
                intentRationale: this.intentRationale,
                objectRationale: this.objectRationale,
                selectedFields: fieldsMap,
                fieldRationale: this.fieldRationale,
                previousResult: previousResult,
                userFeedback: this.soqlFeedback || '',
                userId: this.userId,
                sessionId: this.sessionId
            });
            
            if (!result.success) {
                throw new Error(result.error || 'Regeneration failed');
            }
            
            // Parse and update UI (match callSoqlAgent behavior)
            const data = JSON.parse(result.data);
            this.soqlQuery = data.soql_query;
            this.chartRecommendation = data.chart_recommendation || {};
            this.soqlRationale = data.rationale;
            
            this.showToast('Success', 'SOQL query regenerated! Your feedback has been saved for future queries.', 'success');
            this.soqlFeedback = ''; // Clear feedback
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Regeneration failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    handleRefresh() {
        this.loadWorkspaces();
    }

    // Wizard Navigation
    handleStartOver() {
        this.resetWizard();
    }

    handleNext() {
        console.log('handleNext called, currentScreen:', this.currentScreen);
        
        if (this.currentScreen === 1) {
            this.proceedFromScreen1();
        } else if (this.currentScreen === 2) {
            this.proceedToObjectAgent();
        } else if (this.currentScreen === 3) {
            this.proceedToFieldAgent();
        } else if (this.currentScreen === 4) {
            this.proceedToSoqlAgent();
        } else if (this.currentScreen === 5) {
            this.executeQuery();
        } else if (this.currentScreen === 6) {
            this.completeSession();
        } else if (this.currentScreen === 7) {
            this.resetWizard();
        }
    }

    handleBack() {
        if (this.currentScreen > 1) {
            this.currentScreen--;
            this.errorMessage = '';
        }
    }

    handleDownloadCSV() {
        this.downloadTableAsCSV();
    }

    handleCopyQuery() {
        navigator.clipboard.writeText(this.soqlQuery)
            .then(() => {
                this.showToast('Success', 'SOQL query copied to clipboard', 'success');
            })
            .catch(err => {
                this.showToast('Error', 'Failed to copy query: ' + err.message, 'error');
            });
    }

    async handleExecuteQuery() {
        try {
            this.isLoading = true;
            this.loadingMessage = 'Executing SOQL query...';
            this.errorMessage = '';
            this.showQueryResults = false;
            
            // Destroy existing chart if any
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }
            
            const result = await executeSoqlQuery({ soqlQuery: this.soqlQuery });
            
            if (!result.success) {
                throw new Error(result.error || 'Query execution failed');
            }
            
            this.queryResults = JSON.parse(result.data);
            this.recordCount = result.recordCount || this.queryResults.length;
            
            // Prepare table data
            this.prepareTableData();
            
            this.showQueryResults = true;
            this.showToast('Success', `Query executed successfully! ${this.recordCount} records retrieved.`, 'success');
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Query execution failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    // API Methods
    async testConnection() {
        try {
            this.isLoading = true;
            this.loadingMessage = 'Testing API connection...';
            
            const result = await testConnection({ baseUrl: this.apiBaseUrl });
            
            if (result.success) {
                this.isConnected = true;
                this.connectionStatus = 'Connected';
                this.showToast('Success', 'Connected to SOQL-GPT API', 'success');
                await this.loadWorkspaces();
            } else {
                this.isConnected = false;
                this.connectionStatus = 'Connection Failed';
                this.errorMessage = result.error || 'Failed to connect to API';
            }
        } catch (error) {
            this.isConnected = false;
            this.connectionStatus = 'Error';
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Connection test failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async loadWorkspaces() {
        try {
            this.isLoading = true;
            this.loadingMessage = 'Loading workspaces...';
            
            const result = await getWorkspaces({ baseUrl: this.apiBaseUrl });
            
            if (result.success) {
                // Parse the response - server returns array of {name, description} objects
                const workspaces = JSON.parse(result.data);
                
                // Ensure we have an array
                if (Array.isArray(workspaces) && workspaces.length > 0) {
                    this.workspaceOptions = workspaces.map(ws => ({
                        label: ws.name || ws,  // Handle both object and string formats
                        value: ws.name || ws,
                        description: ws.description || ''
                    }));
                    
                    // Auto-select first workspace if none selected
                    if (!this.selectedWorkspace && this.workspaceOptions.length > 0) {
                        this.selectedWorkspace = this.workspaceOptions[0].value;
                        this.selectedWorkspaceDescription = this.workspaceOptions[0].description;
                    }
                } else {
                    this.errorMessage = 'No workspaces available';
                    this.workspaceOptions = [];
                }
            } else {
                this.errorMessage = result.error || 'Failed to load workspaces';
            }
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Failed to load workspaces: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    // Wizard Flow Methods
    async proceedFromScreen1() {
        console.log('proceedFromScreen1 called');
        console.log('selectedWorkspace:', this.selectedWorkspace);
        console.log('userQuery:', this.userQuery);
        
        try {
            this.errorMessage = '';
            this.isLoading = true;
            
            // If workspace selected, skip Intent Agent (go to screen 3)
            // If no workspace, call Intent Agent (go to screen 2)
            if (this.selectedWorkspace) {
                console.log('Workspace selected, calling Object Agent');
                this.intentWorkspace = this.selectedWorkspace;
                this.intentRationale = 'User pre-selected workspace: ' + this.selectedWorkspace; // Set default rationale
                this.loadingMessage = 'Loading objects...';
                await this.callObjectAgent();
                this.currentScreen = 3; // Go to Objects screen
                console.log('Moved to screen 3');
            } else {
                console.log('No workspace, calling Intent Agent');
                this.loadingMessage = 'Analyzing query intent...';
                await this.callIntentAgent();
                this.currentScreen = 2; // Go to Intent screen
                console.log('Moved to screen 2');
            }
            
        } catch (error) {
            console.error('Error in proceedFromScreen1:', error);
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Processing failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async proceedToObjectAgent() {
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Loading objects...';
            
            await this.callObjectAgent();
            this.currentScreen = 3; // Go to Objects screen
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Object loading failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async proceedToFieldAgent() {
        if (this.selectedObjects.length === 0) {
            this.showToast('Warning', 'Please select at least one object', 'warning');
            return;
        }
        
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Loading fields...';
            
            await this.callFieldAgent();
            this.currentScreen = 4; // Go to Fields screen
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Field loading failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async proceedToSoqlAgent() {
        if (this.selectedFields.length === 0) {
            this.showToast('Warning', 'Please select at least one field', 'warning');
            return;
        }
        
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Generating SOQL query...';
            
            await this.callSoqlAgent();
            this.currentScreen = 5; // Go to SOQL screen
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'SOQL generation failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    async executeQuery() {
        try {
            this.errorMessage = '';
            this.isLoading = true;
            this.loadingMessage = 'Executing SOQL query...';
            
            // Destroy existing chart if any
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }
            
            const result = await executeSoqlQuery({ soqlQuery: this.soqlQuery });
            
            if (!result.success) {
                throw new Error(result.error || 'Query execution failed');
            }
            
            this.queryResults = JSON.parse(result.data);
            this.recordCount = result.recordCount || this.queryResults.length;
            
            // Prepare table data
            this.prepareTableData();
            
            this.currentScreen = 6; // Go to Results screen
            this.showToast('Success', `${this.recordCount} records retrieved`, 'success');
            
            // Trigger chart rendering after screen transition
            if (this.hasChartRecommendation && this.chartJsLoaded) {
                setTimeout(() => {
                    this.renderChart();
                }, 200);
            }
            
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : error.message;
            this.showToast('Error', 'Query execution failed: ' + this.errorMessage, 'error');
        } finally {
            this.isLoading = false;
            this.loadingMessage = '';
        }
    }

    completeSession() {
        this.currentScreen = 7; // Go to Completion screen
        this.showToast('Success', 'Session completed successfully!', 'success');
    }

    disconnectedCallback() {
        // CRITICAL: End session when component is destroyed
        if (this.sessionId) {
            this.endSessionSilently();
        }
        
        // Clean up chart instance when component is destroyed
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
    
    async endSessionSilently() {
        try {
            await endSession({
                baseUrl: this.apiBaseUrl,
                sessionId: this.sessionId
            });
            console.log('Session ended:', this.sessionId);
        } catch (error) {
            console.error('Error ending session:', error);
        }
        this.sessionId = null;
    }

    resetWizard() {
        // End session if active
        if (this.sessionId) {
            this.endSessionSilently();
        }
        
        // Reset all wizard state
        this.currentScreen = 1;
        this.sessionId = null;
        this.userQuery = '';
        this.selectedWorkspace = '';
        this.selectedWorkspaceDescription = '';
        this.intentWorkspace = '';
        this.intentRationale = '';
        this.intentConfidence = 0;
        this.proposedObjects = [];
        this.selectedObjects = [];
        this.objectRationale = '';
        this.proposedFields = [];
        this.selectedFields = [];
        this.fieldsByObject = {};
        this.fieldRationale = '';
        this.soqlQuery = '';
        this.chartRecommendation = {};
        this.soqlRationale = '';
        this.queryResults = [];
        this.tableData = [];
        this.tableColumns = [];
        this.recordCount = 0;
        this.errorMessage = '';
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }

    // Agent API Calls
    async callIntentAgent() {
        const result = await generateIntent({
            baseUrl: this.apiBaseUrl,
            userQuery: this.userQuery,
            userId: this.userId,
            sessionId: this.sessionId
        });
        
        if (!result.success) {
            throw new Error(result.error || 'Intent agent failed');
        }
        
        const data = JSON.parse(result.data);
        this.intentWorkspace = data.workspace;
        this.intentRationale = data.rationale;
        this.intentConfidence = data.confidence || 0;
        
        // Store session_id for subsequent calls
        if (data.session_id) {
            this.sessionId = data.session_id;
        }
    }

    async callObjectAgent() {
        console.log('callObjectAgent called');
        
        console.log('Parameters:', {
            baseUrl: this.apiBaseUrl,
            userQuery: this.userQuery,
            workspace: this.intentWorkspace,
            intentRationale: this.intentRationale,
            userId: this.userId,
            sessionId: this.sessionId
        });
        
        const result = await generateObjects({
            baseUrl: this.apiBaseUrl,
            userQuery: this.userQuery,
            workspace: this.intentWorkspace,
            intentRationale: this.intentRationale,
            userId: this.userId,
            sessionId: this.sessionId
        });
        
        console.log('callObjectAgent result:', result);
        
        if (!result.success) {
            throw new Error(result.error || 'Object agent failed');
        }
        
        const data = JSON.parse(result.data);
        console.log('Parsed data:', data);
        
        this.proposedObjects = data.proposed_objects || [];
        this.selectedObjects = [...this.proposedObjects]; // Auto-select all
        this.objectRationale = data.rationale;
        
        // Store session_id if this was the session initiator (workspace provided)
        if (data.session_id) {
            this.sessionId = data.session_id;
        }
        
        console.log('proposedObjects:', this.proposedObjects);
        console.log('selectedObjects:', this.selectedObjects);
    }

    async callFieldAgent() {
        const result = await generateFields({
            baseUrl: this.apiBaseUrl,
            userQuery: this.userQuery,
            workspace: this.intentWorkspace,
            selectedObjects: this.selectedObjects,
            objectRationale: this.objectRationale,
            intentRationale: this.intentRationale,
            userId: this.userId,
            sessionId: this.sessionId
        });
        
        if (!result.success) {
            throw new Error(result.error || 'Field agent failed');
        }
        
        const data = JSON.parse(result.data);
        this.fieldsByObject = data.fields_by_object || {};
        this.fieldRationale = data.rationale;
        
        // Flatten fields for selection
        this.proposedFields = [];
        for (const [obj, fields] of Object.entries(this.fieldsByObject)) {
            fields.forEach(field => {
                this.proposedFields.push({ object: obj, field: field, label: `${obj}.${field}` });
            });
        }
        this.selectedFields = this.proposedFields.map(f => f.label); // Auto-select all
    }

    async callSoqlAgent() {
        // Build query with feedback if provided
        let queryWithFeedback = this.userQuery;
        if (this.soqlFeedback) {
            queryWithFeedback += ' [Feedback: ' + this.soqlFeedback + ']';
        }
        
        // Convert selectedFields array to fields_by_object dictionary
        // From: ["Account.Name", "Account.Id", "Opportunity.Amount"]
        // To: {"Account": ["Name", "Id"], "Opportunity": ["Amount"]}
        const fieldsByObject = {};
        this.selectedFields.forEach(fieldLabel => {
            const parts = fieldLabel.split('.');
            if (parts.length === 2) {
                const [objectName, fieldName] = parts;
                if (!fieldsByObject[objectName]) {
                    fieldsByObject[objectName] = [];
                }
                fieldsByObject[objectName].push(fieldName);
            }
        });
        
        console.log('=== SOQL Agent Debug ===');
        console.log('selectedObjects:', this.selectedObjects);
        console.log('selectedFields (raw):', this.selectedFields);
        console.log('fieldsByObject (converted):', fieldsByObject);
        console.log('Calling Apex with params:', {
            selectedObjects: this.selectedObjects,
            selectedFields: fieldsByObject
        });
        console.log('========================');
        
        const result = await generateSoql({
            baseUrl: this.apiBaseUrl,
            userQuery: queryWithFeedback,
            workspace: this.intentWorkspace,
            selectedObjects: this.selectedObjects,
            selectedFields: fieldsByObject,  // Send as dictionary, not array
            fieldRationale: this.fieldRationale,
            userId: this.userId,
            sessionId: this.sessionId
        });
        
        if (!result.success) {
            throw new Error(result.error || 'SOQL agent failed');
        }
        
        const data = JSON.parse(result.data);
        this.soqlQuery = data.soql_query;
        this.chartRecommendation = data.chart_recommendation || {};
        this.soqlRationale = data.rationale;
        
        console.log('=== SOQL Agent Response ===');
        console.log('SOQL generated:', this.soqlQuery);
        console.log('Chart recommendation received:', JSON.stringify(this.chartRecommendation, null, 2));
        console.log('Chart type:', this.chartRecommendation.recommended_chart_type);
        console.log('X field:', this.chartRecommendation.x_field);
        console.log('Y field:', this.chartRecommendation.y_field);
        console.log('Has chart?', this.hasChartRecommendation);
        console.log('============================');
    }

    // Legacy method removed - use handleRegenerateSoql() instead which properly calls regenerate endpoint

    // Helper Methods
    prepareTableData() {
        if (this.queryResults.length === 0) {
            this.tableData = [];
            this.tableColumns = [];
            return;
        }
        
        // Extract columns from first record
        const firstRecord = this.queryResults[0];
        const columns = [];
        
        for (let fieldName in firstRecord) {
            if (firstRecord.hasOwnProperty(fieldName)) {
                let column = {
                    label: fieldName,
                    fieldName: fieldName,
                    type: this.getFieldType(firstRecord[fieldName])
                };
                
                // Special formatting for currency
                if (fieldName.toLowerCase().includes('amount') || 
                    fieldName.toLowerCase().includes('price') ||
                    fieldName.toLowerCase().includes('revenue')) {
                    column.type = 'currency';
                    column.typeAttributes = { currencyCode: 'USD' };
                }
                
                columns.push(column);
            }
        }
        
        this.tableColumns = columns;
        this.tableData = this.queryResults;
    }

    getFieldType(value) {
        if (value === null || value === undefined) return 'text';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        if (value instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
        return 'text';
    }

    renderChart() {
        // Only proceed if Chart.js is loaded and we have data
        if (!this.chartJsLoaded || !this.queryResults || this.queryResults.length === 0) {
            console.log('Cannot render chart:', {
                chartJsLoaded: this.chartJsLoaded,
                hasData: this.queryResults && this.queryResults.length > 0
            });
            return;
        }

        const canvas = this.template.querySelector('.chart');
        if (!canvas) {
            console.log('Canvas not found - checking hasChartRecommendation:', this.hasChartRecommendation);
            // Only retry if chart should be visible
            if (!this.hasChartRecommendation) {
                console.log('Chart not recommended, skipping render');
                return;
            }
            
            // Limit retries to prevent infinite loop
            if (!this.chartRetryCount) {
                this.chartRetryCount = 0;
            }
            
            if (this.chartRetryCount < 10) {
                this.chartRetryCount++;
                console.log(`Canvas not found, scheduling retry ${this.chartRetryCount}/10...`);
                // Canvas not in DOM yet, schedule rerender
                setTimeout(() => {
                    this.renderChart();
                }, 100);
            } else {
                console.warn('Canvas not found after 10 retries. Chart rendering aborted.');
            }
            return;
        }
        
        // Reset retry counter when canvas is found
        this.chartRetryCount = 0;

        try {
            console.log('Rendering chart on canvas...');
            const ctx = canvas.getContext('2d');
            
            // Prepare chart data
            const chartData = this.prepareChartData();
            if (!chartData) {
                console.warn('Could not prepare chart data');
                return;
            }

            console.log('Chart data prepared:', chartData);

            // Destroy previous chart instance
            if (this.chartInstance) {
                this.chartInstance.destroy();
                this.chartInstance = null;
            }

            // Chart configuration
            const config = {
                type: this.getChartJsType(),
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: this.chartRationale || 'Query Results Visualization',
                            font: { size: 16, weight: 'bold' },
                            padding: 20
                        },
                        legend: {
                            display: this.chartType !== 'line' && this.chartType !== 'bar',
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                boxWidth: 15,
                                font: { size: 12 }
                            }
                        }
                    },
                    scales: this.getChartScales(),
                    animation: {
                        duration: 1000
                    }
                }
            };

            // Create new chart using global Chart object
            this.chartInstance = new window.Chart(ctx, config);
            console.log('Chart created successfully!');
            
        } catch (error) {
            console.error('Error rendering chart:', error);
            this.showToast('Error', 'Failed to render chart: ' + error.message, 'error');
        }
    }

    getChartJsType() {
        let chartType = this.chartRecommendation.recommended_chart_type || 'bar';
        
        // If recommended type is 'table', use first supported visual chart type
        if (chartType === 'table') {
            const supportedTypes = this.chartRecommendation.supported_chart_types || [];
            const visualChartTypes = supportedTypes.filter(type => type !== 'table');
            chartType = visualChartTypes.length > 0 ? visualChartTypes[0] : 'bar';
        }
        
        const typeMap = {
            'bar': 'bar',
            'line': 'line',
            'pie': 'pie',
            'doughnut': 'doughnut',
            'table': 'bar' // Fallback
        };
        console.log('Chart type (resolved):', chartType);
        return typeMap[chartType] || 'bar';
    }

    prepareChartData() {
        if (!this.queryResults || this.queryResults.length === 0) return null;

        const labels = [];
        const dataValues = [];
        
        // Get field names from chart recommendation
        const chartXField = this.chartRecommendation.x_field || 'Name';
        const chartYField = this.chartRecommendation.y_field || 'Amount';
        
        console.log('Chart fields:', { chartXField, chartYField });
        console.log('First record:', this.queryResults[0]);
        
        // Extract data based on x_field and y_field
        this.queryResults.forEach(record => {
            const xValue = record[chartXField] || record[chartXField?.toLowerCase()] || 'N/A';
            const yValue = record[chartYField] || record[chartYField?.toLowerCase()] || 0;
            
            labels.push(String(xValue));
            dataValues.push(Number(yValue) || 0);
        });

        // Color scheme
        const colors = [
            'rgba(0, 161, 224, 0.8)',
            'rgba(0, 112, 210, 0.8)',
            'rgba(75, 202, 129, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(244, 81, 108, 0.8)',
            'rgba(156, 39, 176, 0.8)',
            'rgba(255, 152, 0, 0.8)',
            'rgba(96, 125, 139, 0.8)'
        ];

        const chartType = this.chartRecommendation.recommended_chart_type || 'bar';
        const isPieChart = chartType === 'pie' || chartType === 'doughnut';
        const yField = this.chartRecommendation.y_field || 'Value';

        return {
            labels: labels,
            datasets: [{
                label: yField,
                data: dataValues,
                backgroundColor: isPieChart ? colors.slice(0, labels.length) : colors[0],
                borderColor: isPieChart ? colors.slice(0, labels.length).map(c => c.replace('0.8', '1')) : colors[0].replace('0.8', '1'),
                borderWidth: 2
            }]
        };
    }

    getChartScales() {
        const chartType = this.chartRecommendation.recommended_chart_type || 'bar';
        
        if (chartType === 'pie' || chartType === 'doughnut') {
            return {}; // Pie charts don't use scales
        }

        const xField = this.chartRecommendation.x_field || 'Category';
        const yField = this.chartRecommendation.y_field || 'Value';

        return {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: yField
                }
            },
            x: {
                title: {
                    display: true,
                    text: xField
                }
            }
        };
    }

    resetPipeline() {
        this.pipelineContext = {
            intent_workspace: '',
            intent_rationale: '',
            selected_objects: [],
            object_rationale: '',
            selected_fields: [],
            field_rationale: ''
        };
        this.intentRationale = '';
        this.selectedObjects = [];
        this.objectRationale = '';
        this.selectedFields = [];
        this.fieldRationale = '';
        this.soqlQuery = '';
        this.chartType = '';
        this.xField = '';
        this.yField = '';
        this.chartRationale = '';
        this.showQueryResults = false;
        this.queryResults = [];
        this.tableData = [];
        this.tableColumns = [];
        this.recordCount = 0;
        
        // Destroy chart
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }

    downloadTableAsCSV() {
        if (this.tableData.length === 0) {
            this.showToast('Warning', 'No data to download', 'warning');
            return;
        }

        try {
            // Get column headers
            const headers = this.tableColumns.map(col => col.label);
            const fieldNames = this.tableColumns.map(col => col.fieldName);
            
            // Build CSV content
            let csvContent = headers.join(',') + '\n';
            
            this.tableData.forEach(row => {
                const values = fieldNames.map(field => {
                    let value = row[field];
                    
                    // Handle null/undefined
                    if (value === null || value === undefined) {
                        return '';
                    }
                    
                    // Convert to string and escape quotes
                    value = String(value);
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        value = '"' + value.replace(/"/g, '""') + '"';
                    }
                    
                    return value;
                });
                
                csvContent += values.join(',') + '\n';
            });
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `soql_results_${new Date().getTime()}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast('Success', 'CSV file downloaded successfully', 'success');
        } catch (error) {
            this.showToast('Error', 'Failed to download CSV: ' + error.message, 'error');
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}