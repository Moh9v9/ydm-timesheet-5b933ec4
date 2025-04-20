
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useEmployeeState = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: "Active"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch employees from Supabase on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching employees from Supabase...");
      const { data, error } = await supabase
        .from('employees')
        .select('*');

      if (error) {
        throw error;
      }

      console.log("Employees data received:", data);
      
      if (data) {
        const formattedEmployees: Employee[] = data.map(emp => ({
          id: emp.id,
          fullName: emp.full_name,
          employeeId: emp.employee_id,
          project: emp.project,
          location: emp.location,
          jobTitle: emp.job_title,
          paymentType: emp.payment_type as PaymentType,
          rateOfPayment: emp.rate_of_payment,
          sponsorship: emp.sponsorship as SponsorshipType,
          status: emp.status as EmployeeStatus,
        }));
        
        console.log("Formatted employees:", formattedEmployees);
        setEmployees(formattedEmployees);
      }
    } catch (err: any) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Failed to fetch employees');
      toast.error("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    error,
    refreshEmployees: fetchEmployees
  };
};
