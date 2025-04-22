
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
        
        console.log(`Processing record: ${recordId || 'new'} - Note: "${record.note || ''}"`);
        
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

      // First, handle records with IDs - we'll use update for these to ensure note changes are saved
      const recordsWithIds = dbRecords.filter(record => record.id !== undefined);
      const recordsWithoutIds = dbRecords.filter(record => record.id === undefined);
      
      console.log(`Processing ${recordsWithIds.length} records with IDs and ${recordsWithoutIds.length} new records`);
      
      let savedRecordsResults: any[] = [];
      
      // Handle existing records first (with IDs) - Process one by one to ensure updates work properly
      if (recordsWithIds.length > 0) {
        for (const record of recordsWithIds) {
          console.log(`Updating record ID: ${record.id}, Note: "${record.note || ''}"`);
          
          const updateData = {
            employee_name: record.employee_name,
            present: record.present,
            start_time: record.start_time,
            end_time: record.end_time,
            overtime_hours: record.overtime_hours,
            note: record.note
          };
          
          console.log(`Update data for record ${record.id}:`, updateData);
          
          const { data, error } = await supabase
            .from('attendance_records')
            .update(updateData)
            .eq('id', record.id)
            .select();
            
          if (error) {
            console.error(`Error updating record ID ${record.id}:`, error);
          } else if (data) {
            console.log(`Successfully updated record ID ${record.id}:`, data);
            savedRecordsResults = [...savedRecordsResults, ...data];
          }
        }
      }
      
      // Handle new records (without IDs)
      if (recordsWithoutIds.length > 0) {
        console.log(`Inserting ${recordsWithoutIds.length} new records`);
        const { data, error } = await supabase
          .from('attendance_records')
          .insert(recordsWithoutIds)
          .select();
          
        if (error) {
          console.error('Error inserting new records:', error);
        } else if (data) {
          console.log(`Successfully inserted ${data.length} new records:`, data);
          savedRecordsResults = [...savedRecordsResults, ...data];
        }
      }
      
      console.log(`Total saved records: ${savedRecordsResults.length}`);

      if (!savedRecordsResults || savedRecordsResults.length === 0) {
        console.warn('⚠️ No data returned after saving attendance records');
        return [];
      }

      console.log(`✅ Successfully saved ${savedRecordsResults.length} attendance records:`, savedRecordsResults);
      
      // Convert DB records back to our UI format
      const savedRecords: AttendanceRecord[] = savedRecordsResults.map(record => ({
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
