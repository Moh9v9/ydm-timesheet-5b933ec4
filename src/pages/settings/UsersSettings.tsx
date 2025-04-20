
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { toast } from "@/components/ui/sonner";
import { Plus } from "lucide-react";
import { User } from "@/lib/types";
import { UserModal } from "./components/UserModal";
import { UsersTable } from "./components/UsersTable";

const UsersSettings = () => {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers();
  
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
      toast.success("User deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      toast.error(errorMessage);
    }
  };
  
  const handleSubmit = async (formData: any) => {
    // Validation
    if (!formData.fullName || !formData.email) {
      toast.error("Name and email are required");
      return;
    }
    
    if (!currentUser && !formData.password) {
      toast.error("Password is required for new users");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Form data being submitted:", formData);
      
      if (currentUser) {
        // Update existing user
        await updateUser(currentUser.id, {
          ...formData,
          password: formData.password || undefined
        });
        toast.success("User updated successfully");
      } else {
        // Create new user - with both full_name and fullName for trigger compatibility
        const userToAdd = {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: formData.role === "admin" ? {
            employees: {
              view: true,
              edit: true,
              delete: true
            },
            attendees: {
              view: true,
              edit: true
            },
            export: true
          } : formData.permissions
        };
        
        console.log("Creating user with data:", userToAdd);
        const result = await addUser(userToAdd);
        console.log("User creation result:", result);
        toast.success("User created successfully");
      }
      
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save user";
      console.error("Error in handleSubmit:", err);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
