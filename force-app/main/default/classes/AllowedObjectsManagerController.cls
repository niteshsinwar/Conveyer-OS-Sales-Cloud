public with sharing class AllowedObjectsManagerController {

    // Inner class to structure data for LWC
    public class AllowedObjectWrapper {
        @AuraEnabled public Id recordId;
        @AuraEnabled public String objectApiName; // SObject API Name (from Allowed_Objects__c.Name)
        @AuraEnabled public String allowedFieldsApiNames; // Comma-separated
        @AuraEnabled public String description;
        @AuraEnabled public Boolean isActive;
        @AuraEnabled public String technicalNotes;

        public AllowedObjectWrapper() {
            // Empty constructor required for JSON deserialization
            this.isActive = false; // Default to false if not specified in payload
        }

        public AllowedObjectWrapper(Allowed_Objects__c obj) {
            this.recordId = obj.Id;
            this.objectApiName = obj.Name; // Using the standard Name field
            this.allowedFieldsApiNames = obj.Allowed_Fields_API_Names__c;
            this.description = obj.Description__c;
            this.isActive = obj.Is_Active__c;
            this.technicalNotes = obj.Technical_Notes__c;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<AllowedObjectWrapper> getAllAllowedObjectConfigs() {
        List<AllowedObjectWrapper> wrappers = new List<AllowedObjectWrapper>();
        try {
            for (Allowed_Objects__c config : [
                SELECT Id, Name, Allowed_Fields_API_Names__c, Description__c, Is_Active__c, Technical_Notes__c
                FROM Allowed_Objects__c
                ORDER BY Name ASC
            ]) {
                wrappers.add(new AllowedObjectWrapper(config));
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching allowed object configurations: ' + e.getMessage());
        }
        return wrappers;
    }

    // This method seems intended for a different use case (e.g., Python script)
    // It returns SObjects directly. Consider if this is still needed or how it's used.
    @AuraEnabled(cacheable=true)
    public static List<Allowed_Objects__c> getActiveAllowedObjectsForPython() {
        try {
            return [
                SELECT Name, Allowed_Fields_API_Names__c, Description__c
                FROM Allowed_Objects__c
                WHERE Is_Active__c = TRUE
                WITH SECURITY_ENFORCED
                ORDER BY Name ASC
            ];
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'Error in getActiveAllowedObjectsForPython: ' + e.getMessage());
            throw new AuraHandledException('Error fetching active configurations for Python: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getSObjectOptions() {
        List<Map<String, String>> objectOptions = new List<Map<String, String>>();
        Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();

        for (String sObjectNameKey : globalDescribe.keySet()) {
            Schema.SObjectType sObjectType = globalDescribe.get(sObjectNameKey);
            if (sObjectType == null) continue;
            Schema.DescribeSObjectResult sObjectDescribe = sObjectType.getDescribe();

            if (sObjectDescribe.isQueryable() && sObjectDescribe.isAccessible() &&
                sObjectDescribe.isCreateable() && sObjectDescribe.isUpdateable() && // Ensure we can work with it
                (sObjectNameKey.endsWith('__c') || // Custom Objects
                 (!sObjectNameKey.endsWith('__ChangeEvent') &&
                  !sObjectNameKey.endsWith('__History') &&
                  !sObjectNameKey.endsWith('__Share') &&
                  !sObjectNameKey.endsWith('__Feed') &&
                  !sObjectNameKey.endsWith('Tag') &&
                  !sObjectNameKey.endsWith('__StandardOutboundChannel') &&
                  !sObjectNameKey.endsWith('__mdt') && // Exclude Custom Metadata Types
                  !sObjectDescribe.isCustomSetting() // Exclude Custom Settings
                 )
                )
            ) {
                objectOptions.add(new Map<String, String>{
                    'label' => sObjectDescribe.getLabel() + ' (' + sObjectNameKey + ')',
                    'value' => sObjectNameKey
                });
            }
        }
        // Sort by label for better UX
       
        return objectOptions;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getFieldOptions(String objectApiName) {
        List<Map<String, String>> fieldOptions = new List<Map<String, String>>();
        if (String.isBlank(objectApiName)) {
            return fieldOptions;
        }

        try {
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
            Schema.SObjectType sObjectType = globalDescribe.get(objectApiName);
            if (sObjectType == null) {
                throw new AuraHandledException('Object not found: ' + objectApiName);
            }

            Schema.DescribeSObjectResult sObjectDescribe = sObjectType.getDescribe();
            Map<String, Schema.SObjectField> fieldMap = sObjectDescribe.fields.getMap();

            for (String fieldNameKey : fieldMap.keySet()) {
                Schema.DescribeFieldResult fieldDescribe = fieldMap.get(fieldNameKey).getDescribe();
                // Include fields that are accessible and filterable/creatable/updateable as a general guide
                // Nillable is also a good filter for fields you might want to write to.
                if (fieldDescribe.isAccessible() && !fieldDescribe.isCalculated() &&
                    (fieldDescribe.isCreateable() || fieldDescribe.isUpdateable() || fieldDescribe.isFilterable())) {
                    fieldOptions.add(new Map<String, String>{
                        'label' => fieldDescribe.getLabel() + ' (' + fieldNameKey + ')',
                        'value' => fieldNameKey
                    });
                }
            }
            // Sort by label for better UX
           
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'Error fetching fields for ' + objectApiName + ': ' + e.getMessage() + e.getStackTraceString());
            throw new AuraHandledException('Error fetching fields for ' + objectApiName + ': ' + e.getMessage());
        }
        return fieldOptions;
    }

  // In AllowedObjectsManagerController.cls
@AuraEnabled
public static Id saveAllowedObjectConfig(AllowedObjectWrapper configData) {
    // --- Enhanced Entry Logging ---
    if (configData == null) {
        System.debug(LoggingLevel.ERROR, 'APEX_SAVE_ERROR: saveAllowedObjectConfig received a NULL configData object itself.');
        throw new AuraHandledException('Configuration data received was null at the entry of Apex save method.');
    } else {
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY: configData.recordId = ' + configData.recordId);
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY: configData.objectApiName = ' + configData.objectApiName);
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY: configData.allowedFieldsApiNames = ' + configData.allowedFieldsApiNames);
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY: configData.isActive = ' + configData.isActive); // This is a Boolean object, can be null
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY: configData.description = ' + configData.description);
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY: configData.technicalNotes = ' + configData.technicalNotes);
        try {
            System.debug(LoggingLevel.INFO, 'APEX_SAVE_ENTRY_JSON: Full Received configData for save: ' + JSON.serializePretty(configData));
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'APEX_SAVE_ENTRY_JSON_ERROR: Could not serialize configData. Error: ' + e.getMessage());
        }
    }
    // --- End of Enhanced Entry Logging ---

    // --- Validations ---
    if (String.isBlank(configData.objectApiName)) {
        System.debug(LoggingLevel.WARN, 'APEX_SAVE_VALIDATION_FAIL: objectApiName is blank. Value: [' + configData.objectApiName + ']');
        throw new AuraHandledException('Object API Name is required.');
    }
    if (String.isBlank(configData.allowedFieldsApiNames)) {
        System.debug(LoggingLevel.WARN, 'APEX_SAVE_VALIDATION_FAIL: allowedFieldsApiNames is blank. Value: [' + configData.allowedFieldsApiNames + ']');
        throw new AuraHandledException('Allowed Fields API Names are required.');
    }
    // (Add other server-side validations as needed)

    // --- Logic to Create/Update SObject ---
    Allowed_Objects__c conf;
    // ... (rest of your existing save logic from the previous "good" version for querying/creating `conf`)
    // Ensure you handle nulls from configData when assigning to conf fields, e.g.:
    // conf.Name = configData.objectApiName.trim(); // Assumes objectApiName is not blank due to validation
    // conf.Allowed_Fields_API_Names__c = configData.allowedFieldsApiNames.trim(); // Assumes not blank
    // conf.Description__c = configData.description; // String, can be null or empty
    // conf.Is_Active__c = configData.isActive != null ? configData.isActive : false; // Default to false if null
    // conf.Technical_Notes__c = configData.technicalNotes;

    // Make sure your existing upsert logic handles these fields correctly.
    // For example:
    if (String.isNotBlank(configData.recordId)) {
        // Update
        List<Allowed_Objects__c> existingConfigs = [SELECT Id FROM Allowed_Objects__c WHERE Id = :configData.recordId WITH SECURITY_ENFORCED LIMIT 1];
        if(existingConfigs.isEmpty()){ throw new AuraHandledException('Config not found for update.'); }
        conf = existingConfigs[0];
    } else {
        // Insert - check for duplicates by Name (objectApiName)
        List<Allowed_Objects__c> existing = [SELECT Id FROM Allowed_Objects__c WHERE Name = :configData.objectApiName.trim() WITH SECURITY_ENFORCED];
        if(!existing.isEmpty()){ throw new AuraHandledException('A configuration for ' + configData.objectApiName + ' already exists.'); }
        conf = new Allowed_Objects__c();
    }

    conf.Name = configData.objectApiName.trim();
    conf.Allowed_Fields_API_Names__c = configData.allowedFieldsApiNames.trim(); // Already validated not blank
    conf.Description__c = configData.description; // Can be null/empty
    conf.Is_Active__c = configData.isActive != null ? configData.isActive : false; // Default to false if null
    conf.Technical_Notes__c = configData.technicalNotes; // Can be null/empty


    System.debug(LoggingLevel.INFO, 'APEX_SAVE_UPSERT_ATTEMPT: Upserting conf: ' + JSON.serializePretty(conf));
    try {
        upsert conf;
        System.debug(LoggingLevel.INFO, 'APEX_SAVE_SUCCESS: Upsert successful. ID: ' + conf.Id);
        return conf.Id;
    } catch (DmlException e) {
        // ... (your existing DML error handling) ...
        System.debug(LoggingLevel.ERROR, 'APEX_SAVE_DML_ERROR: ' + e.getMessage());
        throw new AuraHandledException('DML Error: ' + e.getDmlMessage(0));
    }
    // ...
}

    @AuraEnabled
    public static void deleteAllowedObjectConfig(Id recordId) {
        if (String.isBlank(recordId)) {
            throw new AuraHandledException('Record ID is required for deletion.');
        }
        try {
            // Ensure the record exists before deleting
            Allowed_Objects__c confToDelete = [SELECT Id FROM Allowed_Objects__c WHERE Id = :recordId WITH SECURITY_ENFORCED LIMIT 1];
            if (confToDelete != null) {
                delete confToDelete;
            } else {
                throw new AuraHandledException('Configuration record not found for deletion.');
            }
        } catch (DmlException e) {
            System.debug(LoggingLevel.ERROR, 'DML Error deleting configuration: ' + e.getDmlMessage(0) + ' Stack: ' + e.getStackTraceString());
            throw new AuraHandledException('Error deleting configuration: ' + e.getDmlMessage(0));
        } catch (Exception e) { // Catch other exceptions like query exception if record not found by WITH SECURITY_ENFORCED
            System.debug(LoggingLevel.ERROR, 'Generic error deleting configuration: ' + e.getMessage() + ' Stack: ' + e.getStackTraceString());
            throw new AuraHandledException('Error deleting configuration: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true) // Make cacheable if data doesn't change frequently per user per objectApiName
    public static List<Map<String, Object>> fetchAllowedObjectRecords(String objectApiName) {
        if (String.isBlank(objectApiName)) {
            throw new AuraHandledException('Object API Name is required to fetch records.');
        }

        // Validate objectApiName against schema
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        if (!gd.containsKey(objectApiName) || !gd.get(objectApiName).getDescribe().isQueryable()) {
            throw new AuraHandledException('Invalid or non-queryable Object API Name: ' + objectApiName);
        }

        List<Allowed_Objects__c> allowedObjectsConfigs = [
            SELECT Name, Allowed_Fields_API_Names__c
            FROM Allowed_Objects__c
            WHERE Name = :objectApiName AND Is_Active__c = true
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];

        if (allowedObjectsConfigs.isEmpty()) {
            throw new AuraHandledException('No active configuration found for object: ' + objectApiName);
        }

        Allowed_Objects__c config = allowedObjectsConfigs[0];
        if (String.isBlank(config.Allowed_Fields_API_Names__c)) {
            throw new AuraHandledException('No fields configured for object: ' + objectApiName);
        }

        List<String> fieldApiNames = new List<String>();
        for(String field : config.Allowed_Fields_API_Names__c.split(',')){
            String trimmedField = field.trim();
            if(String.isNotBlank(trimmedField)){
                // Validate each field against schema (accessibility and existence)
                Schema.DescribeSObjectResult sObjectDescribe = gd.get(objectApiName).getDescribe();
                Map<String, Schema.SObjectField> fieldMap = sObjectDescribe.fields.getMap();
                if (!fieldMap.containsKey(trimmedField) || !fieldMap.get(trimmedField).getDescribe().isAccessible()) {
                     System.debug(LoggingLevel.WARN, 'Field ' + trimmedField + ' for object ' + objectApiName + ' is not accessible or does not exist. Skipping.');
                     continue; // Or throw error, depending on desired strictness
                }
                fieldApiNames.add(trimmedField);
            }
        }

        if (fieldApiNames.isEmpty()) {
            throw new AuraHandledException('No valid or accessible fields are configured for object: ' + objectApiName);
        }
        
        // Add Id field if not already included, as it's crucial for many operations and lightning-datatable keying
        if (!fieldApiNames.contains('Id')) {
            // Check if Id field is accessible (it always should be for queryable objects)
            Schema.DescribeSObjectResult sObjectDescribe = gd.get(objectApiName).getDescribe();
            Map<String, Schema.SObjectField> fieldMap = sObjectDescribe.fields.getMap();
            if(fieldMap.containsKey('Id') && fieldMap.get('Id').getDescribe().isAccessible()){
                 fieldApiNames.add(0, 'Id'); // Add Id to the beginning
            } else {
                // This case is highly unlikely for standard/custom objects
                System.debug(LoggingLevel.WARN, 'Id field not found or not accessible for object ' + objectApiName + '. This is unusual.');
            }
        }
        
        // Remove duplicates just in case 'Id' was already there
        Set<String> uniqueFieldNames = new Set<String>(fieldApiNames);
        String soqlQueryFields = String.join(new List<String>(uniqueFieldNames), ', ');


        String soqlQuery = 'SELECT ' + soqlQueryFields + ' FROM ' + objectApiName + ' WITH SECURITY_ENFORCED ORDER BY CreatedDate DESC LIMIT 200'; // Added ordering and limit

        List<Map<String, Object>> recordsData = new List<Map<String, Object>>();
        try {
            List<SObject> records = Database.query(soqlQuery);
            for (SObject record : records) {
                Map<String, Object> recordMap = new Map<String, Object>();
                for (String field : uniqueFieldNames) {
                    try {
                        recordMap.put(field, record.get(field));
                    } catch (Exception e) {
                        System.debug(LoggingLevel.WARN, 'Could not retrieve field ' + field + ' for record ' + record.Id + '. Error: ' + e.getMessage());
                        recordMap.put(field, null); // Put null if field somehow errors out (e.g. certain types of compound fields if not handled well)
                    }
                }
                recordsData.add(recordMap);
            }
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'Error querying records for ' + objectApiName + ': ' + e.getMessage() + ' Query: ' + soqlQuery + ' Stack: ' + e.getStackTraceString());
            throw new AuraHandledException('Error fetching records for ' + objectApiName + ': ' + e.getMessage());
        }
        return recordsData;
    }

    // This method is redundant if `WorkspaceAllowedObjectRecords` is robustly taking objectApiName
    // Keeping it if there's a specific reason to fetch by config ID, but it essentially does the same.
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> fetchRecordsByConfigId(Id allowedObjectId) {
        if (String.isBlank(allowedObjectId)) {
            throw new AuraHandledException('Allowed Object Configuration ID is required.');
        }
        
        try {
            Allowed_Objects__c config = [
                SELECT Name // Only need Name to pass to the other method
                FROM Allowed_Objects__c
                WHERE Id = :allowedObjectId
                AND Is_Active__c = true // Ensure config is active
                WITH SECURITY_ENFORCED
                LIMIT 1
            ];
            
            if (config == null) { // Query will throw error if not found, or list will be empty
                throw new AuraHandledException('No active configuration found with ID: ' + allowedObjectId);
            }
            
            return fetchAllowedObjectRecords(config.Name);
        } catch (Exception e) { // Catch query exception if record not found or other errors
            System.debug(LoggingLevel.ERROR, 'Error fetching records by config ID ' + allowedObjectId + ': ' + e.getMessage() + ' Stack: ' + e.getStackTraceString());
            throw new AuraHandledException('Error fetching records: ' + e.getMessage());
        }
    }
}