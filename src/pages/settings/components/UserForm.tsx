
import { User } from "@/lib/types";
import { BasicInfoSection } from "./user-form/BasicInfoSection";
import { PermissionsSection } from "./user-form/PermissionsSection";
import { FormActions } from "./user-form/FormActions";
import { useUserForm } from "./user-form/useUserForm";

interface UserFormProps {
  currentUser: User | null;
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const UserForm = ({ currentUser, onSubmit, onCancel, isSubmitting }: UserFormProps) => {
  const { formData, handleInputChange, handlePermissionChange, handleExportToggle } = useUserForm(currentUser);

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
