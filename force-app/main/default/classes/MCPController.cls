public class MCPController {
    
    // Method to create a new MCP Object record
    @AuraEnabled
    public static MCPObject__c createMCPObject(String fieldValue) {
        try {
            if (String.isBlank(fieldValue)) {
                throw new IllegalArgumentException('MCP Field value cannot be empty');
            }
            
            MCPObject__c newRecord = new MCPObject__c();
            newRecord.Name = 'MCP Record - ' + DateTime.now().format();
            // Note: MCPField__c may not be available yet due to deployment timing
            
            insert newRecord;
            return newRecord;
        } catch (Exception e) {
            System.debug('Error creating MCP Object: ' + e.getMessage());
            throw e;
        }
    }
    
    // Method to get all MCP Object records
    @AuraEnabled(cacheable=true)
    public static List<MCPObject__c> getAllMCPObjects() {
        try {
            return [SELECT Id, Name, CreatedDate 
                   FROM MCPObject__c 
                   ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            System.debug('Error fetching MCP Objects: ' + e.getMessage());
            throw e;
        }
    }
    
    // Method to delete an MCP Object record
    @AuraEnabled
    public static Boolean deleteMCPObject(Id recordId) {
        try {
            MCPObject__c record = [SELECT Id FROM MCPObject__c WHERE Id = :recordId LIMIT 1];
            delete record;
            return true;
        } catch (Exception e) {
            System.debug('Error deleting MCP Object: ' + e.getMessage());
            return false;
        }
    }
    
    // Method to get count of all MCP Object records
    @AuraEnabled(cacheable=true)
    public static Integer getMCPObjectCount() {
        try {
            return [SELECT COUNT() FROM MCPObject__c];
        } catch (Exception e) {
            System.debug('Error getting MCP Object count: ' + e.getMessage());
            return 0;
        }
    }
}