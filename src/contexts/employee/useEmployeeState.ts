
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useEmployeeState = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: "Active"
  });
  const [loading, setLoading] = useState(false);

  // Fetch employees from Supabase on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          const formattedEmployees: Employee[] = data.map(emp => ({
            id: emp.id,
            fullName: emp.full_name,
            employeeId: emp.employee_id,
            project: emp.project,
            location: emp.location,
            jobTitle: emp.job_title,
            paymentType: emp.payment_type,
            rateOfPayment: emp.rate_of_payment,
            sponsorship: emp.sponsorship,
            status: emp.status,
          }));
          setEmployees(formattedEmployees);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on current filters
  const filteredEmployees = employees.filter(employee => {
    if (filters.status && employee.status !== filters.status) return false;
    if (filters.project && employee.project !== filters.project) return false;
    if (filters.location && employee.location !== filters.location) return false;
    if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
    if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
    return true;
  });

  return {
    employees,
    setEmployees,
    filteredEmployees,
    filters,
    setFilters,
    loading,
    setLoading,
  };
};
