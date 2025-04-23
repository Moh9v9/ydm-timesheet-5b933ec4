import { Employee, EmployeeFilters } from "@/lib/types";
import { fetchSheetData } from "@/lib/googleSheets/common";

/**
 * Returns true if employee passes all filters, including creation date vs. attendance date.
 */
export async function employeeMatchesFilters(
  employee: Employee,
  filters: EmployeeFilters,
  currentAttendanceDate?: string
): Promise<boolean> {
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
  
  // Status filter handling - if status filter is "All", explicitly skip status check
  if (filters.status && filters.status !== "All") {
    console.log(`Checking status filter for ${employee.fullName}: employee status=${employee.status}, filter status=${filters.status}`);
    
    // Apply status filter
    if (employee.status !== filters.status) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - status doesn't match: ${employee.status} != ${filters.status}`);
      return false;
    }
  } else if (filters.status === "All") {
    // Explicitly log that we're including this employee because 'All' is selected
    console.log(`Including employee ${employee.fullName} with status ${employee.status} because 'All' status filter is active`);
  }
  
  // For archived employees in attendance view, check if they have a record for the selected date
  // ONLY apply this check if we're in attendance view (currentAttendanceDate is provided)
  // AND we're not explicitly showing all statuses or archived employees
  if (employee.status === "Archived" && currentAttendanceDate && filters.status !== "Archived" && filters.status !== "All") {
    try {
      // Use Google Sheets to fetch attendance records instead of Supabase
      const attendanceRange = 'attendance_records!A1:Z1000';
      const response = await fetchSheetData(attendanceRange);
      
      if (!response || !response.values) {
        console.log(`No attendance records found for employee ${employee.id}`);
        return false;
      }

      const headers = response.values[0];
      const records = response.values.slice(1);

      const employeeAttendanceRecord = records.find(row => {
        const employeeIdIndex = headers.indexOf('employee_uuid');
        const dateIndex = headers.indexOf('date');
        return row[employeeIdIndex] === employee.id && row[dateIndex] === currentAttendanceDate;
      });

      if (!employeeAttendanceRecord) {
        console.log(`Archived employee ${employee.id} (${employee.fullName}) filtered out - no record for date: ${currentAttendanceDate}`);
        return false;
      }
      
      console.log(`Archived employee ${employee.id} (${employee.fullName}) included - has record for date: ${currentAttendanceDate}`);
    } catch (error) {
      console.error('Error checking attendance records:', error);
      return false;
    }
  }
  
  // Other filters remain unchanged
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
