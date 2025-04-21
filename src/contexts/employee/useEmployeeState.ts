
import { useState, useEffect } from "react";
import { Employee, EmployeeFilters, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Added new optional param (currentAttendanceDate as ISO string)
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

      if (error) {
        throw error;
      }

      console.log("🔍 Employees data received:", data);

      if (data && data.length > 0) {
        const formattedEmployees: Employee[] = data.map(emp => ({
          id: emp.id,
          fullName: emp.full_name,
          iqamaNo: emp.iqama_no !== null ? Number(emp.iqama_no) : 0,
          project: emp.project,
          location: emp.location,
          jobTitle: emp.job_title,
          paymentType: emp.payment_type as PaymentType,
          rateOfPayment: emp.rate_of_payment,
          sponsorship: emp.sponsorship as SponsorshipType,
          status: emp.status as EmployeeStatus,
          created_at: emp.created_at // Pass through created_at for filtering
        }));
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
  const filteredEmployees = employees.filter(employee => {
    // Must be created on or before currentAttendanceDate if provided
    if (currentAttendanceDate && employee.created_at) {
      // string compare should be safe for ISO
      if (employee.created_at > currentAttendanceDate) return false;
    }
    if (filters.status && employee.status !== filters.status) return false;
    if (filters.project && employee.project !== filters.project) return false;
    if (filters.location && employee.location !== filters.location) return false;
    if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
    if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
    return true;
  });

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
