
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { employeeMatchesFilters } from "./employeeFilter";
import { formatEmployee } from "./formatEmployee";

/**
 * Manages employee state and filtering, optionally by attendance date.
 */
export const useEmployeeState = (currentAttendanceDate?: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: "Active"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!initialized) {
      fetchEmployees();
      setInitialized(true);
    }
  }, [initialized]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Fetching employees from Supabase...");
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) throw error;
      console.log("🔍 Employees data received:", data);

      if (data && data.length > 0) {
        const formattedEmployees: Employee[] = data.map(formatEmployee);
        console.log("🔍 Formatted employees:", formattedEmployees);
        setEmployees(formattedEmployees);
      } else {
        console.log("🔍 No employees found in the database");
        setEmployees([]);
      }
      setDataFetched(true);
    } catch (err: any) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Failed to fetch employees');
      toast.error("Failed to load employees. Please try again.");
      setEmployees([]);
      setDataFetched(true);
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING STEP ---
  const filteredEmployees = employees.filter(employee =>
    employeeMatchesFilters(employee, filters, currentAttendanceDate)
  );

  console.log("🔍 useEmployeeState - filtered employees:", filteredEmployees.length, "loading:", loading, "dataFetched:", dataFetched);

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
    refreshEmployees: fetchEmployees
  };
};
