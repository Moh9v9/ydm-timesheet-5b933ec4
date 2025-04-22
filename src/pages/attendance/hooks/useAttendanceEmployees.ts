
import { useState, useEffect } from "react";
import { Employee } from "@/lib/types";
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

        // Next, get archived employees that have attendance records for the selected date
        const { data: archivedWithRecords, error: archivedError } = await supabase
          .rpc('get_archived_with_attendance', { selected_date: currentDate });
        
        // If the RPC function doesn't exist, fallback to a join query
        let archivedEmployeesWithRecords: any[] = [];
        
        if (archivedError) {
          console.warn("RPC function not available, falling back to join query");
          // Fallback to manual join query to find archived employees with attendance records
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('employees')
            .select(`
              *,
              attendance_records!inner(date)
            `)
            .eq('status', 'Archived')
            .eq('attendance_records.date', currentDate);
          
          if (fallbackError) throw fallbackError;
          
          // Remove the nested attendance_records data to match our Employee type
          archivedEmployeesWithRecords = fallbackData?.map(item => {
            const { attendance_records, ...employee } = item;
            return employee;
          }) || [];
        } else {
          archivedEmployeesWithRecords = archivedWithRecords || [];
        }

        // Format the employees data
        const formattedActiveEmployees = (activeEmployees || []).map(emp => ({
          id: emp.id,
          fullName: emp.full_name,
          iqamaNo: emp.iqama_no,
          project: emp.project,
          location: emp.location,
          jobTitle: emp.job_title,
          paymentType: emp.payment_type,
          rateOfPayment: emp.rate_of_payment,
          sponsorship: emp.sponsorship,
          status: emp.status,
          created_at: emp.created_at
        }));

        const formattedArchivedEmployees = archivedEmployeesWithRecords.map(emp => ({
          id: emp.id,
          fullName: emp.full_name,
          iqamaNo: emp.iqama_no,
          project: emp.project,
          location: emp.location,
          jobTitle: emp.job_title,
          paymentType: emp.payment_type,
          rateOfPayment: emp.rate_of_payment,
          sponsorship: emp.sponsorship,
          status: emp.status,
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
