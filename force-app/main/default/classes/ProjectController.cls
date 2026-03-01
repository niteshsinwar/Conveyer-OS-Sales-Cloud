public with sharing class ProjectController {
    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjects() {
        // Include child tasks for roll‑up calculation in client
        return [
            SELECT 
                Id,
                Name,
                Status__c,
                Priority__c,
                StartDate__c,
                EndDate__c,
                (SELECT Id, Status__c FROM Tasks__r)
            FROM Project__c
            ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Project__c getProjectDetails(Id projectId) {
        return [
            SELECT 
                Id, 
                Name, 
                Status__c, 
                Priority__c, 
                StartDate__c, 
                EndDate__c, 
                Description__c,
                (SELECT Id, TaskName__c, AssignedTo__c, DueDate__c, Status__c, Notes__c 
                 FROM Tasks__r ORDER BY DueDate__c)
            FROM Project__c
            WHERE Id = :projectId
            LIMIT 1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProjectSummary() {
        return [
            SELECT Status__c status, COUNT(Id) recordCount
            FROM Project__c
            GROUP BY Status__c
        ];
    }
}