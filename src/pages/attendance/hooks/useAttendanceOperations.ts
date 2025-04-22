import { AttendanceRecord } from "@/lib/types";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";

export const useAttendanceOperations = (canEdit: boolean) => {
  const { bulkSaveAttendance } = useAttendance();
  const { success, error } = useNotification();

  const handleSave = () => {
    if (!canEdit) {
      error("You don't have permission to edit attendance records");
      return false;
    }
    return true;
  };

  const confirmSave = async (attendanceData: AttendanceRecord[]) => {
    try {
      console.log("Starting save process with", attendanceData.length, "records");
      
      // Log notes specifically to debug
      attendanceData.forEach((record, index) => {
        console.log(`Record ${index + 1} before save - ID: ${record.id}, Employee: ${record.employeeName}, Present: ${record.present}, Note: "${record.note}"`);
      });
      
      // Make sure we properly identify existing records with IDs
      const cleanData = attendanceData.map(record => {
        // Create a new object to avoid mutation
        const cleanRecord = { ...record };
        
        // If it's a temporary ID, remove it so a new one will be generated
        if (cleanRecord.id && cleanRecord.id.toString().includes('temp_')) {
          delete (cleanRecord as any).id;
        }
        
        // Ensure note is properly formatted for saving - NEVER set to undefined
        // Use empty string instead of undefined to ensure updates work correctly
        cleanRecord.note = cleanRecord.note !== undefined ? cleanRecord.note : '';
        
        return cleanRecord;
      });

      console.log("Sending attendance data to save:", cleanData);
      const result = await bulkSaveAttendance(cleanData);
      console.log("Save result:", result);
      
      if (!result || result.length === 0) {
        throw new Error("No data returned from save operation");
      }
      
      success("Attendance data saved successfully");
      return result;
    } catch (err) {
      console.error("Save error:", err);
      error("Failed to save attendance data");
      throw err;
    }
  };

  const handleBulkUpdate = async (
    attendanceData: AttendanceRecord[],
    data: {
      updateType: "presence" | "times";
      present: boolean;
      startTime: string;
      endTime: string;
      overtimeHours: number;
      note: string;
    }
  ) => {
    try {
      console.log("Bulk update - starting with data:", data);
      
      let updatedRecords: AttendanceRecord[];
      if (data.updateType === "times") {
        // Only update records where present is true
        updatedRecords = attendanceData.map(record =>
          record.present
            ? {
                ...record,
                startTime: data.startTime,
                endTime: data.endTime,
                overtimeHours: data.overtimeHours,
                // Preserve note if no new note provided
                note: data.note || record.note || ''
              }
            : record
        );
      } else {
        // Update all records - preserve existing notes for absent employees if data.note is empty
        updatedRecords = attendanceData.map(record => {
          // Always keep existing note if new note is empty, regardless of presence state
          const shouldKeepExistingNote = !data.note && record.note;
          const noteToUse = shouldKeepExistingNote ? record.note : data.note;
          
          return {
            ...record,
            present: data.present,
            startTime: data.present ? data.startTime : "",
            endTime: data.present ? data.endTime : "",
            overtimeHours: data.present ? data.overtimeHours : 0,
            // Critical: Ensure note is preserved for absent employees
            note: noteToUse || ''
          };
        });
      }

      console.log("Bulk update - records to save:", updatedRecords.length);
      
      // Log notes before saving
      updatedRecords.forEach((record, index) => {
        console.log(`Record ${index + 1} before bulk save - ID: ${record.id}, Employee: ${record.employeeName}, Present: ${record.present}, Note: "${record.note}"`);
      });
      
      const result = await bulkSaveAttendance(updatedRecords);
      success("All attendance records updated successfully");
      return result;
    } catch (err) {
      console.error("Bulk update error:", err);
      error("Failed to update attendance records");
      throw err;
    }
  };

  return {
    handleSave,
    confirmSave,
    handleBulkUpdate
  };
};
