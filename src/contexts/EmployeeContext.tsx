
import { createContext, useContext, useState, ReactNode } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";

interface EmployeeContextType {
  employees: Employee[];
  filteredEmployees: Employee[];
  filters: EmployeeFilters;
  setFilters: (filters: EmployeeFilters) => void;
  addEmployee: (employee: Omit<Employee, "id">) => Promise<Employee>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployee: (id: string) => Employee | undefined;
  loading: boolean;
  getUniqueValues: (field: keyof Employee) => string[];
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: "Active"
  });
  const [loading, setLoading] = useState(false);

  // Filter employees based on current filters
  const filteredEmployees = employees.filter(employee => {
    if (filters.status && employee.status !== filters.status) return false;
    if (filters.project && employee.project !== filters.project) return false;
    if (filters.location && employee.location !== filters.location) return false;
    if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
    if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
    return true;
  });

  // Get employee by ID
  const getEmployee = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  // Add new employee
  const addEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate new ID
    const newEmployee: Employee = {
      ...employee,
      id: `${Date.now()}`,
    };
    
    setEmployees([...employees, newEmployee]);
    setLoading(false);
    return newEmployee;
  };

  // Update employee
  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedEmployees = employees.map(emp => {
      if (emp.id === id) {
        return { ...emp, ...employeeData };
      }
      return emp;
    });
    
    setEmployees(updatedEmployees);
    setLoading(false);
    
    const updatedEmployee = updatedEmployees.find(emp => emp.id === id);
    if (!updatedEmployee) {
      throw new Error("Employee not found");
    }
    
    return updatedEmployee;
  };

  // Delete employee
  const deleteEmployee = async (id: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setEmployees(employees.filter(emp => emp.id !== id));
    setLoading(false);
  };

  // Helper to get unique values for filter dropdowns
  const getUniqueValues = (field: keyof Employee) => {
    const values = employees.map(emp => emp[field] as string);
    return [...new Set(values)].sort();
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,
        filters,
        setFilters,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        loading,
        getUniqueValues
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
