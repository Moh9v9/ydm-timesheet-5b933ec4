
import { useState } from "react";
import { User, UserRole } from "@/lib/types";

export const useUserForm = (currentUser: User | null) => {
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
      if (permission === 'view') {
        const newViewValue = !formData.permissions.employees.view;
        newPermissions.employees.view = newViewValue;
        
        if (!newViewValue) {
          newPermissions.employees.edit = false;
          newPermissions.employees.delete = false;
          newPermissions.attendees.view = false;
          newPermissions.attendees.edit = false;
        }
      } else {
        newPermissions.employees = {
          ...newPermissions.employees,
          [permission]: !newPermissions.employees[permission as keyof typeof newPermissions.employees],
        };
      }
    } else if (section === 'attendees') {
      if (permission === 'view') {
        const newViewValue = !formData.permissions.attendees.view;
        
        if (newViewValue) {
          newPermissions.employees.view = true;
          newPermissions.attendees.view = true;
        } else {
          newPermissions.attendees.view = false;
          newPermissions.attendees.edit = false;
        }
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

  return {
    formData,
    handleInputChange,
    handlePermissionChange,
    handleExportToggle
  };
};
