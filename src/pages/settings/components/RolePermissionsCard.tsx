
import { useAuth } from "@/contexts/AuthContext";

const RolePermissionsCard = () => {
  const { user } = useAuth();

  return (
    <div className="mt-8 border rounded-md p-4">
      <h3 className="font-medium mb-3">Your Role & Permissions</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Role:</span>
          <span className="ml-2 font-medium capitalize">{user?.role}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground">View Employees:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.employees.view ? "Yes" : "No"}
          </span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Edit Employees:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.employees.edit ? "Yes" : "No"}
          </span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Delete Employees:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.employees.delete ? "Yes" : "No"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">View Attendance:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.attendees.view ? "Yes" : "No"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">Edit Attendance:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.attendees.edit ? "Yes" : "No"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground">Export Reports:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.export ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsCard;
