
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
  
  // CRITICAL: In attendance view (when currentAttendanceDate exists), NEVER filter by status
  // We must include ALL employees (active or archived) that existed on that date
  if (filters.status && employee.status !== filters.status && !currentAttendanceDate) {
    // Status filter is ONLY applied when NOT viewing attendance
    return false;
  }
  
  // For archived employees in attendance view, check if they have a record for the selected date
  if (employee.status === "Archived" && currentAttendanceDate) {
    // Check if this archived employee has an attendance record for the selected date
    const { data } = await supabase
      .from('attendance_records')
      .select('id')
      .eq('employee_uuid', employee.id)
      .eq('date', currentAttendanceDate)
      .maybeSingle();
    
    if (!data) {
      console.log(`Archived employee ${employee.id} (${employee.fullName}) filtered out - no record for date: ${currentAttendanceDate}`);
      return false;
    }
    
    console.log(`Archived employee ${employee.id} (${employee.fullName}) included - has record for date: ${currentAttendanceDate}`);
    return true; // Include archived employees in attendance view only if they have a record
  }
  
  if (employee.id === "1fdd63f7-a399-4341-8c16-d72b0ab3ca8f" || 
      employee.id === "07ea4c39-8033-439c-89e9-2361833e906d" ||
      employee.id === "e267bcd9-6d19-432f-8354-0f8e069a3071" ||
      employee.id === "5ad758ba-dcf2-4c50-b848-0a192d3daf15") {
    console.log(`TARGET EMPLOYEE FOUND: ${employee.id} (${employee.fullName})`);
    console.log(`Status: ${employee.status}, Attendance date: ${currentAttendanceDate}`);
  }
  
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
