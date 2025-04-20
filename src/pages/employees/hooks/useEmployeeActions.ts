
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { useEmployeeSearch } from "./useEmployeeSearch";
import { useEmployeeModal } from "./useEmployeeModal";
import { useEmployeeDelete } from "./useEmployeeDelete";

export const useEmployeeActions = () => {
  const { refreshEmployees } = useEmployees();
  const { success } = useNotification();
  
  const search = useEmployeeSearch();
  const modal = useEmployeeModal();
  const deleteActions = useEmployeeDelete();

  const handleRefresh = () => {
    refreshEmployees();
    success("Employee data refreshed");
  };

  return {
    // Search functionality
    searchTerm: search.searchTerm,
    showFilters: search.showFilters,
    setSearchTerm: search.setSearchTerm,
    setShowFilters: search.setShowFilters,
    filterEmployeesBySearch: search.filterEmployeesBySearch,
    
    // Modal functionality
    isModalOpen: modal.isModalOpen,
    currentEmployee: modal.currentEmployee,
    handleAddNew: modal.handleAddNew,
    handleEdit: modal.handleEdit,
    closeModal: modal.closeModal,
    
    // Delete functionality
    deleteDialogOpen: deleteActions.deleteDialogOpen,
    employeeToDelete: deleteActions.employeeToDelete,
    setDeleteDialogOpen: deleteActions.setDeleteDialogOpen,
    handleDeleteClick: deleteActions.handleDeleteClick,
    handleDeleteConfirm: deleteActions.handleDeleteConfirm,
    
    // Refresh functionality
    handleRefresh
  };
};
