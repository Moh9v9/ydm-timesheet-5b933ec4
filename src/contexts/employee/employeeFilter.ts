
import { Employee, EmployeeFilters } from "@/lib/types";

/**
 * Returns true if employee passes all filters, including creation date vs. attendance date.
 */
export function employeeMatchesFilters(
  employee: Employee,
  filters: EmployeeFilters,
  currentAttendanceDate?: string
): boolean {
  // Filter out employees who were not created yet on the selected attendance date
  if (currentAttendanceDate && employee.created_at) {
    // Extract just the date part from the ISO timestamp for proper comparison
    const employeeCreationDate = employee.created_at.split('T')[0];
    
    // Now compare the date parts only
    if (employeeCreationDate > currentAttendanceDate) return false;
  }
  if (filters.status && employee.status !== filters.status) return false;
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  return true;
}
