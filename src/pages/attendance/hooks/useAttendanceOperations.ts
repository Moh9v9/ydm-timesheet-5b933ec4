
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";

type BulkUpdateData = {
  updateType: "presence" | "times";
  present: boolean;
  startTime: string;
  endTime: string;
  overtimeHours: number;
  note: string;
};

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
      success("Attendance data saved successfully");
      return result;
    } catch (err) {
      error("Failed to save attendance data");
      console.error("Save error:", err);
      throw err;
    }
  };

  // This handler now supports selective updating for "times"
  const handleBulkUpdate = async (
    attendanceData: AttendanceRecord[],
    data: BulkUpdateData
  ) => {
    const { updateType } = data;
    try {
      let updatedRecords: AttendanceRecord[] = [];
      if (updateType === "presence") {
        // Set presence for all, update all fields accordingly
        updatedRecords = attendanceData.map(record => ({
          ...record,
          present: data.present,
          startTime: data.present ? data.startTime : "",
          endTime: data.present ? data.endTime : "",
          overtimeHours: data.present ? data.overtimeHours : 0,
          note: data.note
        }));
      } else if (updateType === "times") {
        // Only update times for those currently present
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
      }
      await bulkSaveAttendance(updatedRecords);
      success("All attendance records updated successfully");
      return updatedRecords;
    } catch (err) {
      error("Failed to update attendance records");
      console.error(err);
      throw err;
    }
  };

  return {
    handleSave,
    confirmSave,
    handleBulkUpdate
  };
};
