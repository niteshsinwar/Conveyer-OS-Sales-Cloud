// ChatScreenController.cls
@RestResource(urlMapping='/ai-assistant/*') // Expose this class as a REST endpoint
global with sharing class ChatScreenController {

    // IMPORTANT: Replace with the actual URL of your Python backend service
    // Ensure this URL is added to Remote Site Settings in Salesforce Setup.
    private static final String BACKEND_DIRECT_URL = 'https://salesforce-ai-backend.onrender.com/process_request'; // e.g., 'https://your-app.onrender.com/process_request'

    // Method called by the LWC
    @AuraEnabled(cacheable=false) // Use cacheable=false for methods performing DML or callouts
    public static String sendMessageToBackend(String message, Id contextRecordId) {
        if (String.isBlank(message)) {
            throw new AuraHandledException('Message cannot be empty.');
        }

        // Validate if the URL has been set (simple check)
        if (String.isBlank(BACKEND_DIRECT_URL) ) {
             System.debug(LoggingLevel.ERROR, 'Backend URL is not configured in ChatScreenController.cls');
             throw new AuraHandledException('Backend service URL is not configured. Please update the Apex class.');
        }

        // Prepare the request body for the Python backend
        Map<String, Object> requestBodyMap = new Map<String, Object>{
            'user_query' => message,
            'salesforce_context' => new Map<String, Object>{
                'record_id' => contextRecordId,
                'user_id' => UserInfo.getUserId(),
                'org_id' => UserInfo.getOrganizationId()
                // Add any other relevant context if needed
            }
        };
        String requestBodyJson = JSON.serialize(requestBodyMap);

        // Prepare the HTTP request
        HttpRequest req = new HttpRequest();
        // Set the endpoint directly using the URL string
        req.setEndpoint(BACKEND_DIRECT_URL);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json;charset=UTF-8');
        // Set timeout (consider making this configurable or longer for potentially long AI operations)
        req.setTimeout(120000); // 120 seconds timeout
        req.setBody(requestBodyJson);

        String responseBody = '';
        Integer statusCode = 0;

        try {
            // Send the request
            Http http = new Http();
            HttpResponse res = http.send(req);

            statusCode = res.getStatusCode();
            responseBody = res.getBody();

            // Handle response based on status code
            if (statusCode >= 200 && statusCode < 300) {
                // Attempt to parse the response assuming it's JSON with a 'response' key
                Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(responseBody);
                if (responseMap != null && responseMap.containsKey('response')) {
                    return (String) responseMap.get('response');
                } else {
                    // If response format is unexpected, return the raw body (or handle differently)
                    System.debug(LoggingLevel.WARN, 'Backend response format unexpected: ' + responseBody);
                    return 'Received a response, but couldn\'t parse the expected format.';
                }
            } else {
                // Handle non-2xx responses
                String errorMessage = 'Backend Error: Status ' + statusCode + '. Response: ' + responseBody;
                System.debug(LoggingLevel.ERROR, errorMessage);
                // Include a hint about Remote Site Settings for common callout failures
                String failureHint = (statusCode == 403) ? ' Check if the endpoint URL (' + BACKEND_DIRECT_URL + ') is added to Remote Site Settings.' : '';
                throw new AuraHandledException('Failed to communicate with the AI backend. Status code: ' + statusCode + failureHint);
            }

        } catch (System.CalloutException ce) {
            // Catch specific CalloutExceptions, often related to Remote Site Settings or connectivity
            System.debug(LoggingLevel.ERROR, 'Callout Exception: ' + ce.getMessage() + '\nStackTrace: ' + ce.getStackTraceString());
            throw new AuraHandledException('Error making callout: ' + ce.getMessage() + '. Ensure the endpoint URL (' + BACKEND_DIRECT_URL + ') is correct and added to Remote Site Settings.');
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'General Exception: ' + e.getMessage() + '\nStackTrace: ' + e.getStackTraceString());
            // Rethrow as AuraHandledException so it's nicely displayed in LWC
            throw new AuraHandledException('An unexpected error occurred: ' + e.getMessage());
        }
    }

    
}