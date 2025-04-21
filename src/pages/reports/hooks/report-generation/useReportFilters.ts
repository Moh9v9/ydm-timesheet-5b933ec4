
import { supabase } from "@/integrations/supabase/client";
import { format, endOfMonth } from "date-fns";
import { useCallback } from "react";

export const useReportFilters = () => {
  // Optimize with useCallback to prevent recreation on each render
  const applyMonthlyFilters = useCallback(async (query: any, {
    selectedDate,
    searchTerm,
    selectedProject,
    selectedLocation,
    selectedPaymentType,
    includeInactive
  }: {
    selectedDate: Date;
    searchTerm?: string;
    selectedProject?: string;
    selectedLocation?: string;
    selectedPaymentType?: string;
    includeInactive: boolean;
  }) => {
    // Get the month and year from selected date for monthly reports
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const lastDayOfMonth = endOfMonth(selectedDate);
    
    // Add date filtering for the selected month
    query = query.gte('date', `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`)
                 .lte('date', format(lastDayOfMonth, 'yyyy-MM-dd'));
    
    // Add employee filter if an employee is selected
    if (searchTerm && searchTerm !== "") {
      console.log(`Filtering attendance records by employee: ${searchTerm}`);
      query = query.ilike('employee_name', `%${searchTerm}%`);
    }
    
    // Use prepared queries to optimize database interactions
    let employeeIds: string[] = [];
    
    // Optimize filter queries by combining them
    if ((selectedProject && selectedProject !== "all") || 
        (selectedLocation && selectedLocation !== "all") ||
        (selectedPaymentType && selectedPaymentType !== "all") || 
        includeInactive) {
      // Build filter conditions
      let employeeQuery = supabase.from('employees').select('id');
      
      if (selectedProject && selectedProject !== "all") {
        console.log(`Filtering by project: ${selectedProject}`);
        employeeQuery = employeeQuery.eq('project', selectedProject);
      }
      
      if (selectedLocation && selectedLocation !== "all") {
        console.log(`Filtering by location: ${selectedLocation}`);
        employeeQuery = employeeQuery.eq('location', selectedLocation);
      }
      
      if (selectedPaymentType && selectedPaymentType !== "all") {
        console.log(`Filtering by payment type: ${selectedPaymentType}`);
        employeeQuery = employeeQuery.eq('payment_type', selectedPaymentType);
      }
      
      // Apply status filter based on includeInactive flag
      if (includeInactive) {
        employeeQuery = employeeQuery.or('status.eq.Active,status.eq.Archived');
      } else {
        employeeQuery = employeeQuery.eq('status', 'Active');
      }
      
      const { data: filteredEmployees } = await employeeQuery;
      
      if (filteredEmployees && filteredEmployees.length > 0) {
        employeeIds = filteredEmployees.map(emp => emp.id);
        query = query.in('employee_uuid', employeeIds);
      }
    }
    
    return query;
  }, []);

  return {
    applyMonthlyFilters
  };
};
