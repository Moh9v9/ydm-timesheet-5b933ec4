
interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const FormActions = ({ onCancel, isSubmitting, isEditMode }: FormActionsProps) => {
  return (
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
          ? isEditMode
            ? "Updating..."
            : "Adding..."
          : isEditMode
          ? "Update"
          : "Add"}
      </button>
    </div>
  );
};
