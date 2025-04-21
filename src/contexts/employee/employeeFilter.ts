
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
    const employeeCreationDate = employee.created_at.split('T')[0];
    
    if (employeeCreationDate > currentAttendanceDate) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - created on ${employeeCreationDate}, attendance date: ${currentAttendanceDate}`);
      return false;
    }
  }
  
  // Special behavior for attendance view vs. employee list view
  if (currentAttendanceDate) {
    // We're in attendance view - special filtering for archived employees
    if (employee.status === "Archived") {
      // For archived employees in attendance view, ONLY include them if they have a record for the selected date
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
    }
  } else {
    // We're in employee list view - use standard status filtering
    // Status filter handling - Only apply when a specific status is selected (not "All")
    if (filters.status && filters.status !== "All") {
      console.log(`Employee list view: Checking status filter for ${employee.fullName}: employee status=${employee.status}, filter status=${filters.status}`);
      
      if (employee.status !== filters.status) {
        console.log(`Employee list view: Employee ${employee.id} (${employee.fullName}) filtered out - status doesn't match: ${employee.status} != ${filters.status}`);
        return false;
      }
    }
  }
  
  // Apply other filters for both views
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
