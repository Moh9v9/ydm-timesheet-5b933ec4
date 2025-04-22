
import { useEffect, useState } from "react";
import { Employee } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceFilters {
  project: string;
  location: string;
  paymentType: string;
  sponsorship: string;
}

export const useAttendanceEmployees = (
  currentDate: string, 
  filters?: AttendanceFilters
) => {
  const { employees, loading } = useEmployees();
  const [attendanceEmployees, setAttendanceEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployeesWithRecords = async () => {
      console.log("Filtering employees with:", filters);
      // Start with active employees
      let filtered = [...employees].filter(emp => emp.status === "Active");
      
      // Apply filters if provided
      if (filters) {
        // Filter by project
        if (filters.project && filters.project !== "All Projects") {
          filtered = filtered.filter(emp => emp.project === filters.project);
          console.log(`Filtered by project ${filters.project}: ${filtered.length} employees remain`);
        }
        
        // Filter by location
        if (filters.location && filters.location !== "All Locations") {
          filtered = filtered.filter(emp => emp.location === filters.location);
          console.log(`Filtered by location ${filters.location}: ${filtered.length} employees remain`);
        }
        
        // Filter by payment type
        if (filters.paymentType && filters.paymentType !== "All Types") {
          filtered = filtered.filter(emp => emp.paymentType === filters.paymentType);
          console.log(`Filtered by payment type ${filters.paymentType}: ${filtered.length} employees remain`);
        }
        
        // Filter by sponsorship
        if (filters.sponsorship && filters.sponsorship !== "All Sponsorships") {
          filtered = filtered.filter(emp => emp.sponsorship === filters.sponsorship);
          console.log(`Filtered by sponsorship ${filters.sponsorship}: ${filtered.length} employees remain`);
        }
      }

      try {
        // First, check what attendance records exist for the current date
        console.log(`Checking for attendance records for date: ${currentDate}`);
        const { data: attendanceRecords, error: attendanceError } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', currentDate);

        if (attendanceError) {
          console.error('Error fetching attendance records:', attendanceError);
          return;
        }

        // Log the retrieved attendance records to verify if they exist
        console.log(`Found ${attendanceRecords?.length || 0} attendance records for ${currentDate}:`, attendanceRecords);
        
        // Extract employee UUIDs from attendance records
        const employeeUuids = attendanceRecords?.map(record => record.employee_uuid) || [];

        if (employeeUuids.length > 0) {
          // Fetch archived employees that have attendance records
          const { data: archivedEmployees, error: archivedError } = await supabase
            .from('employees')
            .select('*')
            .eq('status', 'Archived')
            .in('id', employeeUuids);

          if (archivedError) {
            console.error('Error fetching archived employees:', archivedError);
          } else if (archivedEmployees && archivedEmployees.length > 0) {
            console.log(`Found ${archivedEmployees.length} archived employees with records for ${currentDate}`);

            // Map the DB rows to Employee objects
            let archivedWithRecords = archivedEmployees.map(record => ({
              id: record.id,
              fullName: record.full_name,
              iqamaNo: record.iqama_no || 0,
              project: record.project,
              location: record.location,
              jobTitle: record.job_title,
              paymentType: record.payment_type,
              rateOfPayment: record.rate_of_payment,
              sponsorship: record.sponsorship,
              status: record.status
            } as Employee));

            // Apply the same filters to archived employees
            if (filters) {
              if (filters.project !== "All Projects") {
                archivedWithRecords = archivedWithRecords.filter(emp => emp.project === filters.project);
              }
              if (filters.location !== "All Locations") {
                archivedWithRecords = archivedWithRecords.filter(emp => emp.location === filters.location);
              }
              if (filters.paymentType !== "All Types") {
                archivedWithRecords = archivedWithRecords.filter(emp => emp.paymentType === filters.paymentType);
              }
              if (filters.sponsorship !== "All Sponsorships") {
                archivedWithRecords = archivedWithRecords.filter(emp => emp.sponsorship === filters.sponsorship);
              }
            }

            // Add filtered archived employees to the result
            filtered = [...filtered, ...archivedWithRecords];
          }
        }
      } catch (error) {
        console.error('Error in fetchEmployeesWithRecords:', error);
      }

      setAttendanceEmployees(filtered);
      console.log(`Final filtered employees: ${filtered.length}`);
    };

    fetchEmployeesWithRecords();
  }, [employees, currentDate, filters]);

  return {
    attendanceEmployees,
    loading
  };
};
