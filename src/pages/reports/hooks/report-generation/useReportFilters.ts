
import { supabase } from "@/integrations/supabase/client";
import { format, endOfMonth } from "date-fns";

export const useReportFilters = () => {
  const applyMonthlyFilters = async (query: any, {
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
    
    // Apply project filter if selected
    if (selectedProject && selectedProject !== "all") {
      console.log(`Filtering by project: ${selectedProject}`);
      
      const { data: projectEmployees } = await supabase
        .from('employees')
        .select('id')
        .eq('project', selectedProject)
        .or(includeInactive ? `status.eq.Active,status.eq.Archived` : 'status.eq.Active');
        
      if (projectEmployees && projectEmployees.length > 0) {
        const employeeIds = projectEmployees.map(emp => emp.id);
        query = query.in('employee_uuid', employeeIds);
      }
    }
    
    // Apply location filter if selected
    if (selectedLocation && selectedLocation !== "all") {
      console.log(`Filtering by location: ${selectedLocation}`);
      
      const { data: locationEmployees } = await supabase
        .from('employees')
        .select('id')
        .eq('location', selectedLocation)
        .or(includeInactive ? `status.eq.Active,status.eq.Archived` : 'status.eq.Active');
        
      if (locationEmployees && locationEmployees.length > 0) {
        const employeeIds = locationEmployees.map(emp => emp.id);
        query = query.in('employee_uuid', employeeIds);
      }
    }
    
    // Apply payment type filter if selected
    if (selectedPaymentType && selectedPaymentType !== "all") {
      console.log(`Filtering by payment type: ${selectedPaymentType}`);
      
      const { data: filteredEmployees } = await supabase
        .from('employees')
        .select('id')
        .eq('payment_type', selectedPaymentType)
        .or(includeInactive ? `status.eq.Active,status.eq.Archived` : 'status.eq.Active');
      
      if (filteredEmployees && filteredEmployees.length > 0) {
        const employeeIds = filteredEmployees.map(emp => emp.id);
        query = query.in('employee_uuid', employeeIds);
      }
    } else if (includeInactive) {
      // If include inactive is turned on but no payment type filter
      console.log('Including inactive employees in the report');
      
      const { data: allEmployees } = await supabase
        .from('employees')
        .select('id')
        .or('status.eq.Active,status.eq.Archived');
      
      if (allEmployees && allEmployees.length > 0) {
        const employeeIds = allEmployees.map(emp => emp.id);
        query = query.in('employee_uuid', employeeIds);
      }
    } else {
      // If not including inactive and no specific payment type, only get active employees
      const { data: activeEmployees } = await supabase
        .from('employees')
        .select('id')
        .eq('status', 'Active');
        
      if (activeEmployees && activeEmployees.length > 0) {
        const employeeIds = activeEmployees.map(emp => emp.id);
        query = query.in('employee_uuid', employeeIds);
      }
    }
    
    return query;
  };

  return {
    applyMonthlyFilters
  };
};
