
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
        
        console.log(`Processing record: ${recordId || 'new'} - Employee: ${record.employeeName} - Present: ${record.present} - Note: "${record.note || ''}"`);
        
        return {
          id: recordId,
          employee_uuid: record.employeeId,
          employee_name: record.employeeName,
          date: record.date,
          present: record.present,
          start_time: record.startTime,
          end_time: record.endTime,
          overtime_hours: record.overtimeHours,
          // Critical fix: Always pass the note value, even for absent employees
          note: record.note !== undefined ? record.note : null
        };
      });
      
      console.log("Transformed DB records for saving:", dbRecords);

      // First, handle records with IDs - we'll process them individually to ensure updates work correctly
      const recordsWithIds = dbRecords.filter(record => record.id !== undefined);
      const recordsWithoutIds = dbRecords.filter(record => record.id === undefined);
      
      console.log(`Processing ${recordsWithIds.length} records with IDs and ${recordsWithoutIds.length} new records`);
      
      let savedRecordsResults: any[] = [];
      
      // Handle existing records first (with IDs) - Process one by one for better error handling
      if (recordsWithIds.length > 0) {
        for (const record of recordsWithIds) {
          console.log(`Updating record ID: ${record.id}, Employee: ${record.employee_name}, Present: ${record.present}, Note: "${record.note || ''}"`);
          
          // Explicitly define all fields to ensure nothing is missed during updates
          const updateData = {
            employee_name: record.employee_name,
            present: record.present,
            start_time: record.start_time,
            end_time: record.end_time,
            overtime_hours: record.overtime_hours,
            // Always include note value in the update
            note: record.note
          };
          
          console.log(`Update data for record ${record.id}:`, updateData);
          
          // Try the update operation first
          const { data, error } = await supabase
            .from('attendance_records')
            .update(updateData)
            .eq('id', record.id)
            .select();
            
          if (error) {
            console.error(`Error updating record ID ${record.id}:`, error);
            console.log(`Will try upsert as fallback for record ID ${record.id}`);
            
            // If update fails, try upsert as a fallback
            const upsertResult = await supabase
              .from('attendance_records')
              .upsert({
                ...record // Include all fields with ID to force upsert
              })
              .select();
              
            if (upsertResult.error) {
              console.error(`Fallback upsert also failed for record ID ${record.id}:`, upsertResult.error);
            } else if (upsertResult.data) {
              console.log(`Successfully used fallback upsert for record ID ${record.id}:`, upsertResult.data);
              savedRecordsResults = [...savedRecordsResults, ...upsertResult.data];
            }
          } else if (data) {
            console.log(`Successfully updated record ID ${record.id}:`, data);
            savedRecordsResults = [...savedRecordsResults, ...data];
          }
        }
      }
      
      // Handle new records (without IDs)
      if (recordsWithoutIds.length > 0) {
        console.log(`Inserting ${recordsWithoutIds.length} new records`);
        
        // Ensure all fields are properly formatted before insertion
        const preparedRecords = recordsWithoutIds;
        
        const { data, error } = await supabase
          .from('attendance_records')
          .insert(preparedRecords)
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
        // Ensure note is never undefined in the UI state
        note: record.note !== null ? record.note || '' : ''
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
