
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * ATTENDANCE-SPECIFIC FILTER: Returns true if employee should be shown in attendance view.
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

  // Status filter handling - if specific status is requested, apply it
  if (filters.status && filters.status !== "All") {
    if (employee.status !== filters.status) {
      console.log(`Employee ${employee.id} (${employee.fullName}) filtered out - status doesn't match: ${employee.status} != ${filters.status}`);
      return false;
    }
  }
  
  // Special rule for attendance view: For archived employees, ONLY include them if they have a record for the selected date
  // This only applies when no specific status filter is set (i.e., showing "All" statuses)
  if (employee.status === "Archived" && (!filters.status || filters.status === "All")) {
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
  }

  // Apply other filters
  if (filters.project && filters.project !== "All" && employee.project !== filters.project) {
    console.log(`Employee ${employee.id} filtered out - project doesn't match: ${employee.project} != ${filters.project}`);
    return false;
  }
  
  if (filters.location && filters.location !== "All" && employee.location !== filters.location) {
    console.log(`Employee ${employee.id} filtered out - location doesn't match: ${employee.location} != ${filters.location}`);
    return false;
  }
  
  if (filters.paymentType && filters.paymentType !== "All" && employee.paymentType !== filters.paymentType) {
    console.log(`Employee ${employee.id} filtered out - payment type doesn't match: ${employee.paymentType} != ${filters.paymentType}`);
    return false;
  }
  
  if (filters.sponsorship && filters.sponsorship !== "All" && employee.sponsorship !== filters.sponsorship) {
    console.log(`Employee ${employee.id} filtered out - sponsorship doesn't match: ${employee.sponsorship} != ${filters.sponsorship}`);
    return false;
  }

  return true;
}
