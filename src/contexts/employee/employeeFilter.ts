
import { Employee, EmployeeFilters } from "@/lib/types";

/**
 * EMPLOYEE-PAGE-SPECIFIC FILTER: Returns true if employee matches all filters.
 * Used only on the Employees page, not affected by attendance filtering.
 */
export async function employeeMatchesFilters(
  employee: Employee,
  filters: EmployeeFilters
): Promise<boolean> {
  // Status filter handling - Only apply when a specific status is selected (not "All")
  if (filters.status && filters.status !== "All" && employee.status !== filters.status) {
    return false;
  }
  
  // Apply other filters
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
