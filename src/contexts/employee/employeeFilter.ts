
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
  
  // Status filter handling - Only apply when a specific status is selected
  if (filters.status && filters.status !== "All" as string) {
    console.log(`Checking status filter for ${employee.fullName}: employee status=${employee.status}, filter status=${filters.status}`);
    
    // Apply status filter
    if (employee.status !== filters.status) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - status doesn't match: ${employee.status} != ${filters.status}`);
      return false;
    }
  }
  
  // For archived employees in attendance view, check if they have a record for the selected date
  // ONLY apply this check if we're in attendance view (currentAttendanceDate is provided)
  // AND we're NOT showing "All" status (which should show everything)
  if (employee.status === "Archived" && currentAttendanceDate && filters.status !== "Archived" && filters.status !== "All" as string) {
    // This check should only run in attendance view when we're not explicitly filtering for archived employees or all employees
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
  
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
