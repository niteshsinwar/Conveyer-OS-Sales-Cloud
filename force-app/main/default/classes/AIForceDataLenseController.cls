public with sharing class AIForceDataLenseController {

    // Inner classes (RequestBody, SalesforceContext) remain the same.
    private class RequestBody {
        String user_query;
        String response_type; // 'png' or 'pdf'
        SalesforceContext salesforce_context;

        public RequestBody(String userQuery, String responseType, SalesforceContext context) {
            this.user_query = userQuery;
            this.response_type = responseType; // Critical for Python to know what to generate
            this.salesforce_context = context;
        }
    }

    private class SalesforceContext {
        String record_id;
        String user_id;
        String org_id;
        public SalesforceContext() {
            this.record_id = null; // Populate if contextually available and needed by Python
            this.user_id = UserInfo.getUserId();
            this.org_id = UserInfo.getOrganizationId();
        }
    }

    // New inner class to represent the structure of record_data_summary
    public class RecordSummaryDetails {
        @AuraEnabled public List<String> summary_bullet_points { get; set; }
        // If other fields are expected in the summary, add them here.
        // For example:
        // @AuraEnabled public String overall_sentiment { get; set; }
        // @AuraEnabled public Map<String, Object> additional_data { get; set; }

        public RecordSummaryDetails() {
            this.summary_bullet_points = new List<String>();
        }
    }

    public class PythonResponse {
        @AuraEnabled public String user_query_response { get; set; }
        @AuraEnabled public String pdf_content { get; set; }
        @AuraEnabled public String png_content { get; set; } // Expecting this for chart requests
        @AuraEnabled public String status { get; set; } // 'success', 'failure'
        @AuraEnabled public String fileDownloadUrl { get; set; }
        @AuraEnabled public String chart_type { get; set; }
        // MODIFICATION: Changed type from String to RecordSummaryDetails
        @AuraEnabled public RecordSummaryDetails record_data_summary { get; set; }
        @AuraEnabled public String transientContentVersionId { get; set; }

        public PythonResponse() {
            this.status = 'failure'; // Default status
            // MODIFICATION: Initialize the new complex type
            this.record_data_summary = new RecordSummaryDetails();
        }
    }
    
    // Method to get PNG chart data
    @AuraEnabled
    public static PythonResponse sendChartRequest(String query) {
        return makeApiCall(query, 'png');
    }

    // New method for getting PDF after chart approval
    @AuraEnabled
    public static PythonResponse generateAndSavePdfFromApprovedChart(String originalQuery, String chartType) {
        String pdfQuery = originalQuery;
        if (String.isNotBlank(chartType)) {
            pdfQuery += ' [generate_pdf_for_chart: ' + chartType + ']';
        } else {
            pdfQuery += ' [generate_pdf: true]';
        }
        
        PythonResponse pythonResponse = makeApiCall(pdfQuery, 'pdf');

        if (pythonResponse != null && pythonResponse.status == 'success' && !String.isBlank(pythonResponse.pdf_content)) {
            try {
                ContentVersion cv = new ContentVersion();
                cv.VersionData = EncodingUtil.base64Decode(pythonResponse.pdf_content);
                String titleBase = 'AIFDL_Generated_Report_' + Datetime.now().format('yyyyMMdd_HHmmss');
                cv.Title = titleBase;
                cv.PathOnClient = titleBase + '.pdf';
                cv.approved__c = false; // IMPORTANT: Initially unapproved
                insert cv;
                System.debug('ContentVersion for PDF created with Id: ' + cv.Id);

                pythonResponse.transientContentVersionId = cv.Id;
                String baseUrl = URL.getOrgDomainUrl().toExternalForm();
                pythonResponse.fileDownloadUrl = baseUrl + '/sfc/servlet.shepherd/version/download/' + cv.Id;
                pythonResponse.pdf_content = null; 

            } catch (Exception e) {
                System.debug('Error creating ContentVersion for PDF: ' + e.getMessage() + e.getStackTraceString());
                pythonResponse.status = 'failure';
                pythonResponse.user_query_response = (pythonResponse.user_query_response == null ? '' : pythonResponse.user_query_response) +
                                                    ' (Error: Failed to save PDF in Salesforce: ' + e.getMessage() + ')';
                pythonResponse.transientContentVersionId = null;
                pythonResponse.fileDownloadUrl = null;
                pythonResponse.pdf_content = null;
            }
        } else if (pythonResponse != null && pythonResponse.status == 'success' && String.isBlank(pythonResponse.pdf_content)) {
            pythonResponse.status = 'failure';
            pythonResponse.user_query_response = (pythonResponse.user_query_response == null ? '' : pythonResponse.user_query_response) +
                                                ' (Error: PDF content was expected from AI but not received.)';
        }
        return pythonResponse;
    }
    
    // Centralized API call logic
    private static PythonResponse makeApiCall(String query, String responseType) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://aiforce-data-lense.onrender.com/process_chart_request');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json;charset=UTF-8');
        request.setTimeout(120000); 

        RequestBody requestBodyObj = new RequestBody(query, responseType, new SalesforceContext());
        String requestBodyJson = JSON.serialize(requestBodyObj);
        request.setBody(requestBodyJson);
        System.debug('Calling Python Service. Type: ' + responseType + '. Body: ' + requestBodyJson);

        try {
            HttpResponse response = http.send(request);
            System.debug('Python Service Response. Status Code: ' + response.getStatusCode() + '. Body: ' + response.getBody());

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                PythonResponse pyResp = (PythonResponse)JSON.deserialize(response.getBody(), PythonResponse.class);
                if (pyResp == null) { 
                    pyResp = new PythonResponse();
                    pyResp.status = 'failure';
                    pyResp.user_query_response = 'Received an empty but valid JSON response from AI service.';
                }
                if ('png'.equalsIgnoreCase(responseType) && String.isNotBlank(pyResp.user_query_response)) {
                    pyResp.chart_type = extractChartType(pyResp.user_query_response);
                }
                return pyResp;
            } else {
                String errorBody = response.getBody();
                System.debug('Error from Python Service (HTTP ' + response.getStatusCode() + '): ' + errorBody);
                PythonResponse errorResp = new PythonResponse();
                errorResp.status = 'failure';
                try { 
                    Map<String, Object> errorMap = (Map<String, Object>)JSON.deserializeUntyped(errorBody);
                    errorResp.user_query_response = 'AI service error: ' + (errorMap.containsKey('detail') ? String.valueOf(errorMap.get('detail')) : errorBody);
                } catch(Exception jsonEx) {
                    errorResp.user_query_response = 'AI service call failed with HTTP status ' + response.getStatusCode() + '. Non-JSON response: ' + errorBody;
                }
                return errorResp;
            }
        } catch (Exception e) {
            System.debug('Apex Exception during callout: ' + e.getMessage() + ' Stacktrace: ' + e.getStackTraceString());
            PythonResponse exceptionResp = new PythonResponse();
            exceptionResp.status = 'failure';
            exceptionResp.user_query_response = 'Salesforce system error during AI call: ' + e.getMessage();
            return exceptionResp;
        }
    }

    @AuraEnabled
    public static Map<String, String> approveDocument(String contentVersionId) {
        if (String.isBlank(contentVersionId)) {
            throw new AuraHandledException('ContentVersion ID is required.');
        }
        try {
            ContentVersion cv = [SELECT Id, Title, approved__c, ContentDocumentId 
                                 FROM ContentVersion 
                                 WHERE Id = :contentVersionId AND IsLatest = true LIMIT 1];
            
            if (cv == null) {
                throw new AuraHandledException('No ContentVersion found with Id: ' + contentVersionId);
            }

            cv.approved__c = true;
            update cv;
            System.debug('ContentVersion approved: ' + cv.Id);

            String baseUrl = URL.getOrgDomainUrl().toExternalForm();
            String fileDownloadUrl = baseUrl + '/sfc/servlet.shepherd/document/download/' + cv.ContentDocumentId;

            Map<String, String> result = new Map<String, String>();
            result.put('status', 'success');
            result.put('message', 'Document approved successfully.');
            result.put('fileDownloadUrl', fileDownloadUrl);
            return result;

        } catch (Exception e) {
            System.debug('Exception approving document: ' + e.getMessage() + ' Stacktrace: ' + e.getStackTraceString());
            throw new AuraHandledException('Failed to approve document: ' + e.getMessage());
        }
    }
    
    private static String extractChartType(String responseText) {
        if (String.isBlank(responseText)) return null;
        
        String[] chartKeywords = new String[]{'bar chart', 'line chart', 'pie chart', 'scatter plot', 'scatter chart', 'histogram', 'box plot', 
                                              'bar graph', 'line graph', 'pie graph', 
                                              'type: bar', 'type: line', 'type: pie', 'type: scatter', 'type: hist', 'type: box'};
        String[] chartTypes = new String[]{'bar', 'line', 'pie', 'scatter', 'scatter', 'hist', 'box', 
                                           'bar', 'line', 'pie', 
                                           'bar', 'line', 'pie', 'scatter', 'hist', 'box'};

        String lowerCaseResponse = responseText.toLowerCase();
        for (Integer i = 0; i < chartKeywords.size(); i++) {
            if (lowerCaseResponse.contains(chartKeywords[i])) {
                return chartTypes[i];
            }
        }
        return null; 
    }
}