public class NiteshController {
    
    // Method to create a new Nitesh Object record
    @AuraEnabled
    public static NiteshObject__c createNiteshObject(String fieldValue) {
        try {
            // Added validation for empty field value
            if (String.isBlank(fieldValue)) {
                throw new IllegalArgumentException('NiteshField value cannot be empty');
            }
            
            NiteshObject__c newRecord = new NiteshObject__c();
            newRecord.Name = 'Nitesh Record - ' + DateTime.now().format();
            newRecord.NiteshField__c = fieldValue;
            
            insert newRecord;
            return newRecord;
        } catch (Exception e) {
            System.debug('Error creating Nitesh Object: ' + e.getMessage());
            throw e;
        }
    }
    
    // Method to get all Nitesh Object records
    @AuraEnabled(cacheable=true)
    public static List<NiteshObject__c> getAllNiteshObjects() {
        try {
            return [SELECT Id, Name, NiteshField__c, CreatedDate 
                   FROM NiteshObject__c 
                   ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            System.debug('Error fetching Nitesh Objects: ' + e.getMessage());
            throw e;
        }
    }
    
    // Method to update Nitesh Field value
    @AuraEnabled
    public static NiteshObject__c updateNiteshField(Id recordId, String newValue) {
        try {
            NiteshObject__c record = [SELECT Id, NiteshField__c FROM NiteshObject__c WHERE Id = :recordId LIMIT 1];
            record.NiteshField__c = newValue;
            
            update record;
            return record;
        } catch (Exception e) {
            System.debug('Error updating Nitesh Object: ' + e.getMessage());
            throw e;
        }
    }
    
    // Method to delete a Nitesh Object record
    @AuraEnabled
    public static Boolean deleteNiteshObject(Id recordId) {
        try {
            NiteshObject__c record = [SELECT Id FROM NiteshObject__c WHERE Id = :recordId LIMIT 1];
            delete record;
            return true;
        } catch (Exception e) {
            System.debug('Error deleting Nitesh Object: ' + e.getMessage());
            return false;
        }
    }
    
    // Method to search Nitesh Objects by field value
    @AuraEnabled(cacheable=true)
    public static List<NiteshObject__c> searchByNiteshField(String searchValue) {
        try {
            String searchPattern = '%' + searchValue + '%';
            return [SELECT Id, Name, NiteshField__c, CreatedDate 
                   FROM NiteshObject__c 
                   WHERE NiteshField__c LIKE :searchPattern 
                   ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            System.debug('Error searching Nitesh Objects: ' + e.getMessage());
            throw e;
        }
    }
    
    // Method: Get count of all Nitesh Object records
    @AuraEnabled(cacheable=true)
    public static Integer getNiteshObjectCount() {
        try {
            return [SELECT COUNT() FROM NiteshObject__c];
        } catch (Exception e) {
            System.debug('Error getting Nitesh Object count: ' + e.getMessage());
            return 0;
        }
    }
}