
import { AttendanceRecord } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceOperations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  // Get attendance record by ID
  const getAttendanceRecord = (id: string) => {
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
        // No data found error - return null instead of throwing
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
      const recordsToUpsert = records.map(record => ({
        id: 'id' in record ? record.id : undefined,
        employee_id: record.employeeId,
        date: record.date,
        present: record.present,
        start_time: record.startTime || null,
        end_time: record.endTime || null,
        overtime_hours: record.overtimeHours || 0,
        note: record.note || null
      }));

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(recordsToUpsert)
        .select();

      if (error) throw error;
      if (!data) throw new Error('No data returned from upsert');

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
    getAttendanceRecord,
    getRecordsByEmployeeAndDate,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    bulkSaveAttendance,
  };
};
