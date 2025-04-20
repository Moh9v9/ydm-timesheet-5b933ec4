
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/components/ui/notification";
import { Employee } from "@/lib/types";
import { EmployeesTable } from "./components/EmployeesTable";
import { PageHeader } from "./components/header/PageHeader";
import { FiltersSection } from "./components/filters/FiltersSection";
import EmployeeModal from "./EmployeeModal";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

const Employees = () => {
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
  const { user } = useAuth();
  const { success, error: showError, NotificationContainer } = useNotification();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  
  const canEdit = user?.permissions.employees.edit;
  
  useEffect(() => {
    refreshEmployees();
  }, []);

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

  // Filter projects and other data for dropdowns
  const projects = getUniqueValues("project");
  const locations = getUniqueValues("location");
  const paymentTypes = ["Monthly", "Daily"];
  const sponsorshipTypes = ["YDM co", "YDM est", "Outside"];

  // Filter employees by search term
  const searchedEmployees = filteredEmployees.filter(employee => 
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in bg-background dark:bg-[#121418]">
      <NotificationContainer />
      
      <PageHeader
        onRefresh={handleRefresh}
        onAddNew={handleAddNew}
        loading={loading}
        canEdit={canEdit}
      />
      
      <div className="bg-card dark:bg-gray-900/50 shadow-sm rounded-lg border dark:border-gray-800 overflow-hidden">
        <FiltersSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          onFilterChange={(key, value) => {
            if (value === "All") {
              const newFilters = { ...filters };
              delete newFilters[key];
              setFilters(newFilters);
            } else {
              setFilters({ ...filters, [key]: value });
            }
          }}
          projects={projects}
          locations={locations}
          paymentTypes={paymentTypes}
          sponsorshipTypes={sponsorshipTypes}
        />
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
            <p className="font-medium">Error loading employees</p>
            <p className="text-sm dark:text-red-400">{error}</p>
            <button 
              onClick={refreshEmployees}
              className="mt-2 text-sm font-medium underline dark:text-red-300"
            >
              Try Again
            </button>
          </div>
        )}
        
        <EmployeesTable 
          employees={searchedEmployees}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>
      
      {isModalOpen && (
        <EmployeeModal
          employee={currentEmployee}
          onClose={closeModal}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
};

export default Employees;
