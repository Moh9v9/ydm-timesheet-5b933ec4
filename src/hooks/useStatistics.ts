
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { AttendanceRecord } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}

const getTodayAttendanceRecords = (
  attendanceRecords: AttendanceRecord[],
  date: string
): AttendanceRecord[] => {
  return attendanceRecords.filter((record) => record.date === date);
};

const calculateAttendanceCounts = (records: AttendanceRecord[]) => {
  const presentCount = records.filter((record) => record.present).length;
  const absentCount = records.filter((record) => !record.present).length;
  
  return {
    presentCount,
    absentCount
  };
};

export const useStatistics = (selectedDate: string) => {
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });

  useEffect(() => {
    const fetchDirectFromDatabase = async () => {
      try {
        console.log("useStatistics - Fetching data for date:", selectedDate);
        
        // Force to use today's date to ensure we're getting current data
        const today = new Date().toISOString().split('T')[0];
        
        // Get records directly from Supabase for today's date
        const { data, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', today);
        
        if (error) {
          console.error("Error fetching attendance stats:", error);
          throw error;
        }

        console.log(`useStatistics - Retrieved ${data?.length || 0} records for ${today}`);

        const formattedRecords: AttendanceRecord[] = (data || []).map(record => ({
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
        
        const { presentCount, absentCount } = calculateAttendanceCounts(formattedRecords);

        setStats({
          totalEmployees: filteredEmployees?.length || 0,
          presentToday: presentCount,
          absentToday: absentCount,
        });
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
        
        // Fallback to using context records if database fetch fails
        const records = attendanceRecords || [];
        const today = new Date().toISOString().split('T')[0];
        const todayRecords = getTodayAttendanceRecords(records, today); // Use today's date for fallback too
        const { presentCount, absentCount } = calculateAttendanceCounts(todayRecords);

        setStats({
          totalEmployees: filteredEmployees?.length || 0,
          presentToday: presentCount,
          absentToday: absentCount,
        });
      }
    };

    fetchDirectFromDatabase();
    
    // Set up a refresh interval to fetch data every minute
    const intervalId = setInterval(fetchDirectFromDatabase, 60000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [filteredEmployees, attendanceRecords, selectedDate]);

  return stats;
};
