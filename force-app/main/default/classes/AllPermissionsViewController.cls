/**
 * @description Controller for the allPermissionsViewer LWC. Fetches and organizes
 * object-level permissions for Profiles and Permission Sets, with filtering logic
 * for Standard and Custom objects (currently hardcoded to include both).
 * Runs WITHOUT SHARING to bypass running user's restrictions on viewing setup objects.
 * WARNING: Synchronous fetching can still hit governor limits. Async recommended for production.
 * Includes extensive DEBUG logging.
 */
public without sharing class AllPermissionsViewController { // Runs in System Mode

    private static final String DEBUG_PREFIX = 'AllPermissionsViewController DEBUG: '; // Prefix for easier log filtering

    // --- Wrapper Class for LWC Datatable Rows ---
    public class ResultWrapper {
        @AuraEnabled public List<DatatableHeader> headers;
        @AuraEnabled public List<Map<String, Object>> rows;
        public ResultWrapper() {
            this.headers = new List<DatatableHeader>();
            this.rows = new List<Map<String, Object>>();
        }
    }

    // --- Wrapper Class for LWC Datatable Column Definitions ---
    public class DatatableHeader {
        @AuraEnabled public String label;
        @AuraEnabled public String fieldName;
        @AuraEnabled public String type = 'text';
        @AuraEnabled public Boolean sortable = true;
        @AuraEnabled public Boolean hideDefaultActions = true;
        @AuraEnabled public Map<String, Object> typeAttributes;

        public DatatableHeader(String label, String fieldName) {
            this.label = label;
            this.fieldName = fieldName;
            if(fieldName.startsWith('perm_')) {
                this.typeAttributes = new Map<String, Object>{'alignment' => 'center'};
            }
        }
    }

    /**
     * @description Main method called by LWC via @wire. Cannot accept dynamic parameters
     * from LWC in this configuration. Filtering logic is included but
     * currently hardcoded. Runs in system context (without sharing).
     * @return ResultWrapper Contains headers and rows for datatable.
     * @throws AuraHandledException If limits are hit or unexpected errors occur.
     */
    @AuraEnabled(cacheable=true)
    // *** NOTE: Signature kept parameter-less to maintain compatibility with current LWC @wire ***
    // public static ResultWrapper getPermissionsViewData(Boolean includeStandard, Boolean includeCustom) { // <--- How it WOULD look with parameters
    public static ResultWrapper getPermissionsViewData() {

        System.debug(DEBUG_PREFIX + 'getPermissionsViewData: START (running without sharing)');
        Long startTime = System.now().getTime();

        // *** Hardcoded filter values (since parameters cannot be passed from current LWC) ***
        // *** To enable dynamic filtering, modify the LWC to call this method imperatively ***
        // *** and uncomment/modify the method signature above to accept parameters. ***
        Boolean includeStandardObjects = false; // Defaulting to true
        Boolean includeCustomObjects = true;  // Defaulting to true
        System.debug(DEBUG_PREFIX + 'Object Filter Settings: includeStandardObjects=' + includeStandardObjects + ', includeCustomObjects=' + includeCustomObjects);


        // *** LIMITATION WARNING REMAINS ***
        ResultWrapper result = new ResultWrapper();
        Map<Id, String> parentIdToNameMap = new Map<Id, String>();
        Map<Id, String> parentIdToDynamicFieldName = new Map<Id, String>();
        List<Id> relevantParentIds = new List<Id>();
        List<DatatableHeader> dynamicHeaders = new List<DatatableHeader>();

        // --- 1. Get Relevant Profiles AND Permission Sets & Create Dynamic Headers ---
        System.debug(DEBUG_PREFIX + 'Step 1: Querying Profiles and Permission Sets...');
        Set<String> excludedProfileNames = new Set<String>{
            'Chatter Free User', 'Chatter External User', 'Chatter Moderator User',
            'Guest License User', 'Salesforce Platform User', 'Work.com User',
            'Salesforce API Only System Integrations', 'Identity User', 'Minimum Access - API Only Integrations',
            'Minimum Access - Salesforce', 'Platform Portal User', 'Partner App Subscription User',
            'High Volume Portal User', 'External Identity User', 'Customer Community User',
            'Customer Community Login User', 'Customer Community Plus User', 'Customer Community Plus Login User',
            'Partner Community User', 'Partner Community Login User'
        };
        System.debug(DEBUG_PREFIX + 'Excluded Profile Names Count: ' + excludedProfileNames.size());

        List<Profile> allProfiles;
        List<PermissionSet> allPermSets;
        try {
            // *** REMOVED LIMIT 3 FOR ACTUAL RUN ***
            allProfiles = [
                SELECT Id, Name FROM Profile
                WHERE Name NOT IN :excludedProfileNames
                ORDER BY Name
            ];
            System.debug(DEBUG_PREFIX + 'Found ' + allProfiles.size() + ' relevant profiles (after filters).');

            // *** REMOVED LIMIT 3 FOR ACTUAL RUN ***
            allPermSets = [
                SELECT Id, Label, Name FROM PermissionSet
                WHERE IsOwnedByProfile = false AND Type != 'System' AND Type != 'Session'
                ORDER BY Label
            ];
             System.debug(DEBUG_PREFIX + 'Found ' + allPermSets.size() + ' relevant permission sets (after filters).');

        } catch (Exception e) {
             System.debug(DEBUG_PREFIX + 'ERROR querying Profiles/Permission Sets: ' + e.getMessage() + ' Stack: ' + e.getStackTraceString());
             throw new AuraHandledException('Error loading Profiles/Permission Sets: ' + e.getMessage());
        }

        Integer dynamicColIndex = 0;
        System.debug(DEBUG_PREFIX + 'Processing Profiles to create headers...');
        for (Profile p : allProfiles) {
            String name = '[P] ' + p.Name;
            relevantParentIds.add(p.Id);
            parentIdToNameMap.put(p.Id, name);
            String fieldName = 'perm_' + dynamicColIndex++;
            dynamicHeaders.add(new DatatableHeader(name, fieldName));
            parentIdToDynamicFieldName.put(p.Id, fieldName);
        }
        System.debug(DEBUG_PREFIX + 'Processed ' + allProfiles.size() + ' Profiles.');

        System.debug(DEBUG_PREFIX + 'Processing Permission Sets to create headers...');
        for (PermissionSet ps : allPermSets) {
            if(!parentIdToNameMap.containsKey(ps.Id)){
                String name = '[PS] ' + ps.Label;
                 relevantParentIds.add(ps.Id);
                parentIdToNameMap.put(ps.Id, name);
                String fieldName = 'perm_' + dynamicColIndex++;
                dynamicHeaders.add(new DatatableHeader(name, fieldName));
                parentIdToDynamicFieldName.put(ps.Id, fieldName);
            } else {
                 System.debug(DEBUG_PREFIX + 'Skipped Permission Set already processed (ID conflict?): ' + ps.Id + ' Label: ' + ps.Label);
            }
        }
        System.debug(DEBUG_PREFIX + 'Processed ' + allPermSets.size() + ' Permission Sets.');
        System.debug(DEBUG_PREFIX + 'Total relevantParentIds count: ' + relevantParentIds.size());

        // --- Construct Final Header List ---
        System.debug(DEBUG_PREFIX + 'Constructing final headers list...');
        List<DatatableHeader> finalHeaders = new List<DatatableHeader>();
        finalHeaders.add(new DatatableHeader('Object Label', 'objectLabel'));
        finalHeaders.add(new DatatableHeader('Object API Name', 'objectApiName'));
        finalHeaders.add(new DatatableHeader('Permission Type', 'permissionType'));
        finalHeaders.addAll(dynamicHeaders);
        result.headers = finalHeaders;
        System.debug(DEBUG_PREFIX + 'Prepared ' + result.headers.size() + ' final headers total.');

        // --- 2. Get Relevant Objects (with Standard/Custom Filtering Logic) ---
        System.debug(DEBUG_PREFIX + 'Step 2: Getting relevant SObject information based on filters...');
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        System.debug(DEBUG_PREFIX + 'Global Describe contains ' + gd.size() + ' total SObject tokens.');
        List<String> relevantObjectApiNames = new List<String>();
        Map<String, String> objectApiNameToLabel = new Map<String, String>();
        Integer describeSkippedCount = 0;
        Integer filteredOutCount = 0;

        for (String apiName : gd.keySet()) {
             Schema.DescribeSObjectResult dsr = null;
             try{
                 dsr = gd.get(apiName)?.getDescribe();
                 if (dsr != null && dsr.isAccessible() && !dsr.isCustomSetting() && dsr.isQueryable() &&
                     !apiName.endsWith('ChangeEvent') && !apiName.endsWith('__e') &&
                     !apiName.endsWith('Share') && !apiName.endsWith('History') &&
                     !apiName.endsWith('Feed'))
                  {
                     // *** APPLY STANDARD/CUSTOM FILTERING LOGIC ***
                     Boolean isCustom = dsr.isCustom();
                     Boolean includeThisObject = false;

                     if (includeStandardObjects && !isCustom) {
                         includeThisObject = true;
                     }
                     if (includeCustomObjects && isCustom) {
                         includeThisObject = true;
                     }
                     // If neither flag is true, includeThisObject remains false.

                     if (includeThisObject) {
                         relevantObjectApiNames.add(apiName);
                         objectApiNameToLabel.put(apiName, dsr.getLabel());
                     } else {
                         filteredOutCount++;
                         // System.debug(DEBUG_PREFIX + 'Filtered out object ' + apiName + ': isCustom=' + isCustom); // Verbose
                     }
                     // **********************************************

                 } else {
                     describeSkippedCount++;
                 }
            } catch(Exception describeEx){
                 System.debug(DEBUG_PREFIX + 'Could not describe SObject: ' + apiName + '. Error: ' + describeEx.getMessage());
                 describeSkippedCount++;
            }
        }
        relevantObjectApiNames.sort();
        System.debug(DEBUG_PREFIX + 'Found ' + relevantObjectApiNames.size() + ' relevant SObject API Names after filtering. Skipped ' + describeSkippedCount + ' during describe. Filtered out ' + filteredOutCount + ' based on Standard/Custom flags.');


        // --- 3. Query Object Permissions ---
        System.debug(DEBUG_PREFIX + 'Step 3: Querying ObjectPermissions...');
        Map<String, Map<String, Map<Id, Boolean>>> permData = new Map<String, Map<String, Map<Id, Boolean>>>();

        if(relevantParentIds.isEmpty() || relevantObjectApiNames.isEmpty()){
             System.debug(DEBUG_PREFIX + 'No relevant Parent IDs or Object API Names found after filtering. Skipping ObjectPermissions query.');
        } else {
            System.debug(DEBUG_PREFIX + 'Querying ObjectPermissions for ' + relevantParentIds.size() + ' Parent IDs and ' + relevantObjectApiNames.size() + ' SObject Types.');
            Integer rowsProcessed = 0;
            // Integer queryLimit = 50000; // Example - Remove or adjust based on expected limits
            try {
                 System.debug(DEBUG_PREFIX + 'Executing ObjectPermissions SOQL Query...'); // Removed LIMIT for actual run
                for (ObjectPermissions op : [
                    SELECT ParentId, SobjectType,
                           PermissionsRead, PermissionsCreate, PermissionsEdit, PermissionsDelete,
                           PermissionsViewAllRecords, PermissionsModifyAllRecords
                    FROM ObjectPermissions
                    WHERE ParentId IN :relevantParentIds AND SobjectType IN :relevantObjectApiNames
                    // LIMIT :queryLimit // Consider adding a safety limit if needed
                ]) {
                     rowsProcessed++;
                    String sTypeApiName = String.valueOf(op.SObjectType);
                    if (!permData.containsKey(sTypeApiName)) {
                        permData.put(sTypeApiName, new Map<String, Map<Id, Boolean>>());
                    }
                    addPerm(permData.get(sTypeApiName), 'Read', op.ParentId, op.PermissionsRead);
                    addPerm(permData.get(sTypeApiName), 'Create', op.ParentId, op.PermissionsCreate);
                    addPerm(permData.get(sTypeApiName), 'Edit', op.ParentId, op.PermissionsEdit);
                    addPerm(permData.get(sTypeApiName), 'Delete', op.ParentId, op.PermissionsDelete);
                    addPerm(permData.get(sTypeApiName), 'View All', op.ParentId, op.PermissionsViewAllRecords);
                    addPerm(permData.get(sTypeApiName), 'Modify All', op.ParentId, op.PermissionsModifyAllRecords);
                }
                 System.debug(DEBUG_PREFIX + '*** ObjectPermissions Records Processed by Query: ' + rowsProcessed + ' ***');

            } catch (System.QueryException qe) {
                System.debug(DEBUG_PREFIX + 'LIMIT EXCEPTION querying ObjectPermissions. Error: ' + qe.getMessage() + ' Stack: ' + qe.getStackTraceString());
                throw new AuraHandledException('Failed to retrieve all permissions due to Salesforce limits (likely too many objects/profiles/permission sets). An asynchronous solution is required. Error: ' + qe.getMessage());
            } catch (Exception e) {
                 System.debug(DEBUG_PREFIX + 'ERROR processing ObjectPermissions query results: ' + e.getMessage() + ' Stack: ' + e.getStackTraceString());
                 throw new AuraHandledException('An unexpected error occurred while retrieving permissions: ' + e.getMessage());
            }
            System.debug(DEBUG_PREFIX + 'Size of permData map after processing query results: ' + permData.size());
        }


        // --- 4. Build Rows for LWC Datatable ---
        System.debug(DEBUG_PREFIX + 'Step 4: Building rows for LWC datatable...');
        Integer uniqueRowIdCounter = 0;
        List<String> objPermKeys = new List<String>{'Read', 'Create', 'Edit', 'Delete', 'View All', 'Modify All'};
        Integer rowsAdded = 0;

        // Iterate through the *filtered* list of objects
        for (String sObjApiName : relevantObjectApiNames) {
            Map<String, Map<Id, Boolean>> objectPermMap = permData.get(sObjApiName);
            String objectLabel = objectApiNameToLabel.get(sObjApiName);
            Boolean objectHasAnyPermData = objectPermMap != null && !objectPermMap.isEmpty();

            for (String permKey : objPermKeys) {
                 if(objectHasAnyPermData) {
                      Map<String, Object> row = new Map<String, Object>();
                      row.put('id', 'row_' + uniqueRowIdCounter++);
                      row.put('objectLabel', objectLabel);
                      row.put('objectApiName', sObjApiName);
                      row.put('permissionType', permKey);
                      row.put('sortKey', objectLabel + '_' + sObjApiName + '_' + getSortOrderForPermKey(permKey));

                      for (Id parentId : relevantParentIds) {
                           String dynamicFieldName = parentIdToDynamicFieldName.get(parentId);
                           Boolean hasAccess = objectPermMap?.get(permKey)?.get(parentId) == true;
                           row.put(dynamicFieldName, hasAccess ? 'Yes' : 'No');
                      }
                      result.rows.add(row);
                      rowsAdded++;
                 }
            }
        }
        System.debug(DEBUG_PREFIX + 'Finished building rows. Total rows added: ' + rowsAdded);

        // --- 5. Sort Rows ---
        System.debug(DEBUG_PREFIX + 'Step 5: Sorting ' + result.rows.size() + ' rows...');
        result.rows.sort(new MapComparator('sortKey'));
        System.debug(DEBUG_PREFIX + 'Sorting complete.');

        Long endTime = System.now().getTime();
        System.debug(DEBUG_PREFIX + 'Returning ' + result.rows.size() + ' rows and ' + result.headers.size() + ' columns.');
        System.debug(DEBUG_PREFIX + 'getPermissionsViewData: END. Duration: ' + (endTime - startTime) + 'ms');
        return result;
    }

    // --- Helper Methods ---
    private static void addPerm(Map<String, Map<Id, Boolean>> objectPermMap, String permKey, Id parentId, Boolean value) {
        if (!objectPermMap.containsKey(permKey)) {
            objectPermMap.put(permKey, new Map<Id, Boolean>());
        }
        objectPermMap.get(permKey).put(parentId, value == true);
    }

    private static Integer getSortOrderForPermKey(String permKey) {
        if(permKey == 'Read') return 1; if(permKey == 'Create') return 2; if(permKey == 'Edit') return 3;
        if(permKey == 'Delete') return 4; if(permKey == 'View All') return 5; if(permKey == 'Modify All') return 6;
        return 99;
    }

    // --- Comparator Inner Class ---
    public class MapComparator implements Comparator<Map<String, Object>> {
        private String sortField;
        public MapComparator(String field) { this.sortField = field; }
        public Integer compare(Map<String, Object> map1, Map<String, Object> map2) {
            Object val1Obj = map1.get(sortField); Object val2Obj = map2.get(sortField);
            String val1 = val1Obj != null ? String.valueOf(val1Obj) : '';
            String val2 = val2Obj != null ? String.valueOf(val2Obj) : '';
            return val1.compareTo(val2);
        }
    }
}