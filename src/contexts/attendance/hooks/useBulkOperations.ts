
import { AttendanceRecord } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useBulkOperations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  // Delete attendance record
  const deleteAttendanceRecord = async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
    } catch (err) {
      console.error('Error deleting attendance record:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bulk save attendance records
  const bulkSaveAttendance = async (
    records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]
  ): Promise<AttendanceRecord[]> => {
    setLoading(true);
    
    try {
      const recordsToUpsert = records.map(record => {
        let recordId = null;
        if ('id' in record && !record.id.toString().includes('temp_')) {
          recordId = record.id;
        }
        
        return {
          ...(recordId ? { id: recordId } : {}),
          employee_id: record.employeeId,
          date: record.date,
          present: record.present,
          start_time: record.startTime || null,
          end_time: record.endTime || null,
          overtime_hours: record.overtimeHours || 0,
          note: record.note || null
        };
      });

      console.log("Records prepared for upsert:", recordsToUpsert);

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(recordsToUpsert)
        .select();

      if (error) throw error;
      if (!data) throw new Error('No data returned from upsert');

      console.log("Upsert response:", data);

      const savedRecords: AttendanceRecord[] = data.map(record => ({
        id: record.id,
        employeeId: record.employee_id,
        date: record.date,
        present: record.present,
        startTime: record.start_time || '',
        endTime: record.end_time || '',
        overtimeHours: record.overtime_hours || 0,
        note: record.note || ''
      }));

      setAttendanceRecords(savedRecords);
      return savedRecords;
    } catch (err) {
      console.error('Error bulk saving attendance records:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAttendanceRecord,
    bulkSaveAttendance
  };
};
