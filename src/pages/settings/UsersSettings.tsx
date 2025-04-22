
import { useState } from "react";
import { useUsers } from "@/contexts/UsersContext";
import { Plus } from "lucide-react";
import { User } from "@/lib/types";
import { UserModal } from "./components/UserModal";
import { UsersTable } from "./components/UsersTable";
import { Button } from "@/components/ui/button";
import { useModernNotification } from "@/hooks/useModernNotification";
import { useLanguage } from "@/contexts/LanguageContext";

const UsersSettings = () => {
  const { users, addUser, updateUser, deleteUser, loading } = useUsers();
  const { t } = useLanguage();

  const {
    showNotification,
    NotificationContainer,
  } = useModernNotification();
  
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
      showNotification("success", "User deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete user";
      showNotification("error", errorMessage);
      console.error("Delete user error details:", err);
    }
  };
  
  const handleSubmit = async (formData: any) => {
    // Validation
    if (!formData.fullName || !formData.email) {
      showNotification("error", "Name and email are required");
      return;
    }
    if (!currentUser && !formData.password) {
      showNotification("error", "Password is required for new users");
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
        showNotification("success", "User updated successfully");
        handleCloseModal();
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
        try {
          showNotification("info", "Creating user...");
          await addUser(userToAdd);
          showNotification("success", "User created successfully");
          handleCloseModal();
        } catch (addError: any) {
          const errorMsg = addError instanceof Error ? addError.message : 
            (typeof addError === 'string' ? addError : "Failed to create user");
          showNotification("error", errorMsg);
        }
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 
        (typeof err === 'string' ? err : "Failed to save user");
      showNotification("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* NotificationContainer at the top of this section so it shows above modals */}
      <NotificationContainer />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">{t('userManagement')}</h2>
        <Button
          onClick={() => handleOpenModal()}
          className="flex items-center"
          variant="default"
        >
          <Plus size={16} className="mr-2" />
          {t('addUser')}
        </Button>
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
