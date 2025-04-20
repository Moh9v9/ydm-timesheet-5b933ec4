
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/components/ui/notification";
import { Plus, RefreshCw } from "lucide-react";
import { Employee, EmployeeFilters } from "@/lib/types";
import EmployeeModal from "./EmployeeModal";
import { EmployeeFiltersSection } from "./components/EmployeeFilters";
import { SearchBar } from "./components/SearchBar";
import { EmployeesTable } from "./components/EmployeesTable";

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
  
  const canEdit = user?.permissions.employees.edit;
  
  // Refresh data when component mounts
  useEffect(() => {
    refreshEmployees();
  }, []);
  
  // Filter unique values for dropdowns
  const projects = getUniqueValues("project");
  const locations = getUniqueValues("location");
  const paymentTypes = ["Monthly", "Daily"];
  const sponsorshipTypes = ["YDM co", "YDM est", "Outside"];
  
  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    if (value === "All") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    
    try {
      await deleteEmployee(id);
      success("Employee deleted successfully");
    } catch (err) {
      showError("Failed to delete employee");
      console.error(err);
    }
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
    // Refresh data after modal is closed
    refreshEmployees();
  };

  const handleRefresh = () => {
    refreshEmployees();
    success("Employee data refreshed");
  };

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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center dark:border-gray-800/50">
        <div>
          <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">Employees</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage your employees and their details
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-secondary text-secondary-foreground dark:bg-gray-800 dark:text-gray-200 rounded-md flex items-center hover:bg-secondary/90 dark:hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''} dark:text-gray-300`} />
            Refresh
          </button>
          
          {canEdit && (
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-primary text-white dark:bg-primary/80 dark:text-white rounded-md flex items-center hover:bg-primary/90 dark:hover:bg-primary/70 transition-colors"
            >
              <Plus size={16} className="mr-2 dark:text-gray-200" />
              Add Employee
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-card dark:bg-gray-900/50 shadow-sm rounded-lg border dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            
            <EmployeeFiltersSection
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              projects={projects}
              locations={locations}
              paymentTypes={paymentTypes}
              sponsorshipTypes={sponsorshipTypes}
            />
          </div>
        </div>
        
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
          onDelete={handleDelete}
        />
      </div>
      
      {isModalOpen && (
        <EmployeeModal
          employee={currentEmployee}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Employees;
