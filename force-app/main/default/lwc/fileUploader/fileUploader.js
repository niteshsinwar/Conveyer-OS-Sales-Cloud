import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAuthToken from '@salesforce/apex/VideoUploadService.getAuthToken';
import getBaseUrl from '@salesforce/apex/VideoUploadService.getBaseUrl';

export default class VideoUploader extends LightningElement {
    @api accountId = "001J400000W2Q41IAF";
    @api checklistName = 'sampleTestVideo';

    @track isUploading = false;
    @track uploadProgress = 0;
    @track authToken = '';
    @track fileName = '';
    @track selectedFile;
    @track showVideo = false;
    @track videoUrl = '';
    @track baseUrl = '';
    @track formattedSize='';

    // Connect and initialize the component
    async connectedCallback() {
        console.log('[VideoUploader] Component initialized');
        console.log(`[VideoUploader] Account ID set to: ${this.accountId}`);
        console.log(`[VideoUploader] Checklist Name set to: ${this.checklistName || 'Not yet defined'}`);
        
        try {
            // Get base URL for API endpoints
            this.baseUrl = await getBaseUrl();
            console.log(`[VideoUploader] Base URL set to: ${this.baseUrl}`);
            
            // Start authentication process
            console.log('[VideoUploader] Starting authentication process...');
            await this.authenticate();
        } catch (error) {
            console.error('[VideoUploader:connectedCallback] Error during initialization:', error);
        }
    }

    // Handle authentication via Apex
    async authenticate() {
        console.log('[VideoUploader:authenticate] Starting authentication request');
        
        try {
            // Get auth token from Apex
            this.authToken = await getAuthToken();
            console.log('[VideoUploader:authenticate] Authentication successful');
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Authentication Successful',
                    message: 'Ready to upload videos',
                    variant: 'success'
                })
            );
        } catch (error) {
            console.error('[VideoUploader:authenticate] Exception caught:', error);
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Authentication Error',
                    message: error.message,
                    variant: 'error'
                })
            );
        }
    }

    // Handle file selection
    handleFileChange(event) {
        const fileInput = event.target;

        if (fileInput.files.length > 0) {
            this.selectedFile = fileInput.files[0];
            console.log('[VideoUploader:handleFileChange] File selected:', this.selectedFile.name);
            console.log(`[VideoUploader:handleFileChange] File details - Size: ${this.formatFileSize(this.selectedFile.size)}, Type: ${this.selectedFile.type}`);
            this.formattedSize=this.formatFileSize(this.selectedFile.size);
        } else {
            console.log('[VideoUploader:handleFileChange] No file selected');
        }
    }

    // Format file size for display
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / 1048576).toFixed(2) + ' MB';
    }

    // Handle video upload
    async handleUpload() {
        console.log('[VideoUploader:handleUpload] Upload button clicked');

        if (!this.selectedFile) {
            console.error('[VideoUploader:handleUpload] No file selected');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select a video file first',
                    variant: 'error'
                })
            );
            return;
        }

        console.log(`[VideoUploader:handleUpload] Validating parameters - Account ID: ${this.accountId}, Checklist Name: ${this.checklistName}`);

        if (!this.accountId || !this.checklistName) {
            console.error('[VideoUploader:handleUpload] Missing required parameters');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Account ID and Checklist Name are required',
                    variant: 'error'
                })
            );
            return;
        }

        if (!this.authToken) {
            console.log('[VideoUploader:handleUpload] Auth token not found, attempting to re-authenticate');
            await this.authenticate();
            if (!this.authToken) {
                console.error('[VideoUploader:handleUpload] Authentication failed, cannot proceed with upload');
                return;
            }
        }

        console.log('[VideoUploader:handleUpload] Starting upload process');
        this.isUploading = true;
        this.uploadProgress = 10;

        try {
            const formData = new FormData();
            formData.append('file', this.selectedFile);

            const encodedChecklist = encodeURIComponent(this.checklistName);
            const uploadUrl = `${this.baseUrl}/ManageFiles/UploadVideo?ApplicationId=${this.accountId}&ChecklistName=${encodedChecklist}`;

            console.log(`[VideoUploader:handleUpload] Sending file to: ${uploadUrl}`);
            console.log(`[VideoUploader:handleUpload] Auth Token prefix: ${this.authToken.substring(0, 15)}...`);

            this.uploadProgress = 25;

            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'accept': '*/*'
                },
                body: formData
            });

            this.uploadProgress = 90;
            console.log(`[VideoUploader:handleUpload] Upload response status: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const result = await response.json();
                console.log('[VideoUploader:handleUpload] Upload successful, response:', result);

                this.fileName = result.FileName;
                console.log(`[VideoUploader:handleUpload] File saved with name: ${this.fileName}`);

                this.uploadProgress = 100;

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Video uploaded successfully',
                        variant: 'success'
                    })
                );

                console.log('[VideoUploader:handleUpload] Form reset successfully');
            } else {
                console.error(`[VideoUploader:handleUpload] Upload failed with status ${response.status}`);

                // Try to get more error details
                try {
                    const errorText = await response.text();
                    console.error('[VideoUploader:handleUpload] Error response body:', errorText);
                } catch (textError) {
                    console.error('[VideoUploader:handleUpload] Could not parse error response');
                }

                throw new Error(`Upload failed: ${response.statusText}`);
            }
        } catch (error) {
            console.error('[VideoUploader:handleUpload] Exception caught:', error);
            console.error('[VideoUploader:handleUpload] Error stack:', error.stack);

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Upload Error',
                    message: error.message,
                    variant: 'error'
                })
            );
        } finally {
            console.log('[VideoUploader:handleUpload] Upload process completed');
            this.isUploading = false;
            this.uploadProgress = 0;
        }
    }

    // Handle viewing uploaded video
    async viewUploadedVideo() {
        console.log('[VideoUploader:viewUploadedVideo] View button clicked');

        if (!this.fileName) {
            console.error('[VideoUploader:viewUploadedVideo] No file has been uploaded yet');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'No video has been uploaded yet',
                    variant: 'error'
                })
            );
            return;
        }

        if (!this.authToken) {
            console.log('[VideoUploader:viewUploadedVideo] Auth token not found, attempting to re-authenticate');
            await this.authenticate();
            if (!this.authToken) {
                console.error('[VideoUploader:viewUploadedVideo] Authentication failed, cannot view video');
                return;
            }
        }

        try {
            this.isUploading = true; // Reuse loading indicator
            this.uploadProgress = 30; // Show some progress

            const videoEndpoint = `${this.baseUrl}/ManageFiles/ViewVideo/${this.fileName}`;
            console.log(`[VideoUploader:viewUploadedVideo] Fetching video from: ${videoEndpoint}`);

            const response = await fetch(videoEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'accept': '*/*'
                }
            });

            this.uploadProgress = 60;

            if (!response.ok) {
                throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
            }

            // Get video blob
            const videoBlob = await response.blob();
            this.uploadProgress = 90;

            // Create blob URL for video
            this.videoUrl = URL.createObjectURL(videoBlob);
            console.log(`[VideoUploader:viewUploadedVideo] Video blob URL created: ${this.videoUrl.substring(0, 30)}...`);

            this.showVideo = true;
            console.log('[VideoUploader:viewUploadedVideo] Video modal opened');
        } catch (error) {
            console.error('[VideoUploader:viewUploadedVideo] Error:', error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Viewing Video',
                    message: error.message,
                    variant: 'error'
                })
            );
        } finally {
            this.isUploading = false;
            this.uploadProgress = 0;
        }
    }

    // Close video modal
    closeVideo() {
        console.log('[VideoUploader:closeVideo] Closing video modal');
        this.showVideo = false;

        // Revoke the blob URL to free up memory
        if (this.videoUrl && this.videoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.videoUrl);
            console.log('[VideoUploader:closeVideo] Blob URL revoked');
        }

        this.videoUrl = '';
    }

    // Component lifecycle methods
    renderedCallback() {
        console.log('[VideoUploader:renderedCallback] Component rendered');
    }

    disconnectedCallback() {
        console.log('[VideoUploader:disconnectedCallback] Component disconnected/destroyed');
    }

    errorCallback(error, stack) {
        console.error('[VideoUploader:errorCallback] Lifecycle error', error);
        console.error('[VideoUploader:errorCallback] Stack:', stack);
    }
}