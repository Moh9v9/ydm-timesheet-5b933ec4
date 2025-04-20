
import { useState, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UserFormProps {
  currentUser: User | null;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const UserForm = ({ currentUser, onSubmit, onCancel, isSubmitting }: UserFormProps) => {
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    password: "",
    role: (currentUser?.role || "user") as UserRole,
    permissions: {
      employees: {
        view: currentUser?.permissions.employees?.view || false,
        edit: currentUser?.permissions.employees?.edit || false,
        delete: currentUser?.permissions.employees?.delete || false,
      },
      attendees: {
        view: currentUser?.permissions.attendees?.view || false,
        edit: currentUser?.permissions.attendees?.edit || false,
      },
      export: currentUser?.permissions.export || false,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "role") {
      const roleValue = value as UserRole;
      
      if (roleValue === "admin") {
        setFormData({
          ...formData,
          role: roleValue,
          permissions: {
            employees: { view: true, edit: true, delete: true },
            attendees: { view: true, edit: true },
            export: true,
          },
        });
      } else {
        setFormData({
          ...formData,
          role: roleValue,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePermissionChange = (section: 'employees' | 'attendees', permission: string) => {
    if (formData.role === "admin") return;

    let newPermissions = { ...formData.permissions };

    if (section === 'employees') {
      if (permission === 'view' && !formData.permissions.employees.view) {
        // When enabling employee view, no other changes needed
        newPermissions.employees.view = true;
      } else if (permission === 'view' && formData.permissions.employees.view) {
        // When disabling employee view, also disable attendees view and employee edit/delete
        newPermissions.employees = {
          view: false,
          edit: false,
          delete: false,
        };
        newPermissions.attendees.view = false;
      } else {
        // For edit and delete toggles
        newPermissions.employees = {
          ...newPermissions.employees,
          [permission]: !newPermissions.employees[permission as keyof typeof newPermissions.employees],
        };
      }
    } else if (section === 'attendees') {
      if (permission === 'view' && !formData.permissions.attendees.view) {
        // When enabling attendees view, ensure employees view is also enabled
        newPermissions.employees.view = true;
        newPermissions.attendees.view = true;
      } else if (permission === 'edit') {
        newPermissions.attendees.edit = !newPermissions.attendees.edit;
      }
    }

    setFormData({
      ...formData,
      permissions: newPermissions,
    });
  };

  const handleExportToggle = () => {
    if (formData.role === "admin") return;
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        export: !formData.permissions.export,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full p-2 border border-input rounded-md"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-input rounded-md"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="password">
            {currentUser ? "Password (leave blank to keep current)" : "Password *"}
          </Label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 border border-input rounded-md"
            required={!currentUser}
          />
        </div>

        <div>
          <Label htmlFor="role">Role *</Label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border border-input rounded-md"
            required
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Permissions Section */}
      {formData.role !== "admin" && (
        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Employee Permissions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="emp-view">View Employee List</Label>
                <Switch
                  id="emp-view"
                  checked={formData.permissions.employees.view}
                  onCheckedChange={() => handlePermissionChange('employees', 'view')}
                />
              </div>
              
              {formData.permissions.employees.view && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emp-edit">Edit Employees</Label>
                    <Switch
                      id="emp-edit"
                      checked={formData.permissions.employees.edit}
                      onCheckedChange={() => handlePermissionChange('employees', 'edit')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emp-delete">Delete Employees</Label>
                    <Switch
                      id="emp-delete"
                      checked={formData.permissions.employees.delete}
                      onCheckedChange={() => handlePermissionChange('employees', 'delete')}
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
                  checked={formData.permissions.attendees.view}
                  onCheckedChange={() => handlePermissionChange('attendees', 'view')}
                />
              </div>
              
              {formData.permissions.attendees.view && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="att-edit">Edit Attendance</Label>
                  <Switch
                    id="att-edit"
                    checked={formData.permissions.attendees.edit}
                    onCheckedChange={() => handlePermissionChange('attendees', 'edit')}
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
                checked={formData.permissions.export}
                onCheckedChange={handleExportToggle}
              />
            </div>
          </div>
        </div>
      )}

      {formData.role === "admin" && (
        <div className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 p-3 rounded-md text-sm">
          Admin users automatically have full permissions
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-input rounded-md"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? currentUser
              ? "Updating..."
              : "Adding..."
            : currentUser
            ? "Update"
            : "Add"}
        </button>
      </div>
    </form>
  );
};
