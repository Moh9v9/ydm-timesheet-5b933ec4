
import { User } from "@/lib/types";
import { UserForm } from "./UserForm";

interface UserModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const UserModal = ({ isOpen, currentUser, onClose, onSubmit, isSubmitting }: UserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {currentUser ? "Edit User" : "Add User"}
        </h2>
        
        <UserForm
          currentUser={currentUser}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
