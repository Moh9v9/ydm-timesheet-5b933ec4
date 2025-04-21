
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns true if employee passes all filters, including creation date vs. attendance date.
 * For archived employees, only includes them if they have an attendance record for the selected date.
 */
export async function employeeMatchesAttendanceFilters(
  employee: Employee,
  filters: EmployeeFilters,
  currentAttendanceDate?: string
): Promise<boolean> {
  // Filter out employees who were not created yet on the selected attendance date
  if (currentAttendanceDate && employee.created_at) {
    const employeeCreationDate = employee.created_at.split('T')[0];
    if (employeeCreationDate > currentAttendanceDate) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - created after attendance date ${currentAttendanceDate}`);
      return false;
    }
  }

  // For archived employees, ONLY include them if they have a record for the selected date
  if (employee.status === "Archived") {
    if (!currentAttendanceDate) {
      console.log(`Archived employee ${employee.id} (${employee.fullName}) filtered out - no attendance date specified`);
      return false;
    }

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

    console.log(`Archived employee ${employee.id} (${employee.fullName}) included - has record for date: ${currentAttendanceDate}`);
    return true;
  }

  // Status filter handling for non-archived employees
  if (filters.status && filters.status !== "All" && employee.status !== filters.status) {
    console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - status doesn't match: ${employee.status} != ${filters.status}`);
    return false;
  }

  // Apply other filters
  if (filters.project && employee.project !== filters.project) return false;
  if (filters.location && employee.location !== filters.location) return false;
  if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
  if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;

  return true;
}
