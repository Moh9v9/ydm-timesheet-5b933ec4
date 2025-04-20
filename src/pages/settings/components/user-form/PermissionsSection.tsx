
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/lib/types";

interface PermissionsSectionProps {
  role: UserRole;
  permissions: {
    employees: {
      view: boolean;
      edit: boolean;
      delete: boolean;
    };
    attendees: {
      view: boolean;
      edit: boolean;
    };
    export: boolean;
  };
  onPermissionChange: (section: 'employees' | 'attendees', permission: string) => void;
  onExportToggle: () => void;
}

export const PermissionsSection = ({
  role,
  permissions,
  onPermissionChange,
  onExportToggle,
}: PermissionsSectionProps) => {
  if (role === "admin") {
    return (
      <div className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 p-3 rounded-md text-sm">
        Admin users automatically have full permissions
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Employee Permissions</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="emp-view">View Employee List</Label>
            <Switch
              id="emp-view"
              checked={permissions.employees.view}
              onCheckedChange={() => onPermissionChange('employees', 'view')}
            />
          </div>
          
          {permissions.employees.view && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="emp-edit">Edit Employees</Label>
                <Switch
                  id="emp-edit"
                  checked={permissions.employees.edit}
                  onCheckedChange={() => onPermissionChange('employees', 'edit')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="emp-delete">Delete Employees</Label>
                <Switch
                  id="emp-delete"
                  checked={permissions.employees.delete}
                  onCheckedChange={() => onPermissionChange('employees', 'delete')}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Attendance Permissions</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="att-view">View Attendance</Label>
            <Switch
              id="att-view"
              checked={permissions.attendees.view}
              onCheckedChange={() => onPermissionChange('attendees', 'view')}
            />
          </div>
          
          {permissions.attendees.view && (
            <div className="flex items-center justify-between">
              <Label htmlFor="att-edit">Edit Attendance</Label>
              <Switch
                id="att-edit"
                checked={permissions.attendees.edit}
                onCheckedChange={() => onPermissionChange('attendees', 'edit')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Report Permissions</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="export-toggle">Allow Export Reports</Label>
          <Switch
            id="export-toggle"
            checked={permissions.export}
            onCheckedChange={onExportToggle}
          />
        </div>
      </div>
    </div>
  );
};
