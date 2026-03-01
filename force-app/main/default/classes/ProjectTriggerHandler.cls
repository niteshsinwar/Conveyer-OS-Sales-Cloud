public class ProjectTriggerHandler {
    // Guard to prevent recursive cascade
    private static Boolean isHandlingProjectStatus = false;

    /**
     * After-update handler: Cascades any Project.Status__c change down to child Tasks.
     * @param newProjects List of new Project__c records (Trigger.new)
     * @param oldMap      Map<Id,Project__c> of old values (Trigger.oldMap)
     */
    public static void handleProjectStatusUpdate(List<Project__c> newProjects, Map<Id, Project__c> oldMap) {
        if (isHandlingProjectStatus) return;
        isHandlingProjectStatus = true;

        // Identify only those projects whose Status__c actually changed
        Map<Id, String> projectsToCascade = new Map<Id, String>();
        for (Project__c proj : newProjects) {
            String oldStatus = oldMap.get(proj.Id).Status__c;
            String newStatus = proj.Status__c;
            if (oldStatus != newStatus) {
                projectsToCascade.put(proj.Id, newStatus);
            }
        }

        if (!projectsToCascade.isEmpty()) {
            // Query all child tasks whose status differs
            List<Task__c> tasksToUpdate = [
                SELECT Id, Status__c, Project__c
                FROM Task__c
                WHERE Project__c IN :projectsToCascade.keySet()
                  AND Status__c NOT IN :projectsToCascade.values()
            ];
            // Cascade the project status down
            for (Task__c t : tasksToUpdate) {
                // Only update if changed status value is not in progress
                if (projectsToCascade.get(t.Project__c) == 'In Progress') {
                    continue;
                }
                t.Status__c = projectsToCascade.get(t.Project__c);
            }
            if (!tasksToUpdate.isEmpty()) {
                update tasksToUpdate;
            }
        }

        isHandlingProjectStatus = false;
    }

    /**
     * After-delete handler: Remove all Tasks when their parent Project is deleted.
     * @param oldProjects List of old Project__c records (Trigger.old)
     */
    public static void handleProjectDeletion(List<Project__c> oldProjects) {
        Set<Id> projectIds = new Set<Id>();
        for (Project__c proj : oldProjects) {
            projectIds.add(proj.Id);
        }
        List<Task__c> tasksToDelete = [
            SELECT Id
            FROM Task__c
            WHERE Project__c IN :projectIds
        ];
        if (!tasksToDelete.isEmpty()) {
            delete tasksToDelete;
        }
    }
}