
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
      const { data: archivedWithRecords, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'Archived')
        .in('id', supabase
          .from('attendance_records')
          .select('employee_uuid')
          .eq('date', currentDate)
        );

      if (error) {
        console.error('Error fetching archived employees:', error);
      }

      if (archivedWithRecords && archivedWithRecords.length > 0) {
        console.log(`Found ${archivedWithRecords.length} archived employees with records for ${currentDate}`);
        
        // Map the returned database rows to Employee objects
        const archivedEmployees = archivedWithRecords.map(record => ({
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
        
        // Filter archived employees based on the same filters
        let filteredArchived = [...archivedEmployees];
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
