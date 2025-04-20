
import { useState } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";

export const useEmployeeActions = () => {
  const { success, error: showError } = useNotification();
  const { deleteEmployee, refreshEmployees } = useEmployees();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleRefresh = () => {
    refreshEmployees();
    success("Employee data refreshed");
  };

  const handleAddNew = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

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

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    refreshEmployees();
  };

  // Filter function
  const filterEmployeesBySearch = (employees: Employee[], term: string) => {
    return employees.filter(employee => 
      employee.fullName.toLowerCase().includes(term.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(term.toLowerCase()) ||
      employee.project.toLowerCase().includes(term.toLowerCase()) ||
      employee.location.toLowerCase().includes(term.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(term.toLowerCase())
    );
  };

  return {
    // State
    searchTerm,
    showFilters,
    isModalOpen,
    currentEmployee,
    deleteDialogOpen,
    employeeToDelete,
    
    // Setters
    setSearchTerm,
    setShowFilters,
    
    // Handlers
    handleRefresh,
    handleAddNew,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    closeModal,
    filterEmployeesBySearch
  };
};
