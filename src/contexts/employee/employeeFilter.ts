
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
  
  // Status filter handling - Only apply when a specific status is selected (not "All")
  if (filters.status && filters.status !== "All") {
    console.log(`Checking status filter for ${employee.fullName}: employee status=${employee.status}, filter status=${filters.status}`);
    
    // Apply status filter
    if (employee.status !== filters.status) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - status doesn't match: ${employee.status} != ${filters.status}`);
      return false;
    }
  }
  
  // For archived employees in attendance view, check if they have a record for the selected date
  // ONLY apply this check if:
  // 1. We're in attendance view (currentAttendanceDate is provided)
  // 2. The employee is archived
  // 3. We're not explicitly viewing archived employees (filters.status !== "Archived")
  // 4. We're not viewing all statuses (filters.status !== "All") - THIS IS THE KEY CHANGE
  if (employee.status === "Archived" && 
      currentAttendanceDate && 
      filters.status !== "Archived" && 
      filters.status !== "All") {  // Added this condition to fix the "All" filter issue
    // This check should only run in attendance view when we're not explicitly filtering for archived or all employees
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
  
  // Apply other filters
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
  
  return true;
}
