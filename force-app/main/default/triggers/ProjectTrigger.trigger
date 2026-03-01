trigger ProjectTrigger on Project__c (after update, after delete) {
    if (Trigger.isAfter) {
        if (Trigger.isUpdate) {
            ProjectTriggerHandler.handleProjectStatusUpdate(Trigger.new, Trigger.oldMap);
        } else if (Trigger.isDelete) {
            ProjectTriggerHandler.handleProjectDeletion(Trigger.old);
        }
    }
}