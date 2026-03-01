public with sharing class TaskController {

    @AuraEnabled(cacheable=true)
    public static List<Task__c> getRelatedTasks(Id projectId) {
        return [
            SELECT Id, TaskName__c, AssignedTo__c, DueDate__c, Status__c, Notes__c
            FROM Task__c
            WHERE Project__c = :projectId
        ];
    }

    @AuraEnabled
    public static Task__c createTask(Task__c task) {
        insert task;
        return task;
    }

    @AuraEnabled
    public static Task__c updateTask(Task__c task) {
        update task;
        return task;
    }

    @AuraEnabled
public static void deleteTask(Id taskId) {
    delete [SELECT Id FROM Task__c WHERE Id = :taskId];
}
}