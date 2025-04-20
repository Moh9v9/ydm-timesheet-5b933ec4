
import { AttendanceRecord } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceQueries = () => {
  // Get attendance record by ID
  const getAttendanceRecord = (attendanceRecords: AttendanceRecord[], id: string) => {
    return attendanceRecords.find(record => record.id === id);
  };

  // Get attendance record by employee ID and date
  const getRecordsByEmployeeAndDate = async (employeeId: string, date: string): Promise<AttendanceRecord | null> => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching attendance record:', error);
      return null;
    }

    return data ? {
      id: data.id,
      employeeId: data.employee_id,
      date: data.date,
      present: data.present,
      startTime: data.start_time || '',
      endTime: data.end_time || '',
      overtimeHours: data.overtime_hours || 0,
      note: data.note || ''
    } : null;
  };

  return {
    getAttendanceRecord,
    getRecordsByEmployeeAndDate,
  };
};
