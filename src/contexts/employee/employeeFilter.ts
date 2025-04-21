
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
    
    // Compare dates as strings - employee should NOT appear in attendance lists for dates BEFORE their creation
    if (employeeCreationDate > currentAttendanceDate) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - created on ${employeeCreationDate}, attendance date: ${currentAttendanceDate}`);
      return false;
    }
  }
  
  // VERY IMPORTANT: For attendance view, we should NEVER filter by status
  // Allow all employees (active or archived) to appear in attendance tables
  if (filters.status && employee.status !== filters.status && !currentAttendanceDate) {
    // Only apply status filter when NOT in attendance view
    return false;
  }
  
  // Log when specifically looking for target archived employees to aid debugging
  if (employee.id === "1fdd63f7-a399-4341-8c16-d72b0ab3ca8f" || employee.id === "07ea4c39-8033-439c-89e9-2361833e906d") {
    console.log(`Checking target archived employee ${employee.id} (${employee.fullName}) - Status: ${employee.status}`);
    console.log(`Current attendance date: ${currentAttendanceDate}, Will show: ${currentAttendanceDate ? "YES" : "NO"}`);
  }
  
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  return true;
}
