public with sharing class ProjectTrackerUtility {
    
    /**
     * Updates project status based on task status changes
     * @param projectIds Set of Project IDs to check
     */
    public static void updateProjectStatusFromTasks(Set<Id> projectIds) {
        try {
            List<Project__c> projectsToUpdate = new List<Project__c>();
            
            // Get all tasks for the projects
            List<Task__c> allTasks = [
                SELECT Id, Status__c, Project__c 
                FROM Task__c 
                WHERE Project__c IN :projectIds
            ];
            
            // Group tasks by project
            Map<Id, List<Task__c>> projectTaskMap = new Map<Id, List<Task__c>>();
            for (Task__c task : allTasks) {
                if (!projectTaskMap.containsKey(task.Project__c)) {
                    projectTaskMap.put(task.Project__c, new List<Task__c>());
                }
                projectTaskMap.get(task.Project__c).add(task);
            }
            
            // Check each project
            List<Project__c> projects = [SELECT Id, Status__c FROM Project__c WHERE Id IN :projectIds];
            
            for (Project__c project : projects) {
                List<Task__c> projectTasks = projectTaskMap.get(project.Id);
                
                if (projectTasks == null || projectTasks.isEmpty()) {
                    continue; // Skip projects with no tasks
                }
                
                Boolean allTasksCompleted = true;
                for (Task__c task : projectTasks) {
                    if (task.Status__c != 'Completed') {
                        allTasksCompleted = false;
                        break;
                    }
                }
                
                // Update project status if all tasks are completed
                if (allTasksCompleted && project.Status__c != 'Completed') {
                    project.Status__c = 'Completed';
                    projectsToUpdate.add(project);
                }
            }
            
            if (!projectsToUpdate.isEmpty()) {
                update projectsToUpdate;
            }
            
        } catch (Exception e) {
            System.debug('Error in updateProjectStatusFromTasks: ' + e.getMessage());
        }
    }
    
    /**
     * Updates all task statuses when project is completed
     * @param projectIds Set of Project IDs that were marked as completed
     */
    public static void updateTaskStatusFromProject(Set<Id> projectIds) {
        try {
            List<Task__c> tasksToUpdate = [
                SELECT Id, Status__c, Project__c 
                FROM Task__c 
                WHERE Project__c IN :projectIds 
                AND Status__c != 'Completed'
            ];
            
            for (Task__c task : tasksToUpdate) {
                task.Status__c = 'Completed';
            }
            
            if (!tasksToUpdate.isEmpty()) {
                update tasksToUpdate;
            }
            
        } catch (Exception e) {
            System.debug('Error in updateTaskStatusFromProject: ' + e.getMessage());
        }
    }
    
    /**
     * Gets project summary data for reporting
     * @return Map of status to count
     */
    public static Map<String, Integer> getProjectSummaryByStatus() {
        try {
            Map<String, Integer> statusCounts = new Map<String, Integer>{
                'Planned' => 0,
                'In Progress' => 0,
                'On Hold' => 0,
                'Completed' => 0
            };
            
            List<AggregateResult> results = [
                SELECT Status__c, COUNT(Id) recordCount
                FROM Project__c
                GROUP BY Status__c
            ];
            
            for (AggregateResult result : results) {
                String status = (String) result.get('Status__c');
                Integer recordCount = (Integer) result.get('recordCount');
                statusCounts.put(status, recordCount);
            }
            
            return statusCounts;
        } catch (Exception e) {
            System.debug('Error in getProjectSummaryByStatus: ' + e.getMessage());
            return new Map<String, Integer>();
        }
    }
}