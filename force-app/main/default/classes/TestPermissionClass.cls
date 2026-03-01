public class TestPermissionClass {
    public static String checkPermissions() {
        return 'Testing if we can still create classes';
    }
    
    public static String getCreatedTime() {
        return 'Created at: ' + DateTime.now().format();
    }
}