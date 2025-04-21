
import { useState } from "react";
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
      
      // Prepare data for saving by making a clean copy
      const cleanData = attendanceData.map(record => ({
        ...(record.id && !record.id.toString().includes('temp_') ? { id: record.id } : {}),
        employeeId: record.employeeId,
        employeeName: record.employeeName,
        date: record.date,
        present: record.present,
        startTime: record.startTime,
        endTime: record.endTime,
        overtimeHours: record.overtimeHours,
        note: record.note
      }));

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

  // Now accept updateType and only update present employees if updateType is "times"
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
                note: data.note
              }
            : record
        );
      } else {
        // Update all
        updatedRecords = attendanceData.map(record => ({
          ...record,
          present: data.present,
          startTime: data.present ? data.startTime : "",
          endTime: data.present ? data.endTime : "",
          overtimeHours: data.present ? data.overtimeHours : 0,
          note: data.note
        }));
      }

      console.log("Bulk update - saving", updatedRecords.length, "records");
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
