
import { useState, useEffect } from "react";
import { Employee, PaymentType, SponsorshipType, EmployeeStatus } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook to fetch and filter employees specifically for the attendance table
 * - Always shows active employees
 * - Only shows archived employees if they have an attendance record for the selected date
 */
export const useAttendanceEmployees = (currentDate: string) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("useAttendanceEmployees - Fetching employees for date:", currentDate);
        
        // First, get all active employees
        const { data: activeEmployees, error: activeError } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'Active')
          .order('full_name');
          
        if (activeError) throw activeError;

        // Instead of using rpc, we'll use a join query to get archived employees with attendance records
        const { data: archivedWithRecords, error: archivedError } = await supabase
          .from('employees')
          .select(`
            *,
            attendance_records!inner(date)
          `)
          .eq('status', 'Archived')
          .eq('attendance_records.date', currentDate);
        
        if (archivedError) throw archivedError;
        
        // Remove the nested attendance_records data to match our Employee type
        const archivedEmployeesWithRecords = archivedWithRecords?.map(item => {
          const { attendance_records, ...employee } = item;
          return employee;
        }) || [];

        // Format the employees data with proper type casting
        const formattedActiveEmployees = (activeEmployees || []).map(emp => ({
          id: emp.id,
          fullName: emp.full_name,
          iqamaNo: emp.iqama_no,
          project: emp.project,
          location: emp.location,
          jobTitle: emp.job_title,
          paymentType: emp.payment_type as PaymentType,
          rateOfPayment: emp.rate_of_payment,
          sponsorship: emp.sponsorship as SponsorshipType,
          status: emp.status as EmployeeStatus,
          created_at: emp.created_at
        }));

        const formattedArchivedEmployees = archivedEmployeesWithRecords.map(emp => ({
          id: emp.id,
          fullName: emp.full_name,
          iqamaNo: emp.iqama_no,
          project: emp.project,
          location: emp.location,
          jobTitle: emp.job_title,
          paymentType: emp.payment_type as PaymentType,
          rateOfPayment: emp.rate_of_payment,
          sponsorship: emp.sponsorship as SponsorshipType,
          status: emp.status as EmployeeStatus,
          created_at: emp.created_at
        }));

        // Combine active and archived employees with records
        const combinedEmployees = [...formattedActiveEmployees, ...formattedArchivedEmployees];
        
        // Filter out employees created after the selected date
        const filteredEmployees = combinedEmployees.filter(emp => {
          if (!emp.created_at) return true;
          const employeeCreationDate = emp.created_at.split('T')[0];
          return employeeCreationDate <= currentDate;
        });

        console.log(`useAttendanceEmployees - Found ${formattedActiveEmployees.length} active employees`);
        console.log(`useAttendanceEmployees - Found ${formattedArchivedEmployees.length} archived employees with records for ${currentDate}`);
        console.log(`useAttendanceEmployees - Final filtered count: ${filteredEmployees.length}`);
        
        setEmployees(filteredEmployees);
      } catch (err) {
        console.error('Error fetching attendance employees:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceEmployees();
  }, [currentDate]);

  return {
    attendanceEmployees: employees,
    loading,
    error
  };
};
