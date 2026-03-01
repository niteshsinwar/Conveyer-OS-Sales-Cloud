import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendChartRequest from '@salesforce/apex/AIForceDataLenseController.sendChartRequest';
import generateAndSavePdf from '@salesforce/apex/AIForceDataLenseController.generateAndSavePdfFromApprovedChart';
import approveDocumentAndComplete from '@salesforce/apex/AIForceDataLenseController.approveDocument';

const CHART_ITEM_BACKGROUND_COLOR = '#F5F5F5';

export default class AIForceDataLense extends LightningElement {
    @track messages = [];
    @track userQuery = '';
    @track isLoading = false;
    @track loadingMessage = 'Processing...';
    @track showChartOptions = false;
    @track availableChartTypes = [];
    @track lastUserTextQuery = '';

    @track showPdfPreview = false;
    @track pdfFileUrlForPreview = null;
    @track currentContentVersionIdForApproval = null;
    
    @track chatDisabled = false;
    
    @track isFullscreenPreview = false;
    @track activeFullscreenUrl = '';

    @track isFullscreenChartPreview = false;
    @track activeFullscreenChartUrl = '';

    loadingMessages = [
        'Processing your query...', 'Analyzing data...', 'Generating insights...', 'Compiling visuals...', 'Almost there...'
    ];
    currentLoadingMessageIndex = 0;
    loadingTimer;

    allChartTypes = ['bar', 'line', 'pie', 'scatter', 'hist', 'box'];
    chartTypeDescriptions = {
        'bar': 'Compares quantities across categories.',
        'line': 'Shows trends over time.',
        'pie': 'Displays parts of a whole.',
        'scatter': 'Shows relationships between two variables.',
        'hist': 'Displays the distribution of a dataset.',
        'box': 'Summarizes data distribution with quartiles.'
    };

    connectedCallback() {
        this.addInitialAIMessage();
    }

    renderedCallback() {
        this.scrollToBottom();
    }

    disconnectedCallback() {
        this.messages.forEach(message => {
            if (message.isImageMessage && message.imageUrl && message.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(message.imageUrl);
            }
        });
        if (this.pdfFileUrlForPreview && this.pdfFileUrlForPreview.startsWith('blob:')) {
            URL.revokeObjectURL(this.pdfFileUrlForPreview);
        }
        if (this.activeFullscreenUrl && this.activeFullscreenUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.activeFullscreenUrl);
        }
        if (this.activeFullscreenChartUrl && this.activeFullscreenChartUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.activeFullscreenChartUrl);
        }
        clearInterval(this.loadingTimer);
    }
    
    scrollToBottom() {
        const chatArea = this.template.querySelector('.aifdl-chat-area');
        if (chatArea) {
            setTimeout(() => {
                chatArea.scrollTop = chatArea.scrollHeight;
            }, 0);
        }
    }

    addInitialAIMessage() {
        const initialMessage = {
            id: 'ai-init-' + Date.now(),
            sender: 'Smart Buddy',
            text: 'Hi, how may I help you with your data?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUser: false,
        };
        this.addMessageToList(initialMessage);
    }
    
    createImageBlobUrl(base64String) {
        try {
            const byteCharacters = atob(base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/png' });
            return URL.createObjectURL(blob);
        } catch (e) {
            console.error('Error creating blob URL:', e);
            this.showToast('Error', 'Could not display image preview.', 'error');
            return null;
        }
    }

    setLoadingState(isLoading, customMessage = null) {
        this.isLoading = isLoading;
        if (isLoading) {
            this.currentLoadingMessageIndex = 0;
            this.loadingMessage = customMessage || this.loadingMessages[0];
            if (!customMessage) {
                this.loadingTimer = setInterval(() => {
                    this.currentLoadingMessageIndex = (this.currentLoadingMessageIndex + 1) % this.loadingMessages.length;
                    this.loadingMessage = this.loadingMessages[this.currentLoadingMessageIndex];
                }, 3000);
            }
        } else {
            clearInterval(this.loadingTimer);
            this.loadingTimer = null;
            this.loadingMessage = 'Processing...';
        }
    }

    showToast(title, message, variant, mode = 'dismissible') {
        const toastEvent = new ShowToastEvent({ title, message, variant, mode });
        this.dispatchEvent(toastEvent);
    }

    stopPropagation(event) {
        event.stopPropagation();
    }

    get showEmptyState() {
        return this.messages.length === 1 && this.messages[0].id.startsWith('ai-init-') && !this.isLoading && !this.showPdfPreview && !this.showChartOptions;
    }

    get isSendButtonDisabled() {
        return this.chatDisabled || !this.userQuery || this.userQuery.trim() === '' || this.isLoading;
    }

    get inputPlaceholder() {
        return this.chatDisabled ? 'Chat session completed.' : 'Type your question (e.g., "Sales by region as bar chart")';
    }

    get showApproveAndCompleteButton() {
        return this.pdfFileUrlForPreview && this.currentContentVersionIdForApproval && !this.chatDisabled;
    }

    handleInputChange(event) {
        this.userQuery = event.target.value;
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey && !this.isSendButtonDisabled) {
            event.preventDefault();
            this.handleSend();
        }
    }
    
    handleExampleClick(event) {
        if (this.chatDisabled || this.isLoading) return;
        this.userQuery = event.currentTarget.dataset.query;
        this.handleSend();
    }

    handleSend() {
        if (this.isSendButtonDisabled) return;

        this.showChartOptions = false;
        this.showPdfPreview = false; 
        this.pdfFileUrlForPreview = null;
        this.currentContentVersionIdForApproval = null;

        const queryToSend = this.userQuery;
        this.lastUserTextQuery = queryToSend; 

        this.addMessageToList({
            sender: 'You',
            text: queryToSend,
            isUser: true
        });
        
        this.userQuery = ''; 
        const textarea = this.template.querySelector('.aifdl-query-input');
        if (textarea) {
            textarea.focus();
        }
        this.setLoadingState(true, 'Generating response...');
        this.sendChartRequestToServer(queryToSend);
    }

    handleChartTypeSelection(event) {
        if (this.chatDisabled || this.isLoading) return;

        const selectedChartType = event.currentTarget.dataset.type;
        this.setLoadingState(true, `Generating ${selectedChartType} chart...`);
        this.showChartOptions = false;
        this.showPdfPreview = false;
        this.pdfFileUrlForPreview = null;
        this.currentContentVersionIdForApproval = null;

        const enhancedQuery = `${this.lastUserTextQuery} [user recommendation: ${selectedChartType}]`;
        
        this.addMessageToList({
            sender: 'You',
            text: `Change chart type to: ${selectedChartType}`,
            isUser: true,
            isSystemInteraction: true
        });
        
        this.sendChartRequestToServer(enhancedQuery, selectedChartType);
    }
    
    handleShowChartOptionsForMessage(event) {
        if(this.chatDisabled || this.isLoading) return;
        const messageId = event.currentTarget.dataset.messageId;
        const message = this.messages.find(msg => msg.id === messageId);
        if (message && message.originalUserQuery) {
            this.lastUserTextQuery = message.originalUserQuery; 
            this.prepareChartOptions(message.chartType); 
        }
        const msgIndex = this.messages.findIndex(m => m.id === messageId);
        if (msgIndex > -1) {
            this.messages[msgIndex].requiresApproval = false;
            this.messages = [...this.messages];
        }
        this.showPdfPreview = false; 
    }

    handleImageApproval(event) {
        if(this.chatDisabled || this.isLoading) return;
        const messageId = event.currentTarget.dataset.messageId;
        const message = this.messages.find(msg => msg.id === messageId);

        if (!message || !message.originalUserQuery || !message.chartType) {
            this.showToast('Error', 'Cannot process approval. Missing context.', 'error');
            return;
        }

        this.setLoadingState(true, 'Generating PDF report...');
        this.showChartOptions = false; 

        generateAndSavePdf({ originalQuery: message.originalUserQuery, chartType: message.chartType })
            .then(result => {
                this.setLoadingState(false);
                const msgIndex = this.messages.findIndex(m => m.id === messageId);

                if (result && result.status === 'success' && result.fileDownloadUrl && result.transientContentVersionId) {
                    if (msgIndex > -1) {
                        this.messages[msgIndex].requiresApproval = false;
                        this.messages[msgIndex].isApprovedForPdf = true;
                        this.messages = [...this.messages];
                    }
                    this.pdfFileUrlForPreview = result.fileDownloadUrl;
                    this.currentContentVersionIdForApproval = result.transientContentVersionId;
                    this.showPdfPreview = true;
                    this.addMessageToList({
                        sender: 'System',
                        text: `PDF report for "${message.originalUserQuery}" (${message.chartType} chart) is ready for preview.`,
                        isSystemMessage: true,
                        isSuccess: true
                    });

                } else {
                    if (msgIndex > -1) {
                        this.messages[msgIndex].requiresApproval = false; 
                        this.messages[msgIndex].pdfGenerationError = true;
                        this.messages = [...this.messages];
                    }
                    const errorText = result.user_query_response || 'Failed to generate PDF.';
                    this.showToast('PDF Generation Failed', errorText, 'error');
                    this.addMessageToList({
                        sender: 'System Alert',
                        text: `Failed to generate PDF: ${errorText}`,
                        isSystemMessage: true,
                        isError: true
                    });
                }
            })
            .catch(error => {
                this.setLoadingState(false);
                const msgIndex = this.messages.findIndex(m => m.id === messageId);
                if (msgIndex > -1) {
                    this.messages[msgIndex].requiresApproval = false; 
                    this.messages[msgIndex].pdfGenerationError = true;
                    this.messages = [...this.messages];
                }
                const errorMessage = error.body?.message || error.message || 'Unknown error during PDF generation.';
                this.showToast('Error', errorMessage, 'error');
                this.addMessageToList({
                    sender: 'System Alert',
                    text: `Error generating PDF: ${errorMessage}`,
                    isSystemMessage: true,
                    isError: true
                });
            });
    }

    handleApprovePdfAndComplete() {
        if (!this.currentContentVersionIdForApproval || this.chatDisabled || this.isLoading) return;

        this.setLoadingState(true, 'Finalizing and saving report...');
        approveDocumentAndComplete({ contentVersionId: this.currentContentVersionIdForApproval })
            .then(approvedFileResult => {
                this.setLoadingState(false);
                this.chatDisabled = true;
                this.showPdfPreview = false; 
                this.showChartOptions = false;
                
                this.addMessageToList({
                    sender: 'System',
                    text: 'Report approved and session completed! The document is saved in Salesforce.',
                    isSystemMessage: true,
                    isSuccess: true,
                    isFileCardMessage: true,
                    fileCardTitle: 'Approved Report: ' + (approvedFileResult.title || 'Data Insights'),
                    fileDownloadUrl: approvedFileResult.fileDownloadUrl 
                });
                this.showToast('Success', 'Report approved and session completed.', 'success');
            })
            .catch(error => {
                this.setLoadingState(false);
                const errorMessage = error.body?.message || error.message || 'Failed to approve document.';
                this.showToast('Approval Failed', errorMessage, 'error');
                this.addMessageToList({
                    sender: 'System Alert',
                    text: `Approval Failed: ${errorMessage}`,
                    isSystemMessage: true,
                    isError: true
                });
            });
    }
    
    handleCopyMessage(event) {
        const messageId = event.target.dataset.id;
        const message = this.messages.find(msg => msg.id === messageId);
        if (message && message.text) {
            navigator.clipboard.writeText(message.text)
                .then(() => this.showToast('Success', 'Message copied!', 'success'))
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    this.showToast('Error', 'Failed to copy message.', 'error');
                });
        }
    }

    handleExpandPreview(event) {
        const url = event.currentTarget.dataset.url;
        if (url) {
            this.activeFullscreenUrl = url;
            this.isFullscreenPreview = true;
        }
    }

    handleCloseFullscreen() {
        this.isFullscreenPreview = false;
        this.activeFullscreenUrl = '';
    }

    handleChartImageClick(event) {
        if (this.chatDisabled) return;
        const messageId = event.currentTarget.dataset.messageId;
        const message = this.messages.find(msg => msg.id === messageId);

        if (message && message.imageUrl) {
            this.activeFullscreenChartUrl = message.imageUrl; 
            this.isFullscreenChartPreview = true;
        } else {
            this.showToast('Error', 'Image not available for preview.', 'error');
        }
    }

    handleCloseFullscreenChart() {
        this.isFullscreenChartPreview = false;
    }

    sendChartRequestToServer(queryText, requestedChartType = null) {
        const thinkingMsgId = 'ai-thinking-' + Date.now();
        this.addMessageToList({
            id: thinkingMsgId,
            sender: 'Smart Buddy',
            isUser: false,
            isThinking: true
        });

        sendChartRequest({ query: queryText })
            .then(result => {
                this.setLoadingState(false);
                this.removeMessageById(thinkingMsgId); 

                let botResponseText = result.user_query_response || 'Received a response.';
                let messageIsError = false;

                if (result && result.status === 'success') {
                    if (result.png_content) {
                        const imageUrl = this.createImageBlobUrl(result.png_content);
                        
                        // --- THOROUGH CHECK MODIFICATION FOR record_data_summary START ---
                        let summaryDetailsForMessage = null;
                        if (result.record_data_summary && 
                            result.record_data_summary.summary_bullet_points && 
                            Array.isArray(result.record_data_summary.summary_bullet_points) &&
                            result.record_data_summary.summary_bullet_points.length > 0) {
                            
                            // Directly use summary_bullet_points as requested for the HTML
                            summaryDetailsForMessage = {
                                summary_bullet_points: result.record_data_summary.summary_bullet_points
                            };
                        } else if (result.record_data_summary) { 
                            // Log if record_data_summary exists but doesn't have the expected structure/content
                            console.warn('record_data_summary received from Apex did not contain a valid list of summary_bullet_points.', JSON.stringify(result.record_data_summary));
                            // Do not show "Summary" section if no valid bullet points.
                        }
                        // --- THOROUGH CHECK MODIFICATION FOR record_data_summary END ---

                        if (imageUrl) {
                            this.addMessageToList({
                                sender: 'Smart Buddy',
                                text: botResponseText, 
                                isUser: false,
                                isImageMessage: true,
                                imageUrl: imageUrl,
                                requiresApproval: true, 
                                chartType: result.chart_type || requestedChartType || this.detectChartTypeFromText(botResponseText, true),
                                originalUserQuery: this.lastUserTextQuery,
                                summaryDetails: summaryDetailsForMessage, // Pass the processed summary
                                hasChartBackground: true
                            });
                        } else { 
                            this.addMessageToList({ sender: 'Smart Buddy', text: "Error displaying chart image. " + botResponseText, isUser: false, isError: true });
                        }
                    } else { 
                        this.addMessageToList({ sender: 'Smart Buddy', text: botResponseText, isUser: false });
                        const detectedChartType = this.detectChartTypeFromText(botResponseText, true);
                        if (detectedChartType) {
                             this.prepareChartOptions(detectedChartType);
                        }
                    }
                } else { 
                    botResponseText = result.user_query_response || `AI reported: ${result.status || 'unknown issue'}`;
                    messageIsError = true;
                    this.showToast('AI Response', botResponseText, 'warning');
                    this.addMessageToList({ sender: 'Smart Buddy', text: botResponseText, isUser: false, isError: messageIsError });
                }
            })
            .catch(error => {
                this.setLoadingState(false);
                this.removeMessageById(thinkingMsgId);
                const errorMessageText = error.body?.message || error.message || 'Unknown backend communication error.';
                this.showToast('Error', errorMessageText, 'error');
                this.addMessageToList({
                    sender: 'System Alert',
                    text: 'Failed to get response: ' + errorMessageText,
                    isUser: false,
                    isError: true,
                    isSystemMessage: true
                });
            });
    }
    
    addMessageToList(msgDetails) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const baseMessage = {
            id: msgDetails.id || (msgDetails.isUser ? 'user-' : 'ai-') + Date.now(),
            sender: msgDetails.sender,
            text: msgDetails.text,
            timestamp: timestamp,
            isUser: msgDetails.isUser || false,
            isThinking: msgDetails.isThinking || false,
            isImageMessage: msgDetails.isImageMessage || false,
            imageUrl: msgDetails.imageUrl || null,
            requiresApproval: msgDetails.requiresApproval || false,
            isApprovedForPdf: msgDetails.isApprovedForPdf || false,
            pdfGenerationError: msgDetails.pdfGenerationError || false,
            chartType: msgDetails.chartType || null,
            originalUserQuery: msgDetails.originalUserQuery || null,
            isSystemMessage: msgDetails.isSystemMessage || false,
            isFileCardMessage: msgDetails.isFileCardMessage || false,
            fileCardTitle: msgDetails.fileCardTitle || null,
            fileDownloadUrl: msgDetails.fileDownloadUrl || null,
            summaryDetails: msgDetails.summaryDetails || null,
            hasChartBackground: msgDetails.hasChartBackground || false,
        };

        baseMessage.avatarType = baseMessage.isUser ? 'user' : 'ai';
        baseMessage.avatarInitial = baseMessage.isUser ? (baseMessage.sender.substring(0,1).toUpperCase() || 'U') : '';
        
        if (baseMessage.isUser) {
             baseMessage.avatarClass = 'aifdl-avatar aifdl-user-avatar aifdl-user-avatar-initials';
        } else { 
             baseMessage.avatarClass = 'aifdl-avatar aifdl-ai-avatar';
        }

        let senderStyle = 'aifdl-message';
        let contentStyle = 'aifdl-message-content';
        let textStyle = 'aifdl-message-text';

        if (msgDetails.isSystemInteraction) {
            senderStyle += ' aifdl-user-message aifdl-system-interaction-user';
            textStyle = 'aifdl-message-text'; 
        } else if (baseMessage.isSystemMessage) {
            senderStyle += ' aifdl-ai-message'; 
            if (msgDetails.isSuccess) {
                senderStyle += ' aifdl-system-success';
                textStyle += ' aifdl-text-color-success';
            } else if (msgDetails.isError) {
                senderStyle += ' aifdl-system-error';
                textStyle += ' aifdl-text-color-error';
            } else {
                senderStyle += ' aifdl-system-interaction-ai';
            }
        } else if (baseMessage.isUser) {
            senderStyle += ' aifdl-user-message';
            contentStyle += ' aifdl-user-message-content';
            textStyle += ' aifdl-user-message-text';
        } else { 
            senderStyle += ' aifdl-ai-message';
            if (msgDetails.isError) {
                textStyle += ' aifdl-text-color-error';
            }
        }

        if (baseMessage.hasChartBackground) {
            contentStyle += ' aifdl-chart-content-background';
        }
         if (baseMessage.isThinking) {
            contentStyle += ' aifdl-thinking-message-content'; 
        }
        
        baseMessage.computedSenderStyle = senderStyle;
        baseMessage.messageContentStyle = contentStyle;
        baseMessage.computedTextStyle = textStyle;

        this.messages = [...this.messages, baseMessage];
        this.scrollToBottom();
    }

    removeMessageById(messageId) {
        this.messages = this.messages.filter(msg => msg.id !== messageId);
    }
    
    prepareChartOptions(currentChartType) {
        if (!currentChartType) {
            this.showChartOptions = false;
            this.availableChartTypes = [];
            return;
        }
        const lowerCurrentChartType = currentChartType.toLowerCase();
        this.availableChartTypes = this.allChartTypes
            .filter(type => type.toLowerCase() !== lowerCurrentChartType)
            .map(type => ({
                value: type,
                label: type.charAt(0).toUpperCase() + type.slice(1),
                description: this.chartTypeDescriptions[type] || `View as ${type} chart.`,
                isBar: type === 'bar', isLine: type === 'line', isPie: type === 'pie',
                isScatter: type === 'scatter', isHist: type === 'hist', isBox: type === 'box'
            }));
        this.showChartOptions = this.availableChartTypes.length > 0;
    }

    detectChartTypeFromText(responseText, isForResult = false) {
        if (!responseText) return null;
        const lowerCaseResponse = responseText.toLowerCase();
        for (const chartType of this.allChartTypes) {
            if (lowerCaseResponse.includes(`${chartType} chart`) ||
                lowerCaseResponse.includes(`${chartType} graph`) ||
                (isForResult && lowerCaseResponse.includes(`type: ${chartType}`))) {
                return chartType;
            }
        }
        return null; 
    }
}