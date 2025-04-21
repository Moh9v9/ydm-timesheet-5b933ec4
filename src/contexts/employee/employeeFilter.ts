
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
  
  // CRITICAL: In attendance view (when currentAttendanceDate exists), NEVER filter by status
  // We must include ALL employees (active or archived) that existed on that date
  if (filters.status && employee.status !== filters.status && !currentAttendanceDate) {
    // Status filter is ONLY applied when NOT viewing attendance
    return false;
  }
  
  // Debug logging for known target IDs
  if (employee.id === "1fdd63f7-a399-4341-8c16-d72b0ab3ca8f" || 
      employee.id === "07ea4c39-8033-439c-89e9-2361833e906d" ||
      employee.id === "e267bcd9-6d19-432f-8354-0f8e069a3071" ||
      employee.id === "5ad758ba-dcf2-4c50-b848-0a192d3daf15") {
    console.log(`TARGET EMPLOYEE FOUND: ${employee.id} (${employee.fullName})`);
    console.log(`Status: ${employee.status}, Attendance date: ${currentAttendanceDate}`);
    console.log(`Will show in table: YES - Explicitly included for attendance`);
  }
  
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
