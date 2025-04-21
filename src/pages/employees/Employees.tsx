
import { useEmployeePage } from "./hooks/useEmployeePage";
import { EmployeePageHeader } from "./components/EmployeePageHeader";
import { EmployeeFiltersContainer } from "./components/EmployeeFiltersContainer";
import { EmployeesTable } from "./components/EmployeesTable";
import EmployeeModal from "./EmployeeModal";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";

const Employees = () => {
  const {
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    isModalOpen,
    currentEmployee,
    deleteDialogOpen,
    searchedEmployees,
    loading,
    error,
    filterOptions,
    filters,
    handleFilterChange,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleEdit,
    handleAddNew,
    closeModal,
    handleRefresh
  } = useEmployeePage();

  return (
    <div className="space-y-6 animate-fade-in bg-background dark:bg-[#121418]">
      <EmployeePageHeader
        onRefresh={handleRefresh}
        onAddNew={handleAddNew}
        loading={loading}
      />
      
      <div className="bg-card dark:bg-gray-900/50 shadow-sm rounded-lg border dark:border-gray-800 overflow-hidden">
        <EmployeeFiltersContainer
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
            <p className="font-medium">Error loading employees</p>
            <p className="text-sm dark:text-red-400">{error}</p>
            <button 
              onClick={handleRefresh}
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
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
};

export default Employees;
