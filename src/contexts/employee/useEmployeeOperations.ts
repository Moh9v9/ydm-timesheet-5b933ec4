
import { Employee } from "@/lib/types";

export const useEmployeeOperations = (
  employees: Employee[],
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
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

  return {
    getEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getUniqueValues,
  };
};
