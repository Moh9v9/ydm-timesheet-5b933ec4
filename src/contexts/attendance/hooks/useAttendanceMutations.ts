
import { AttendanceRecord } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceMutations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  // Add new attendance record
  const addAttendanceRecord = async (record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          employee_id: record.employeeId,
          date: record.date,
          present: record.present,
          start_time: record.startTime || null,
          end_time: record.endTime || null,
          overtime_hours: record.overtimeHours || 0,
          note: record.note || null
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from insert');

      const newRecord: AttendanceRecord = {
        id: data.id,
        employeeId: data.employee_id,
        date: data.date,
        present: data.present,
        startTime: data.start_time || '',
        endTime: data.end_time || '',
        overtimeHours: data.overtime_hours || 0,
        note: data.note || ''
      };

      setAttendanceRecords([...attendanceRecords, newRecord]);
      return newRecord;
    } catch (err) {
      console.error('Error adding attendance record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update attendance record
  const updateAttendanceRecord = async (
    id: string,
    record: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .update({
          present: record.present,
          start_time: record.startTime || null,
          end_time: record.endTime || null,
          overtime_hours: record.overtimeHours || 0,
          note: record.note || null
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      const updatedRecord: AttendanceRecord = {
        id: data.id,
        employeeId: data.employee_id,
        date: data.date,
        present: data.present,
        startTime: data.start_time || '',
        endTime: data.end_time || '',
        overtimeHours: data.overtime_hours || 0,
        note: data.note || ''
      };

      setAttendanceRecords(
        attendanceRecords.map(record => 
          record.id === id ? updatedRecord : record
        )
      );
      
      return updatedRecord;
    } catch (err) {
      console.error('Error updating attendance record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addAttendanceRecord,
    updateAttendanceRecord
  };
};
