public with sharing class Utility {
    
    // Method to recalculate project status based on task statuses
    public static String recalculateProjectStatus(List<Task__c> tasks) {
        if (tasks.isEmpty()) {
            return 'Planned'; // Default status if no tasks exist
        }
        
        Boolean allCompleted = true;
        Boolean anyInProgress = false;
        
        for (Task__c task : tasks) {
            if (task.Status__c != 'Completed') {
                allCompleted = false;
            }
            if (task.Status__c == 'In Progress') {
                anyInProgress = true;
            }
        }
        
        if (allCompleted) {
            return 'Completed';
        } else if (anyInProgress) {
            return 'In Progress';
        } else {
            return 'Not Started';
        }
    }

    // Method to validate task data
    public static Boolean validateTaskData(Task__c task) {
        if (String.isEmpty(task.TaskName__c) || task.AssignedTo__c == null || task.DueDate__c == null) {
            return false; // Validation fails if required fields are empty
        }
        return true; // Validation passes
    }
}