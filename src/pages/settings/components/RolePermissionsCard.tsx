
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
          <span className="text-muted-foreground">View Permission:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.view ? "Yes" : "No"}
          </span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Edit Permission:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.edit ? "Yes" : "No"}
          </span>
        </div>
        
        <div>
          <span className="text-muted-foreground">Delete Permission:</span>
          <span className="ml-2 font-medium">
            {user?.permissions.delete ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsCard;
