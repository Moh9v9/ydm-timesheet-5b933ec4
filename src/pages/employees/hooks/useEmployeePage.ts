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
    refreshEmployees,
  } = useEmployees();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const filterOptions = {
    projects: getUniqueValues("project"),
    locations: getUniqueValues("location"),
    paymentTypes: ["Monthly", "Daily"],
    sponsorshipTypes: ["YDM co", "YDM est", "Outside"],
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    console.log(`Filter changed: ${key} = ${value}`);

    if (value === "All") {
      if (key === "status") {
        setFilters({ ...filters, [key]: "All" });
      } else {
        const newFilters = { ...filters };
        delete newFilters[key];
        setFilters(newFilters);
      }
    } else {
      setFilters({ ...filters, [key]: value });
    }
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

  return {
    filteredEmployees,
    filterOptions,
    filters,
    loading,
    error,
    isModalOpen,
    currentEmployee,
    deleteDialogOpen,
    handleFilterChange,
    handleEdit,
    handleAddNew,
    closeModal,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
  };
};