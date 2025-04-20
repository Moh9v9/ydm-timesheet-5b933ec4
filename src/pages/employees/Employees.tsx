import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/components/ui/notification";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { Employee, EmployeeFilters } from "@/lib/types";
import EmployeeModal from "./EmployeeModal";

const Employees = () => {
  const { 
    filteredEmployees, 
    filters, 
    setFilters, 
    deleteEmployee,
    getUniqueValues,
    loading
  } = useEmployees();
  const { user } = useAuth();
  const { success, error, NotificationContainer } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  
  const canEdit = user?.permissions.edit;
  const canDelete = user?.permissions.delete;
  
  // Filter unique values for dropdowns
  const projects = getUniqueValues("project");
  const locations = getUniqueValues("location");
  const paymentTypes = ["Monthly", "Daily"];
  const sponsorshipTypes = ["YDM co", "YDM est", "Outside"];
  
  const handleFilterChange = (key: keyof EmployeeFilters, value: string) => {
    if (value === "All") {
      // Remove the filter
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      // Set the filter
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
      error("Failed to delete employee");
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
    <div className="space-y-6 animate-fade-in">
      <NotificationContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">
            Manage your employees and their details
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddNew}
            className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Add Employee
          </button>
        )}
      </div>
      
      <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-input rounded-md"
              />
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center hover:bg-secondary/90 transition-colors"
            >
              <Filter size={16} className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  value={filters.project || "All"}
                  onChange={(e) => handleFilterChange("project", e.target.value)}
                  className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
                >
                  <option value="All">All Projects</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>
              
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  value={filters.location || "All"}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
                >
                  <option value="All">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              {/* Payment Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Payment Type</label>
                <select
                  value={filters.paymentType || "All"}
                  onChange={(e) => handleFilterChange("paymentType", e.target.value)}
                  className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
                >
                  <option value="All">All Types</option>
                  {paymentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Sponsorship Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Sponsorship</label>
                <select
                  value={filters.sponsorship || "All"}
                  onChange={(e) => handleFilterChange("sponsorship", e.target.value)}
                  className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
                >
                  <option value="All">All Sponsorships</option>
                  {sponsorshipTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={filters.status || "All"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
                >
                  <option value="Active">Active Only</option>
                  <option value="Archived">Archived Only</option>
                  <option value="All">All Status</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>ID</th>
                <th>Project</th>
                <th>Location</th>
                <th>Job Title</th>
                <th>Payment Type</th>
                <th>Rate</th>
                <th>Sponsorship</th>
                <th>Status</th>
                {(canEdit || canDelete) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {searchedEmployees.length > 0 ? (
                searchedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.fullName}</td>
                    <td>{employee.employeeId}</td>
                    <td>{employee.project}</td>
                    <td>{employee.location}</td>
                    <td>{employee.jobTitle}</td>
                    <td>{employee.paymentType}</td>
                    <td>{employee.rateOfPayment}</td>
                    <td>{employee.sponsorship}</td>
                    <td>
                      <span className={employee.status === "Active" ? "status-active" : "status-archived"}>
                        {employee.status}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="flex items-center space-x-2">
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canEdit || canDelete ? 10 : 9} className="text-center py-4">
                    {loading ? "Loading..." : "No employees found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Employee Modal */}
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
