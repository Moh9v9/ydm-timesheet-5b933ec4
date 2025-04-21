
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
      console.log("Starting bulk save operation with", records.length, "records");
      
      // Filter out any invalid records without employeeId or date
      const validRecords = records.filter(record => record.employeeId && record.date);
      
      if (validRecords.length === 0) {
        console.error("No valid records to save");
        throw new Error("No valid records to save");
      }
      
      const recordsToUpsert = validRecords.map(record => {
        let recordId = null;
        if ('id' in record && record.id && !record.id.toString().includes('temp_')) {
          recordId = record.id;
        }
        
        return {
          ...(recordId ? { id: recordId } : {}),
          employee_uuid: record.employeeId,
          employee_name: record.employeeName,
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
        .upsert(recordsToUpsert, { 
          onConflict: 'employee_uuid,date',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error("Error during upsert:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        // If no data is returned but also no error, try to get the current state
        console.log("No data returned from upsert, fetching current state");
        
        // Get a list of dates we were trying to update
        const dates = Array.from(new Set(records.map(r => r.date)));
        
        // Fetch the current state for these dates
        const { data: fetchedData, error: fetchError } = await supabase
          .from('attendance_records')
          .select('*')
          .in('date', dates);
          
        if (fetchError) {
          console.error("Error fetching records after upsert:", fetchError);
          throw fetchError;
        }
        
        if (fetchedData) {
          data = fetchedData;
        } else {
          console.error("Failed to retrieve updated records");
          throw new Error('Failed to retrieve updated records');
        }
      }

      console.log("Upsert/fetch successful with", data.length, "records returned");

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

      console.log("Transformed records for state update:", savedRecords.length);
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
