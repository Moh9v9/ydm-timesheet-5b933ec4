
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
      
      // Separate records for insert and update to handle ID constraints correctly
      const recordsToUpdate = [];
      const recordsToInsert = [];
      
      for (const record of validRecords) {
        // Check if the record has a valid ID (not temp ID)
        if ('id' in record && record.id && !record.id.toString().includes('temp_')) {
          // This is an existing record that should be updated
          recordsToUpdate.push({
            id: record.id,
            employee_uuid: record.employeeId,
            employee_name: record.employeeName,
            date: record.date,
            present: record.present,
            start_time: record.startTime || null,
            end_time: record.endTime || null,
            overtime_hours: record.overtimeHours || 0,
            note: record.note || null
          });
        } else {
          // This is a new record that should be inserted
          recordsToInsert.push({
            employee_uuid: record.employeeId,
            employee_name: record.employeeName,
            date: record.date,
            present: record.present,
            start_time: record.startTime || null,
            end_time: record.endTime || null,
            overtime_hours: record.overtimeHours || 0,
            note: record.note || null
          });
        }
      }

      console.log("Records separated - Updates:", recordsToUpdate.length, "Inserts:", recordsToInsert.length);
      
      // Variable to store all saved records
      let resultData = [];
      
      // If we have records to update, update them
      if (recordsToUpdate.length > 0) {
        console.log("Updating existing records:", recordsToUpdate.length);
        const { data: updatedData, error: updateError } = await supabase
          .from('attendance_records')
          .upsert(recordsToUpdate, {
            onConflict: 'id',
            ignoreDuplicates: false
          })
          .select();
          
        if (updateError) {
          console.error("Error updating records:", updateError);
          throw updateError;
        }
        
        if (updatedData && updatedData.length > 0) {
          resultData = [...resultData, ...updatedData];
        }
      }
      
      // If we have records to insert, insert them
      if (recordsToInsert.length > 0) {
        console.log("Inserting new records:", recordsToInsert.length);
        const { data: insertedData, error: insertError } = await supabase
          .from('attendance_records')
          .insert(recordsToInsert)
          .select();
          
        if (insertError) {
          console.error("Error inserting records:", insertError);
          throw insertError;
        }
        
        if (insertedData && insertedData.length > 0) {
          resultData = [...resultData, ...insertedData];
        }
      }
      
      // If no data returned, try to fetch all records for these dates
      if (!resultData || resultData.length === 0) {
        console.log("No data returned from operations, fetching current state");
        
        // Get a list of dates we were trying to update
        const dates = Array.from(new Set(records.map(r => r.date)));
        
        // Fetch the current state for these dates
        const { data: fetchedData, error: fetchError } = await supabase
          .from('attendance_records')
          .select('*')
          .in('date', dates);
          
        if (fetchError) {
          console.error("Error fetching records after operations:", fetchError);
          throw fetchError;
        }
        
        if (fetchedData && fetchedData.length > 0) {
          resultData = fetchedData;
        } else {
          console.error("Failed to retrieve updated records");
          throw new Error('Failed to retrieve updated records');
        }
      }

      console.log("Operations successful with", resultData.length, "records returned");

      const savedRecords: AttendanceRecord[] = resultData.map(record => ({
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
