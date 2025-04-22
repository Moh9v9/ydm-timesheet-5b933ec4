
import { Dispatch, SetStateAction } from "react";
import { AttendanceRecord, Employee } from "@/lib/types";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAttendance } from "@/contexts/AttendanceContext";

export const useAttendanceFetch = (
  refreshTrigger: number,
  attendanceEmployees: Employee[],
  employeesLoading: boolean,
  setAttendanceData: Dispatch<SetStateAction<AttendanceRecord[]>>,
  setLastFetchedDate: Dispatch<SetStateAction<string>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHasAttemptedFetch: Dispatch<SetStateAction<boolean>>
) => {
  const { currentDate } = useAttendance();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (employeesLoading || !currentDate) {
        return;
      }

      setIsLoading(true);
      console.log(`📅 Fetching attendance records for ${currentDate} - Refresh trigger: ${refreshTrigger}`);

      try {
        const { data: records, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', currentDate);

        if (error) {
          console.error(`❌ Error fetching attendance records for ${currentDate}:`, error);
          return;
        }

        console.log(`📊 Retrieved ${records?.length || 0} attendance records for date ${currentDate}:`, records);

        if (!records || records.length === 0) {
          console.log(`ℹ️ No attendance records found for ${currentDate}. Setting empty array.`);
          setAttendanceData([]);
          setLastFetchedDate(currentDate);
          setHasAttemptedFetch(true);
          return;
        }

        const formattedRecords: AttendanceRecord[] = records.map(record => ({
          id: record.id,
          employeeId: record.employee_uuid,
          employeeName: record.employee_name || '',
          date: record.date,
          present: record.present,
          startTime: record.start_time || '',
          endTime: record.end_time || '',
          overtimeHours: record.overtime_hours || 0,
          note: record.note || ''
        }));

        console.log(`✅ Formatted ${formattedRecords.length} records for UI display`);
        setAttendanceData(formattedRecords);
        setLastFetchedDate(currentDate);
        setHasAttemptedFetch(true);
      } catch (err) {
        console.error(`❌ Unexpected error fetching attendance records:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [
    currentDate,
    refreshTrigger,
    attendanceEmployees,
    employeesLoading,
    setAttendanceData,
    setLastFetchedDate,
    setIsLoading,
    setHasAttemptedFetch
  ]);
};
