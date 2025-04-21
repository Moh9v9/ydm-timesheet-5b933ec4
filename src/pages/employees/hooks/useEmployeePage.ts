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
    
    const newFilters = { ...filters };
    
    // Handle "All" value specifically - we still want to keep it in the filters
    // so the UI shows the correct dropdown selection
    if (value === "All") {
      newFilters[key] = "All";
      setFilters(newFilters);
      console.log(`Set ${key} filter to All`);
    } else {
      // Set the specific filter value
      newFilters[key] = value;
      setFilters(newFilters);
      console.log(`Set ${key} filter to ${value}`);
    }
    
    // Log updated filters for debugging
    console.log("Updated filters:", newFilters);
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
