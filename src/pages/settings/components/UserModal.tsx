
import { User } from "@/lib/types";
import { UserForm } from "./UserForm";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useModernNotification } from "@/hooks/useModernNotification";

interface UserModalProps {
  isOpen: boolean;
  currentUser: User | null;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const UserModal = ({ isOpen, currentUser, onClose, onSubmit, isSubmitting }: UserModalProps) => {
  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {currentUser ? "Edit User" : "Add User"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>
        
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
