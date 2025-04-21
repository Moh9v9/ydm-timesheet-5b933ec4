
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
  if (!currentAttendanceDate && filters.status) {
    // Only apply status filter when not in attendance view
    console.log(`Employee ${employee.id} (${employee.fullName}) status: ${employee.status}, filter status: ${filters.status}`);
    if (employee.status !== filters.status) {
      return false;
    }
  }
  
  // For archived employees in attendance view, check if they have a record for the selected date
  if (employee.status === "Archived" && currentAttendanceDate) {
    // Check if this archived employee has an attendance record for the selected date
    const { data } = await supabase
      .from('attendance_records')
      .select('id, present')
      .eq('employee_uuid', employee.id)
      .eq('date', currentAttendanceDate)
      .maybeSingle();
    
    if (!data) {
      console.log(`Archived employee ${employee.id} (${employee.fullName}) filtered out - no record for date: ${currentAttendanceDate}`);
      return false;
    }
    
    console.log(`Archived employee ${employee.id} (${employee.fullName}) included - has record for date: ${currentAttendanceDate} with present=${data.present}`);
    return true; // Include archived employees in attendance view only if they have a record
  }
  
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
