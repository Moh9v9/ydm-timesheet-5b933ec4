
import { Employee, EmployeeFilters } from "@/lib/types";

export interface EmployeeContextType {
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
