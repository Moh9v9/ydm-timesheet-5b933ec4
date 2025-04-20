
import { createContext, useContext, useState, ReactNode } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";

// Mock data for employees
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    fullName: "John Smith",
    employeeId: "YDM-001",
    project: "Website Development",
    location: "Dubai",
    jobTitle: "Frontend Developer",
    paymentType: "Monthly",
    rateOfPayment: 5000,
    sponsorship: "YDM co",
    status: "Active"
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    employeeId: "YDM-002",
    project: "Mobile App",
    location: "Abu Dhabi",
    jobTitle: "UI/UX Designer",
    paymentType: "Monthly",
    rateOfPayment: 4800,
    sponsorship: "YDM co",
    status: "Active"
  },
  {
    id: "3",
    fullName: "Mohammed Ali",
    employeeId: "YDM-003",
    project: "CRM System",
    location: "Sharjah",
    jobTitle: "Backend Developer",
    paymentType: "Daily",
    rateOfPayment: 250,
    sponsorship: "YDM est",
    status: "Active"
  },
  {
    id: "4",
    fullName: "Fatima Hassan",
    employeeId: "YDM-004",
    project: "Mobile App",
    location: "Dubai",
    jobTitle: "Project Manager",
    paymentType: "Monthly",
    rateOfPayment: 7500,
    sponsorship: "YDM co",
    status: "Active"
  },
  {
    id: "5",
    fullName: "David Chen",
    employeeId: "YDM-005",
    project: "Website Development",
    location: "Abu Dhabi",
    jobTitle: "QA Engineer",
    paymentType: "Daily",
    rateOfPayment: 200,
    sponsorship: "Outside",
    status: "Active"
  },
  {
    id: "6",
    fullName: "Aisha Mohammed",
    employeeId: "YDM-006",
    project: "Data Analysis",
    location: "Dubai",
    jobTitle: "Data Scientist",
    paymentType: "Monthly",
    rateOfPayment: 6200,
    sponsorship: "YDM est",
    status: "Archived"
  }
];

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
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: "Active" // Default to showing only active employees
  });
  const [loading, setLoading] = useState(false);

  // Filter employees based on current filters
  const filteredEmployees = employees.filter(employee => {
    // Skip if employee is archived and we're not explicitly showing archived
    if (filters.status && employee.status !== filters.status) return false;
    
    // Check other filters
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
