
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { useNotification } from "@/components/ui/notification";
import { Plus } from "lucide-react";
import { User } from "@/lib/types";
import { UserModal } from "./components/UserModal";
import { UsersTable } from "./components/UsersTable";

const UsersSettings = () => {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers();
  const { success, error, NotificationContainer } = useNotification();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleOpenModal = (user: User | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
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
  
  const handleSubmit = async (formData: any) => {
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
        await updateUser(currentUser.id, {
          ...formData,
          password: formData.password || undefined
        });
        success("User updated successfully");
      } else {
        // Create new user
        await addUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: formData.permissions
        });
        success("User created successfully");
      }
      
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save user";
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
      
      <UsersTable
        users={users}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        loading={loading}
      />
      
      <UserModal
        isOpen={isModalOpen}
        currentUser={currentUser}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default UsersSettings;
