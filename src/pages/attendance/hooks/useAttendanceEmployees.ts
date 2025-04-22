
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

      // Get archived employees with attendance records for the current date
      const { data: archivedWithRecords } = await supabase.rpc('get_archived_with_attendance', {
        selected_date: currentDate
      });

      if (archivedWithRecords && archivedWithRecords.length > 0) {
        console.log(`Found ${archivedWithRecords.length} archived employees with records for ${currentDate}`);
        
        // Filter archived employees based on the same filters
        let filteredArchived = archivedWithRecords;
        if (filters) {
          if (filters.project !== "All Projects") {
            filteredArchived = filteredArchived.filter(emp => emp.project === filters.project);
          }
          if (filters.location !== "All Locations") {
            filteredArchived = filteredArchived.filter(emp => emp.location === filters.location);
          }
          if (filters.paymentType !== "All Types") {
            filteredArchived = filteredArchived.filter(emp => emp.paymentType === filters.paymentType);
          }
          if (filters.sponsorship !== "All Sponsorships") {
            filteredArchived = filteredArchived.filter(emp => emp.sponsorship === filters.sponsorship);
          }
        }
        
        // Add filtered archived employees to the result
        filtered = [...filtered, ...filteredArchived];
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

