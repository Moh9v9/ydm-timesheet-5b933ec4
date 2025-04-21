
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { employeeMatchesFilters } from "./employeeFilter";

export const useEmployeeState = (
  currentAttendanceDate?: string,
  filterFunction = employeeMatchesFilters
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

      const formattedEmployees: Employee[] = data.map(employee => ({
        id: employee.id,
        fullName: employee.full_name,
        iqamaNo: employee.iqama_no,
        project: employee.project,
        location: employee.location,
        jobTitle: employee.job_title,
        paymentType: employee.payment_type,
        rateOfPayment: employee.rate_of_payment,
        sponsorship: employee.sponsorship,
        status: employee.status,
        created_at: employee.created_at
      }));

      setEmployees(formattedEmployees);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter employees
  const filterEmployees = async () => {
    try {
      setLoading(true);
      const filtered = await Promise.all(
        employees.map(async (employee) => {
          const passes = await filterFunction(employee, filters, currentAttendanceDate);
          return { employee, passes };
        })
      );
      
      setFilteredEmployees(filtered.filter(({ passes }) => passes).map(({ employee }) => employee));
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
