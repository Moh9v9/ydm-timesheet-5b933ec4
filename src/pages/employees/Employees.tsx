
import { useAuth } from "@/contexts/AuthContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { PageHeader } from "./components/header/PageHeader";
import { FiltersSection } from "./components/filters/FiltersSection";
import { ErrorMessage } from "./components/error/ErrorMessage";
import { EmployeesTable } from "./components/EmployeesTable";
import { useEmployeeActions } from "./hooks/useEmployeeActions";
import EmployeeModal from "./EmployeeModal";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

const Employees = () => {
  const { user } = useAuth();
  const { 
    filteredEmployees, 
    filters, 
    setFilters, 
    getUniqueValues,
    loading,
    error,
    refreshEmployees
  } = useEmployees();
  const { NotificationContainer } = useNotification();
  
  const {
    searchTerm,
    showFilters,
    isModalOpen,
    currentEmployee,
    deleteDialogOpen,
    setSearchTerm,
    setShowFilters,
    handleRefresh,
    handleAddNew,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    closeModal,
    filterEmployeesBySearch
  } = useEmployeeActions();
  
  const canEdit = user?.permissions.employees.edit;
  
  // Filter projects and other data for dropdowns
  const projects = getUniqueValues("project");
  const locations = getUniqueValues("location");
  const paymentTypes = ["Monthly", "Daily"];
  const sponsorshipTypes = ["YDM co", "YDM est", "Outside"];

  // Get employees filtered by search term
  const searchedEmployees = filterEmployeesBySearch(filteredEmployees, searchTerm);

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
          <ErrorMessage 
            message={error} 
            onRetry={refreshEmployees} 
          />
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
