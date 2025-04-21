
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Employee } from "@/lib/types";
import { toast } from "sonner";

export const useEmployeePage = () => {
  const { 
    filteredEmployees, 
    filters, 
    setFilters, 
    deleteEmployee,
    getUniqueValues,
    loading,
    error,
    refreshEmployees
  } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  // Filter unique values for dropdowns
  const filterOptions = {
    projects: getUniqueValues("project"),
    locations: getUniqueValues("location"),
    paymentTypes: ["Monthly", "Daily"],
    sponsorshipTypes: ["YDM co", "YDM est", "Outside"]
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    console.log(`Filter changed: ${key} = ${value}`);
    
    if (value === "All") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
      console.log(`Removed ${key} filter, now using all ${key}s`);
    } else {
      setFilters({ ...filters, [key]: value });
      console.log(`Set ${key} filter to ${value}`);
    }
    
    console.log("Updated filters:", { ...filters, [key]: value === "All" ? undefined : value });
  };

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee(employeeToDelete);
        toast.success("Employee deleted successfully");
      } catch (err) {
        toast.error("Failed to delete employee");
        console.error(err);
      } finally {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
    refreshEmployees();
  };

  const handleRefresh = () => {
    refreshEmployees();
    toast.success("Employee data refreshed");
  };

  return {
    isModalOpen,
    currentEmployee,
    deleteDialogOpen,
    loading,
    error,
    filterOptions,
    filters,
    filteredEmployees,
    handleFilterChange,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleEdit,
    handleAddNew,
    closeModal,
    handleRefresh
  };
};
