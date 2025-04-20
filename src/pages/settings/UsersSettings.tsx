
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { useNotification } from "@/components/ui/notification";
import { Plus, Edit, Trash2 } from "lucide-react";
import { User, UserRole } from "@/lib/types";

const UsersSettings = () => {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers();
  const { success, error, NotificationContainer } = useNotification();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as UserRole,
    permissions: {
      view: true,
      edit: false,
      delete: false,
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "user" as UserRole,
      permissions: {
        view: true,
        edit: false,
        delete: false,
      },
    });
  };
  
  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      // Edit mode
      setCurrentUser(user);
      setFormData({
        fullName: user.fullName,
        email: user.email,
        password: "", // Don't show existing password
        role: user.role,
        permissions: { ...user.permissions },
      });
    } else {
      // Add mode
      setCurrentUser(null);
      resetForm();
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    resetForm();
  };
  
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      await deleteUser(id);
      success("User deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      error(errorMessage);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "role") {
      // Fix the type error by explicitly casting the value to UserRole
      const roleValue = value as UserRole;
      
      // If role is set to admin, automatically set full permissions
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
    // Don't allow changing permissions if role is admin
    if (formData.role === "admin") {
      return;
    }
    
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
    
    // Validation
    if (!formData.fullName || !formData.email) {
      error("Name and email are required");
      return;
    }
    
    if (!currentUser && !formData.password) {
      error("Password is required for new users");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (currentUser) {
        // Update existing user
        const updateData: Partial<User> = {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          permissions: formData.role === "admin" 
            ? { view: true, edit: true, delete: true } // Ensure admin always has full permissions
            : formData.permissions,
        };
        
        // Only include password if it's provided
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await updateUser(currentUser.id, updateData);
        success("User updated successfully");
      } else {
        // Create new user
        const newUserData = {
          ...formData,
          // Ensure admin always has full permissions
          permissions: formData.role === "admin" 
            ? { view: true, edit: true, delete: true } 
            : formData.permissions,
        };
        
        await addUser(newUserData);
        success("User added successfully");
      }
      
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <NotificationContainer />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">User Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-3 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add User
        </button>
      </div>
      
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="capitalize">{user.role}</span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      {user.permissions.view && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900/50 dark:text-blue-300">
                          View
                        </span>
                      )}
                      {user.permissions.edit && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900/50 dark:text-green-300">
                          Edit
                        </span>
                      )}
                      {user.permissions.delete && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full dark:bg-red-900/50 dark:text-red-300">
                          Delete
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  {loading ? "Loading..." : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {currentUser ? "Edit User" : "Add User"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
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
              
              {/* Email */}
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
              
              {/* Password */}
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
              
              {/* Role */}
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
              
              {/* Permissions - Only show if role is not admin */}
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
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSettings;
