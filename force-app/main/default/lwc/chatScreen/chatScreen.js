import { LightningElement, track, api } from 'lwc';
import sendMessageToBackend from '@salesforce/apex/ChatScreenController.sendMessageToBackend'; // Use your Apex controller
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Debounce utility (keep as is)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default class ChatScreen extends LightningElement {
    @track userInput = '';
    @track chatHistory = [];
    @track isLoading = false;
    @track isModalOpen = false; // Controls modal visibility
    @api recordId; // Optional: Context record Id

    messageCounter = 0; // Simple key generation

    // Debounced scroll function
    debouncedScrollToBottom = debounce(this.scrollToBottom, 150); // Slightly longer debounce for smoother scroll after render

    // --- Lifecycle Hooks ---
    renderedCallback() {
        // Scroll to bottom when new messages are added or loading state changes
        // Check if modal is open before scrolling
        if (this.isModalOpen) {
             this.debouncedScrollToBottom();
        }
    }

    // --- Modal Control ---
    handleFabClick() {
        this.isModalOpen = true;
        // Focus input when modal opens
        // Use setTimeout to allow the modal and textarea to render
        setTimeout(() => {
            const inputElement = this.template.querySelector('.chat-input lightning-textarea');
            if (inputElement) {
                inputElement.focus();
            }
        }, 50); // Small delay seems sufficient for SLDS modal
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }

    // --- Chat Logic ---
    handleInputChange(event) {
        this.userInput = event.target.value;
        // Auto-adjust textarea height (basic implementation)
        // SLDS Textarea doesn't auto-grow easily, this is less critical with SLDS styling
        // event.target.style.height = 'auto';
        // event.target.style.height = `${event.target.scrollHeight}px`;
    }

    handleKeyDown(event) {
        // Send message on Enter key if not loading and Shift is not pressed
        if (event.keyCode === 13 && !event.shiftKey && !this.isLoading) {
            event.preventDefault(); // Prevent new line in textarea
            this.handleSend();
        }
        // Allow closing modal with Escape key
        if (event.keyCode === 27) { // Escape key
            this.handleCloseModal();
        }
    }

    handleSend() {
        const messageText = this.userInput.trim();
        if (!messageText || this.isLoading) {
            return; // Don't send empty messages or while loading
        }

        // Add user message to chat
        this.addMessageToChat(messageText, 'user');
        this.userInput = ''; // Clear input
        this.isLoading = true; // Show loading indicator

        // Call Apex controller
        sendMessageToBackend({ message: messageText, contextRecordId: this.recordId })
            .then(result => {
                this.isLoading = false;
                // Add assistant response to chat, format code blocks
                this.addMessageToChat(result, 'assistant');
            })
            .catch(error => {
                this.isLoading = false;
                console.error('Error calling backend:', error);
                // Add error message to chat
                const errorMessage = this.getErrorMessage(error);
                this.addMessageToChat(`Assistant Error:\n${errorMessage}`, 'assistant', true);
                // Optionally show a toast as well, but error in chat is clearer
                // this.showToast('Endgame AI Error', errorMessage, 'error');
            });
    }

    // Helper to add message to the chat history using SLDS chat classes
    addMessageToChat(text, sender, isError = false) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Determine SLDS classes based on sender and error status
        let listItemClass = 'slds-chat-listitem';
        let messageBodyClass = 'slds-chat-message__body';
        let metaTextColorClass = 'slds-chat-message__meta slds-text-color_weak'; // Default meta text color
        let senderLabel = '';
        let ariaLabel = '';

        if (sender === 'user') {
            listItemClass += ' slds-chat-listitem_outbound';
            messageBodyClass += ' slds-theme_default'; // Using theme_default for user, see CSS for color override
            senderLabel = 'You';
             ariaLabel = `You sent ${timestamp}`;
        } else { // Assistant
            listItemClass += ' slds-chat-listitem_inbound';
             senderLabel = 'Endgame AI';
             ariaLabel = `Endgame AI received ${timestamp}`;

            if (isError) {
                 listItemClass += ' chat-message-error'; // Custom class to target error styling
                 messageBodyClass += ' chat-message-error-body'; // Placeholder if specific body styling needed beyond listitem
                 metaTextColorClass = 'slds-chat-message__meta slds-text-color_error';
            } else {
                messageBodyClass += ' slds-theme_default'; // Standard inbound bubble background
            }
        }

        // Escape HTML entities *before* applying Markdown-like formatting
        // This prevents injection if the backend response contained HTML.
        let escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Basic formatting for code blocks (```lang\ncode\n```) -> <pre><code>
        // Using a non-greedy match for the code block content ([\s\S]*?)
        let formattedText = escapedText.replace(/```(\w*?)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            // The code inside ``` is already HTML-escaped by the initial replacement
            // No need for language class with lightning-formatted-rich-text, but pre/code is good structure
            return `<pre><code>${code.trim()}</code></pre>`;
        });

         // Format inline code (`code`) -> <code>
         // Ensure it doesn't match within the ``` blocks already processed (though the order helps)
         formattedText = formattedText.replace(/`([^`\n]+)`/g, (match, code) => {
              // Inline code is already HTML-escaped
              return `<code>${code}</code>`;
         });

        // Replace newline characters with <br> tags for proper line breaks in HTML
        // Do this *after* processing code blocks to preserve newlines within <pre>
        formattedText = formattedText.replace(/\n/g, '<br />');
        // But, remove <br /> tags that were just inserted inside <pre><code> blocks
        formattedText = formattedText.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
            return `<pre><code>${code.replace(/<br \/>/g, '\n')}</code></pre>`;
        });


        this.chatHistory = [...this.chatHistory, {
            id: this.messageCounter++,
            text: text, // Original text
            formattedText: formattedText, // Text formatted for rich text display
            sender: sender,
            isError: isError,
            timestamp: timestamp,
            listItemClass: listItemClass,
            messageBodyClass: messageBodyClass,
            metaTextColorClass: metaTextColorClass,
            senderLabel: senderLabel,
            ariaLabel: ariaLabel
        }];

        // Scroll handling will be managed by renderedCallback after state update
    }

    // Scroll chat history container to the bottom
    scrollToBottom() {
        const chatContainer = this.template.querySelector('.chat-history-container');
        if (chatContainer) {
            // Use smooth scroll for better UX
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    }

    // Helper to show toast messages (keep as is)
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    // Helper to extract a user-friendly error message (keep as is)
     getErrorMessage(error) {
        let message = 'An unknown error occurred.';
        if (error) {
            if (error.body && error.body.message) { // AuraHandledException
                message = error.body.message;
            } else if (error.message) { // JS error
                message = error.message;
            } else if (typeof error === 'string') { // String error
                message = error;
            } else if (error.body && typeof error.body === 'string') { // Sometimes errors are stringified JSON in body
                 try {
                     const bodyError = JSON.parse(error.body);
                     if(bodyError.message) message = bodyError.message;
                     else if (bodyError.detail) message = bodyError.detail; // Common in Python backends
                     else message = error.body; // Fallback to raw body string
                 } catch(e) {
                     message = error.body; // Fallback to raw body string if JSON parse fails
                 }
            } else if (error.detail) { // Python errors often have detail
                message = error.detail;
            }
        }
        // Basic check for common callout issues
        if (message.includes('Unauthorized endpoint') || message.includes('endpoint URL specified')) {
             message += ' (Ensure the endpoint is registered in Remote Site Settings within Salesforce Setup).';
        }
        return message;
    }

    // --- Computed Properties ---
    get fabContainerClass() {
        // Add class to hide FAB container when modal is open
        return `fab-container ${this.isModalOpen ? 'slds-hide' : ''}`;
    }

    get isSendDisabled() {
        // Disable send if input is empty/whitespace or if loading
        return !this.userInput.trim() || this.isLoading;
    }
}