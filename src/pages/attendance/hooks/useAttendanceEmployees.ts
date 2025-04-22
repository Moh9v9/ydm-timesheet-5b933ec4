
import { useEffect, useState } from "react";
import { Employee } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";

interface AttendanceFilters {
  project: string;
  location: string;
  paymentType: string;
  sponsorship: string;
  status: string;
}

export const useAttendanceEmployees = (
  currentDate: string, 
  filters?: AttendanceFilters
) => {
  const { employees, loading } = useEmployees();
  const [attendanceEmployees, setAttendanceEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    console.log("Filtering employees with:", filters);
    let filtered = [...employees];
    
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
        // Use correct capitalization to match the Employee type definition
        const paymentTypeValue = filters.paymentType; // Already capitalized from the filter dropdown
        
        if (paymentTypeValue) {
          filtered = filtered.filter(emp => emp.paymentType === paymentTypeValue);
          console.log(`Filtered by payment type ${paymentTypeValue}: ${filtered.length} employees remain`);
        }
      }
      
      // Filter by sponsorship
      if (filters.sponsorship && filters.sponsorship !== "All Sponsorships") {
        filtered = filtered.filter(emp => emp.sponsorship === filters.sponsorship);
        console.log(`Filtered by sponsorship ${filters.sponsorship}: ${filtered.length} employees remain`);
      }
      
      // Filter by status
      if (filters.status && filters.status !== "All Status") {
        filtered = filtered.filter(emp => emp.status === filters.status);
        console.log(`Filtered by status ${filters.status}: ${filtered.length} employees remain`);
      }
    }
    
    setAttendanceEmployees(filtered);
    console.log(`Final filtered employees: ${filtered.length}`);
  }, [employees, currentDate, filters]);

  return {
    attendanceEmployees,
    loading
  };
};
