
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { employeeMatchesFilters } from "./employeeFilter";
import { formatEmployee } from "./formatEmployee";

// Use a type for the filter function to improve clarity
type EmployeeFilterFunction = (
  employee: Employee, 
  filters: EmployeeFilters,
  currentAttendanceDate?: string
) => Promise<boolean>;

export const useEmployeeState = (
  currentAttendanceDate?: string,
  filterFunction: EmployeeFilterFunction = employeeMatchesFilters
) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Function to fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('employees').select('*');
      
      if (error) throw error;

      // Use the formatEmployee utility to properly type the data from the database
      const formattedEmployees: Employee[] = data.map(employee => formatEmployee(employee));
      
      setEmployees(formattedEmployees);
      setDataFetched(true);
      
      console.log("Fetched employees: ", formattedEmployees.length, 
                  "Active:", formattedEmployees.filter(e => e.status === "Active").length,
                  "Archived:", formattedEmployees.filter(e => e.status === "Archived").length);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter employees using the provided filter function
  const filterEmployees = async () => {
    try {
      setLoading(true);
      
      console.log("Current filters before applying:", JSON.stringify(filters));
      console.log("Is attendance view:", !!currentAttendanceDate);
      
      const filtered = await Promise.all(
        employees.map(async (employee) => {
          const passes = await filterFunction(employee, filters, currentAttendanceDate);
          
          // Add debug log for each employee filtering
          if (!passes) {
            console.log(`Employee ${employee.id} (${employee.fullName}) filtered out with filters:`, 
                        JSON.stringify(filters), 
                        "current attendance date:", currentAttendanceDate,
                        "status:", employee.status);
          }
          
          return { employee, passes };
        })
      );
      
      const newFilteredEmployees = filtered
        .filter(({ passes }) => passes)
        .map(({ employee }) => employee);
      
      console.log("Filtered employees: ", newFilteredEmployees.length, 
                  "Active:", newFilteredEmployees.filter(e => e.status === "Active").length,
                  "Archived:", newFilteredEmployees.filter(e => e.status === "Archived").length,
                  "Applied filters:", JSON.stringify(filters),
                  "Is on employees page:", !currentAttendanceDate);
      
      setFilteredEmployees(newFilteredEmployees);
    } catch (error) {
      console.error('Error filtering employees:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees when filters or employees change
  useEffect(() => {
    if (employees.length > 0) {
      filterEmployees();
    }
  }, [employees, filters, currentAttendanceDate]);

  const refreshEmployees = () => {
    fetchEmployees();
  };

  return {
    employees,
    setEmployees,
    filteredEmployees,
    filters,
    setFilters,
    loading,
    setLoading,
    error,
    dataFetched,
    refreshEmployees
  };
};
