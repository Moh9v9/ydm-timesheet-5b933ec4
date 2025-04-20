
import { useState } from "react";
import { User, UserRole } from "@/lib/types";

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
      view: currentUser?.permissions.view || true,
      edit: currentUser?.permissions.edit || false,
      delete: currentUser?.permissions.delete || false,
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
            view: true,
            edit: true,
            delete: true,
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

  const handlePermissionChange = (permission: "view" | "edit" | "delete") => {
    if (formData.role === "admin") return;
    
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission],
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">
          Full Name *
        </label>
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
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address *
        </label>
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
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          {currentUser ? "Password (leave blank to keep current)" : "Password *"}
        </label>
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
        <label htmlFor="role" className="block text-sm font-medium mb-1">
          Role *
        </label>
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
      
      {formData.role !== "admin" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Permissions
          </label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="permissionView"
                checked={formData.permissions.view}
                onChange={() => handlePermissionChange("view")}
                className="mr-2"
              />
              <label htmlFor="permissionView" className="text-sm">
                View
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="permissionEdit"
                checked={formData.permissions.edit}
                onChange={() => handlePermissionChange("edit")}
                className="mr-2"
              />
              <label htmlFor="permissionEdit" className="text-sm">
                Edit
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="permissionDelete"
                checked={formData.permissions.delete}
                onChange={() => handlePermissionChange("delete")}
                className="mr-2"
              />
              <label htmlFor="permissionDelete" className="text-sm">
                Delete
              </label>
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
