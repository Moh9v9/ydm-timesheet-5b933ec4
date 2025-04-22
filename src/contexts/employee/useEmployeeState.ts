
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { formatEmployee } from "./formatEmployee";
import { employeeMatchesFilters } from "./employeeFilter";

export const useEmployeeState = (currentAttendanceDate?: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({ status: "All" }); // Set default status to "All"
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState<boolean>(false);

  // Function to fetch employees from Supabase
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('full_name');

      if (error) throw error;

      const formattedEmployees = data.map(formatEmployee);
      setEmployees(formattedEmployees);
      setDataFetched(true);
      
      console.log(`Fetched ${formattedEmployees.length} employees from database`);
      console.log(`Active: ${formattedEmployees.filter(e => e.status === "Active").length}, Archived: ${formattedEmployees.filter(e => e.status === "Archived").length}`);

      // Apply filters to employees
      await applyFilters(formattedEmployees, filters);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to apply filters to employees
  const applyFilters = async (emps: Employee[], filts: EmployeeFilters) => {
    setLoading(true);
    try {
      console.log("Applying filters:", filts);
      
      // Handle the status filter specifically
      if (filts.status === "All") {
        console.log("All status filter active - should show both Active and Archived employees");
        console.log(`Total employees before filtering: Active=${emps.filter(e => e.status === "Active").length}, Archived=${emps.filter(e => e.status === "Archived").length}`);
      } else if (filts.status === "Archived") {
        console.log(`Archived status filter active - should show ${emps.filter(e => e.status === "Archived").length} employees`);
      } else if (filts.status) {
        console.log(`Status filter active: ${filts.status}`);
        console.log(`Employees before status filter: ${emps.length}`);
        console.log(`Employees with status ${filts.status}: ${emps.filter(e => e.status === filts.status).length}`);
      }
      // We're not setting a default status filter anymore - now the specific "All" value handles this
      
      // Map each employee through the filter function (now async)
      const filterPromises = emps.map(emp => 
        employeeMatchesFilters(emp, filts, currentAttendanceDate)
          .then(passes => passes ? emp : null)
      );
      
      // Wait for all filter promises to resolve
      const filterResults = await Promise.all(filterPromises);
      
      // Filter out null values (employees that didn't pass)
      const filtered = filterResults.filter(emp => emp !== null) as Employee[];
      
      setFilteredEmployees(filtered);
      console.log(`🔍 useEmployeeState - filtered employees: ${filtered.length} of ${emps.length} total with attendance date: ${currentAttendanceDate || 'none'}`);
      
      if (filts.status) {
        console.log(`After filtering - employees with status ${filts.status}: ${filtered.filter(e => e.status === filts.status).length}`);
        if (filts.status === "All") {
          console.log(`After filtering with All - Active: ${filtered.filter(e => e.status === "Active").length}, Archived: ${filtered.filter(e => e.status === "Archived").length}`);
        }
      }
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever employees or filters change
  useEffect(() => {
    if (employees.length > 0) {
      applyFilters(employees, filters);
    }
  }, [employees, filters, currentAttendanceDate]);

  // Function to refresh employees - modified to return a Promise
  const refreshEmployees = async (): Promise<void> => {
    return await readEmployees();
  };

  // Fetch employees on component mount
  useEffect(() => {
    readEmployees();
  }, []);

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
