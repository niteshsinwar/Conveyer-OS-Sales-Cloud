public class TaskTriggerHandler {
    // Guard against recursion if Task updates fire Projects → Tasks cascade
    private static Boolean isHandlingTaskStatus = false;

    /**
     * After-insert / After-update handler: Roll up child Task statuses to parent Project.
     * @param newTasks List<Task__c> (Trigger.new)
     * @param oldMap   Map<Id,Task__c> (Trigger.oldMap) — used only for signature consistency
     */
    public static void handleTaskStatusChange(List<Task__c> newTasks, Map<Id, Task__c> oldMap) {
        if (isHandlingTaskStatus) return;
        isHandlingTaskStatus = true;

        Set<Id> projectIds = new Set<Id>();
        for (Task__c t : newTasks) {
            if (t.Project__c != null) {
                projectIds.add(t.Project__c);
            }
        }
        updateProjectStatus(projectIds);
        isHandlingTaskStatus = false;
    }

    /**
     * After-delete handler: Recompute status for Projects whose Tasks were deleted.
     * @param oldTasks List<Task__c> (Trigger.old)
     */
    public static void handleTaskDeletion(List<Task__c> oldTasks) {
        Set<Id> projectIds = new Set<Id>();
        for (Task__c t : oldTasks) {
            if (t.Project__c != null) {
                projectIds.add(t.Project__c);
            }
        }
        updateProjectStatus(projectIds);
    }

    // Helper to roll up Task statuses into each Project.Status__c
    private static void updateProjectStatus(Set<Id> projectIds) {
        if (projectIds.isEmpty()) return;

        List<Project__c> projectsToUpdate = new List<Project__c>();
        // Fetch each Project with its child Tasks
        for (Project__c proj : [
            SELECT Id, Status__c,
                   (SELECT Status__c FROM Tasks__r)
            FROM Project__c
            WHERE Id IN :projectIds
        ]) {
            List<Task__c> tasks = proj.Tasks__r;
            String newStatus;
            if (tasks.isEmpty()) {
                newStatus = 'Not Started';
            } else {
                Boolean allCompleted = true;
                Boolean hasInProgress = false;
                for (Task__c t : tasks) {
                    if (t.Status__c != 'Completed') {
                        allCompleted = false;
                    }
                    if (t.Status__c == 'In Progress') {
                        hasInProgress = true;
                    }
                }
                if (allCompleted) {
                    newStatus = 'Completed';
                } else if (hasInProgress) {
                    newStatus = 'In Progress';
                } else {
                    newStatus = 'Not Started';
                }
            }
            // Only update if status actually changed
            if (proj.Status__c != newStatus) {
                proj.Status__c = newStatus;
                projectsToUpdate.add(proj);
            }
        }

        if (!projectsToUpdate.isEmpty()) {
            update projectsToUpdate;
        }
    }
}