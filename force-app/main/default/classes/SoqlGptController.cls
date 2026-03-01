/**
 * @description Controller class for SOQL-GPT Lightning Web Component
 * Handles communication between Salesforce and the SOQL-GPT API server
 * Supports multi-user session management (API v3.0)
 * @author SOQL-GPT Team
 * @version 3.0
 */
public with sharing class SoqlGptController {
    
    /**
     * @description Test connection to SOQL-GPT API
     * @param baseUrl Base URL of the API server
     * @return Map with success status and data/error message
     */
    @AuraEnabled
    public static Map<String, Object> testConnection(String baseUrl) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/health';
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setTimeout(10000); // 10 seconds
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'API returned status code: ' + res.getStatusCode());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Get available workspaces from API
     * @param baseUrl Base URL of the API server
     * @return Map with success status and workspace data
     */
    @AuraEnabled
    public static Map<String, Object> getWorkspaces(String baseUrl) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            // Server uses v1 API path
            String endpoint = baseUrl + '/api/v1/workspaces';
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('GET');
            req.setTimeout(10000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Failed to fetch workspaces: ' + res.getStatusCode());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Call Intent Agent to determine workspace (SESSION INITIATOR)
     * @param baseUrl Base URL of the API server
     * @param userQuery Natural language query
     * @param userId User ID for personalization
     * @param sessionId Session ID (null for first call, will be generated)
     * @return Map with success status, intent data, and session_id
     */
    @AuraEnabled
    public static Map<String, Object> generateIntent(
        String baseUrl, 
        String userQuery, 
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/intent';
            
            Map<String, Object> requestBody = new Map<String, Object>{
                'user_query' => userQuery,
                'user_id' => userId,
                'session_id' => sessionId  // null for first call
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000); // 30 seconds for LLM call
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Intent generation failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Call Object Agent to select relevant Salesforce objects (CAN BE SESSION INITIATOR if workspace known)
     * @param baseUrl Base URL of the API server
     * @param userQuery Natural language query
     * @param workspace Selected workspace
     * @param intentRationale Rationale from Intent Agent
     * @param userId User ID for personalization
     * @param sessionId Session ID (null for first call, will be generated)
     * @return Map with success status, object data, and session_id
     */
    @AuraEnabled
    public static Map<String, Object> generateObjects(
        String baseUrl,
        String userQuery,
        String workspace,
        String intentRationale,
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/objects';
            
            Map<String, Object> requestBody = new Map<String, Object>{
                'user_query' => userQuery,
                'workspace' => workspace,
                'intent_agent_rationale' => intentRationale,
                'user_id' => userId,
                'session_id' => sessionId  // Required for continuing, null for first call
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Object selection failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Call Field Agent to select relevant fields
     * @param baseUrl Base URL of the API server
     * @param userQuery Natural language query
     * @param workspace Selected workspace
     * @param selectedObjects Objects from Object Agent
     * @param objectRationale Rationale from Object Agent
     * @param userId User ID for personalization
     * @param sessionId Session ID (REQUIRED - must have active session)
     * @return Map with success status and field data
     */
    @AuraEnabled
    public static Map<String, Object> generateFields(
        String baseUrl,
        String userQuery,
        String workspace,
        List<String> selectedObjects,
        String objectRationale,
        String intentRationale,
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/fields';
            
            // Build request body with correct snake_case parameter names per API v3.0 spec
            Map<String, Object> requestBody = new Map<String, Object>{
                'user_query' => userQuery,
                'workspace' => workspace,
                'confirmed_objects' => selectedObjects,
                'intent_agent_rationale' => intentRationale,
                'object_agent_rationale' => objectRationale,
                'user_id' => userId,
                'session_id' => sessionId  // Required!
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Field selection failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Call SOQL Agent to generate SOQL query and chart recommendation
     * @param baseUrl Base URL of the API server
     * @param userQuery Natural language query
     * @param workspace Selected workspace
     * @param selectedObjects Objects from Object Agent
     * @param selectedFields Fields from Field Agent (Map format)
     * @param fieldRationale Rationale from Field Agent (immediate previous agent only)
     * @param userId User ID for personalization
     * @param sessionId Session ID (REQUIRED - must have active session)
     * @return Map with success status and SOQL data
     */
    @AuraEnabled
    public static Map<String, Object> generateSoql(
        String baseUrl,
        String userQuery,
        String workspace,
        List<String> selectedObjects,
        Map<String, List<String>> selectedFields,
        String fieldRationale,
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/soql';
            
            // Build request body - SOQL Agent only receives immediate previous agent's rationale
            Map<String, Object> requestBody = new Map<String, Object>{
                'user_query' => userQuery,
                'workspace' => workspace,
                'confirmed_objects' => selectedObjects,
                'confirmed_fields' => selectedFields,
                'field_agent_rationale' => fieldRationale,  // Only immediate previous agent
                'user_id' => userId,
                'session_id' => sessionId  // Required!
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'SOQL generation failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Execute SOQL query and return results
     * @param soqlQuery The SOQL query to execute
     * @return Map with success status and query results
     */
    @AuraEnabled
    public static Map<String, Object> executeSoqlQuery(String soqlQuery) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            // Validate SOQL query
            if (String.isBlank(soqlQuery)) {
                result.put('success', false);
                result.put('error', 'SOQL query cannot be empty');
                return result;
            }
            
            // Execute query
            List<SObject> records = Database.query(soqlQuery);
            
            // Convert results to serializable format
            List<Map<String, Object>> resultData = new List<Map<String, Object>>();
            
            for (SObject record : records) {
                Map<String, Object> rowData = new Map<String, Object>();
                Map<String, Object> recordMap = record.getPopulatedFieldsAsMap();
                
                for (String fieldName : recordMap.keySet()) {
                    Object fieldValue = record.get(fieldName);
                    
                    // Handle different field types
                    if (fieldValue instanceof SObject) {
                        // Handle relationship fields (e.g., Account.Name)
                        SObject relatedRecord = (SObject)fieldValue;
                        Map<String, Object> relatedMap = relatedRecord.getPopulatedFieldsAsMap();
                        for (String relatedField : relatedMap.keySet()) {
                            String compositeKey = fieldName + '.' + relatedField;
                            rowData.put(compositeKey, relatedRecord.get(relatedField));
                        }
                    } else if (fieldValue instanceof DateTime) {
                        // Format DateTime fields
                        DateTime dt = (DateTime)fieldValue;
                        rowData.put(fieldName, dt.format('yyyy-MM-dd HH:mm:ss'));
                    } else if (fieldValue instanceof Date) {
                        // Format Date fields
                        Date d = (Date)fieldValue;
                        DateTime dt = DateTime.newInstance(d.year(), d.month(), d.day());
                        rowData.put(fieldName, dt.format('yyyy-MM-dd'));
                    } else {
                        // Regular fields
                        rowData.put(fieldName, fieldValue);
                    }
                }
                
                resultData.add(rowData);
            }
            
            result.put('success', true);
            result.put('data', JSON.serialize(resultData));
            result.put('recordCount', records.size());
            
        } catch (QueryException e) {
            result.put('success', false);
            result.put('error', 'Query error: ' + e.getMessage());
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', 'Execution error: ' + e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Regenerate object selection with user feedback (stores in RAG)
     * @param baseUrl Base URL of the API server
     * @param userQuery Original user query
     * @param workspace Workspace name
     * @param previousResult Previous object agent output
     * @param userFeedback User's textual feedback (optional)
     * @param userId User identifier
     * @param sessionId Session ID
     * @return Map with success status and regenerated objects
     */
    @AuraEnabled
    public static Map<String, Object> regenerateObjects(
        String baseUrl,
        String userQuery,
        String workspace,
        Map<String, Object> previousResult,
        String userFeedback,
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/objects/regenerate';
            
            // Build request body per API v3.0 spec
            Map<String, Object> requestBody = new Map<String, Object>{
                'stage' => 'objects',
                'user_query' => userQuery,
                'workspace' => workspace,
                'previous_result' => previousResult,
                'user_feedback' => userFeedback,
                'user_edits' => null,
                'user_id' => userId,
                'session_id' => sessionId,
                'previous_agents_context' => new Map<String, Object>()
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Object regeneration failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Regenerate field selection with user feedback (stores in RAG)
     * @param baseUrl Base URL of the API server
     * @param userQuery Original user query
     * @param workspace Workspace name
     * @param selectedObjects Confirmed objects
     * @param intentRationale Intent agent rationale
     * @param objectRationale Object agent rationale
     * @param previousResult Previous field agent output
     * @param userFeedback User's textual feedback (optional)
     * @param userId User identifier
     * @param sessionId Session ID
     * @return Map with success status and regenerated fields
     */
    @AuraEnabled
    public static Map<String, Object> regenerateFields(
        String baseUrl,
        String userQuery,
        String workspace,
        List<String> selectedObjects,
        String intentRationale,
        String objectRationale,
        Map<String, Object> previousResult,
        String userFeedback,
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/fields/regenerate';
            
            // Build request body per API v3.0 spec
            Map<String, Object> requestBody = new Map<String, Object>{
                'stage' => 'fields',
                'user_query' => userQuery,
                'workspace' => workspace,
                'previous_result' => previousResult,
                'user_feedback' => userFeedback,
                'user_edits' => null,
                'user_id' => userId,
                'session_id' => sessionId,
                'previous_agents_context' => new Map<String, Object>{
                    'confirmed_objects' => selectedObjects,
                    'intent_agent_rationale' => intentRationale,
                    'object_agent_rationale' => objectRationale
                }
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Field regeneration failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description Regenerate SOQL query with user feedback (stores in RAG)
     * @param baseUrl Base URL of the API server
     * @param userQuery Original user query
     * @param workspace Workspace name
     * @param selectedObjects Confirmed objects
     * @param intentRationale Intent agent rationale
     * @param objectRationale Object agent rationale
     * @param selectedFields Confirmed fields
     * @param fieldRationale Field agent rationale
     * @param previousResult Previous SOQL agent output
     * @param userFeedback User's textual feedback (optional)
     * @param userId User identifier
     * @param sessionId Session ID
     * @return Map with success status and regenerated SOQL
     */
    @AuraEnabled
    public static Map<String, Object> regenerateSoql(
        String baseUrl,
        String userQuery,
        String workspace,
        List<String> selectedObjects,
        String intentRationale,
        String objectRationale,
        Map<String, List<String>> selectedFields,
        String fieldRationale,
        Map<String, Object> previousResult,
        String userFeedback,
        String userId,
        String sessionId
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/agents/soql/regenerate';
            
            // Build request body per API v3.0 spec
            Map<String, Object> requestBody = new Map<String, Object>{
                'stage' => 'soql',
                'user_query' => userQuery,
                'workspace' => workspace,
                'previous_result' => previousResult,
                'user_feedback' => userFeedback,
                'user_edits' => null,
                'user_id' => userId,
                'session_id' => sessionId,
                'previous_agents_context' => new Map<String, Object>{
                    'confirmed_objects' => selectedObjects,
                    'confirmed_fields' => selectedFields,
                    'intent_agent_rationale' => intentRationale,
                    'object_agent_rationale' => objectRationale,
                    'field_agent_rationale' => fieldRationale
                }
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(30000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'SOQL regeneration failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
    
    /**
     * @description End session and cleanup resources
     * @param baseUrl Base URL of the API server
     * @param sessionId Session ID to complete
     * @return Map with success status and completion message
     */
    @AuraEnabled
    public static Map<String, Object> endSession(String baseUrl, String sessionId) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            String endpoint = baseUrl + '/api/v1/session/complete';
            
            Map<String, Object> requestBody = new Map<String, Object>{
                'session_id' => sessionId
            };
            
            HttpRequest req = new HttpRequest();
            req.setEndpoint(endpoint);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setBody(JSON.serialize(requestBody));
            req.setTimeout(10000);
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() == 200) {
                result.put('success', true);
                result.put('data', res.getBody());
            } else {
                result.put('success', false);
                result.put('error', 'Session completion failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            result.put('success', false);
            result.put('error', e.getMessage());
        }
        
        return result;
    }
}