
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
      console.log(`Deleting attendance record with ID: ${id}`);
      const { error } = await supabase
        .from('attendance_records')
        .delete()
        .match({ id });

      if (error) {
        console.error('Error deleting attendance record:', error);
        return;
      }

      // Update local state
      const updatedRecords = attendanceRecords.filter(record => record.id !== id);
      setAttendanceRecords(updatedRecords);
      console.log(`Successfully deleted attendance record with ID: ${id}`);
    } catch (error) {
      console.error('Error deleting attendance record:', error);
    } finally {
      setLoading(false);
    }
  };

  // Bulk save attendance records
  const bulkSaveAttendance = async (records: AttendanceRecord[]): Promise<AttendanceRecord[]> => {
    setLoading(true);
    
    try {
      console.log(`🔄 Bulk saving ${records.length} attendance records`);
      console.log("Records to save:", records);
      
      // Create DB records from our UI records
      const dbRecords = records.map(record => {
        // Skip temporary IDs
        const recordId = record.id && !record.id.toString().includes('temp-') ? record.id : undefined;
        
        return {
          id: recordId,
          employee_uuid: record.employeeId,
          employee_name: record.employeeName,
          date: record.date,
          present: record.present,
          start_time: record.startTime,
          end_time: record.endTime,
          overtime_hours: record.overtimeHours,
          note: record.note
        };
      });
      
      console.log("Transformed DB records for saving:", dbRecords);

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(dbRecords, { 
          onConflict: 'employee_uuid, date',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('❌ Error saving attendance records:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ No data returned after saving attendance records');
        return [];
      }

      console.log(`✅ Successfully saved ${data.length} attendance records:`, data);
      
      // Convert DB records back to our UI format
      const savedRecords: AttendanceRecord[] = data.map(record => ({
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

      return savedRecords;
    } catch (error) {
      console.error('❌ Error in bulkSaveAttendance:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAttendanceRecord,
    bulkSaveAttendance,
  };
};
