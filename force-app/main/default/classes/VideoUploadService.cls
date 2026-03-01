public with sharing class VideoUploadService {
   private static final String BASE_URL = 'https://testplacements.isb.edu/SFAdmissions/api';
    
    /**
     * Authenticate with the external service and return the auth token
     * @return Authentication token for the external API
     */
    @AuraEnabled
    public static String getAuthToken() {
        try {
            // Set up the HTTP request for authentication
            HttpRequest req = new HttpRequest();
            req.setEndpoint(BASE_URL + '/User/authenticate');
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setHeader('accept', '*/*');
            
            // Create authentication payload - in production, move these to Custom Settings
            Map<String, String> authPayload = new Map<String, String>{
                'Email' => 'admin@isb.edu',
                'ClientSecret' => '0E756529-C95C-4550-96CC-7514F89CE9F4'
            };
            
            req.setBody(JSON.serialize(authPayload));
            
            // Send the HTTP request
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            // Process the response
            if (res.getStatusCode() == 200) {
                Map<String, Object> resultMap = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
                
                // Check if status is OK and token exists
                if (resultMap.get('Status') == 'Ok' && resultMap.containsKey('Data')) {
                    Map<String, Object> dataMap = (Map<String, Object>)resultMap.get('Data');
                    if (dataMap.containsKey('Token')) {
                        return (String)dataMap.get('Token');
                    }
                }
                
                throw new AuraHandledException('Authentication failed: Invalid response structure');
            } else {
                String errorMessage = 'Authentication failed with status: ' + res.getStatusCode();
                System.debug('Error: ' + errorMessage + ', Body: ' + res.getBody());
                throw new AuraHandledException(errorMessage);
            }
        } catch (Exception e) {
            System.debug('Exception in getAuthToken: ' + e.getMessage() + '\n' + e.getStackTraceString());
            throw new AuraHandledException('Authentication error: ' + e.getMessage());
        }
    }

    /**
     * Get the base URL for API calls
     * @return Base URL for the external API
     */
    @AuraEnabled
    public static String getBaseUrl() {
        return BASE_URL;
    }
}