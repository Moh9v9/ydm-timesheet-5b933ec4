
import { useEffect, useState } from "react";
import { Employee } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { readAttendanceByDate } from "@/lib/googleSheets";

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
        // Check what attendance records exist for the current date using Google Sheets API
        console.log(`Checking for attendance records for date: ${currentDate}`);
        const attendanceRecords = await readAttendanceByDate(currentDate);

        // Log the retrieved attendance records to verify if they exist
        console.log(`Found ${attendanceRecords?.length || 0} attendance records for ${currentDate}:`, attendanceRecords);
        
        // Extract employee IDs from attendance records
        const employeeIds = attendanceRecords?.map(record => record.employeeId) || [];

        if (employeeIds.length > 0) {
          // Find archived employees that have attendance records for this date
          const archivedEmployees = employees
            .filter(emp => emp.status === "Archived" && employeeIds.includes(emp.id));

          if (archivedEmployees && archivedEmployees.length > 0) {
            console.log(`Found ${archivedEmployees.length} archived employees with records for ${currentDate}`);

            // Apply the same filters to archived employees
            let archivedWithRecords = [...archivedEmployees];
            
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
