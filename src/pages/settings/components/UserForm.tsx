
import { useState } from "react";
import { User, UserRole } from "@/lib/types";
import { BasicInfoSection } from "./user-form/BasicInfoSection";
import { PermissionsSection } from "./user-form/PermissionsSection";
import { FormActions } from "./user-form/FormActions";

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
        newPermissions.employees.view = true;
      } else if (permission === 'view' && formData.permissions.employees.view) {
        newPermissions.employees = {
          view: false,
          edit: false,
          delete: false,
        };
        newPermissions.attendees.view = false;
      } else {
        newPermissions.employees = {
          ...newPermissions.employees,
          [permission]: !newPermissions.employees[permission as keyof typeof newPermissions.employees],
        };
      }
    } else if (section === 'attendees') {
      if (permission === 'view' && !formData.permissions.attendees.view) {
        newPermissions.employees.view = true;
        newPermissions.attendees.view = true;
      } else if (permission === 'edit') {
        newPermissions.attendees.edit = !newPermissions.attendees.edit;
      }
    }

    setFormData({ ...formData, permissions: newPermissions });
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
      <BasicInfoSection
        fullName={formData.fullName}
        email={formData.email}
        password={formData.password}
        role={formData.role}
        isEditMode={!!currentUser}
        onInputChange={handleInputChange}
      />

      <PermissionsSection
        role={formData.role}
        permissions={formData.permissions}
        onPermissionChange={handlePermissionChange}
        onExportToggle={handleExportToggle}
      />

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isEditMode={!!currentUser}
      />
    </form>
  );
};
