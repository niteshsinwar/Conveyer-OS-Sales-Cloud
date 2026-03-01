trigger TaskTrigger on Task__c (after insert, after update, after delete) {
    if (Trigger.isAfter) {
        if (Trigger.isInsert || Trigger.isUpdate) {
            TaskTriggerHandler.handleTaskStatusChange(Trigger.new, Trigger.oldMap);
        } else if (Trigger.isDelete) {
            TaskTriggerHandler.handleTaskDeletion(Trigger.old);
        }
    }
}