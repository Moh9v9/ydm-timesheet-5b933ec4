
import { Employee, EmployeeFilters } from "@/lib/types";

/**
 * EMPLOYEE-PAGE-SPECIFIC FILTER: Returns true if employee matches all filters.
 * Used only on the Employees page, not affected by attendance filtering.
 */
export async function employeeMatchesFilters(
  employee: Employee,
  filters: EmployeeFilters
): Promise<boolean> {
  // Status filter handling
  if (filters.status && filters.status !== "All") {
    if (employee.status !== filters.status) {
      return false;
    }
  }
  
  // Apply other filters
  if (filters.project && filters.project !== "All" && employee.project !== filters.project) return false;
  if (filters.location && filters.location !== "All" && employee.location !== filters.location) return false;
  if (filters.paymentType && filters.paymentType !== "All" && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && filters.sponsorship !== "All" && employee.sponsorship !== filters.sponsorship) return false;
  
  // If all filters pass, return true
  return true;
}
