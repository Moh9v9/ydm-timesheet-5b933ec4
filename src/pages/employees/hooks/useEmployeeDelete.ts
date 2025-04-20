
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";

export const useEmployeeDelete = () => {
  const { deleteEmployee } = useEmployees();
  const { success, error: showError } = useNotification();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete);
        success("Employee deleted successfully");
      } catch (err) {
        showError("Failed to delete employee");
        console.error(err);
      } finally {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    employeeToDelete,
    handleDeleteClick,
    handleDeleteConfirm
  };
};
