
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
    if (employee.created_at > currentAttendanceDate) return false;
  }
  if (filters.status && employee.status !== filters.status) return false;
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  return true;
}
