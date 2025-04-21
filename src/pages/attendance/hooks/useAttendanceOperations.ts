
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";

export const useAttendanceOperations = (canEdit: boolean) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const { bulkSaveAttendance } = useAttendance();
  const { success, error } = useNotification();

  const handleSave = () => {
    if (!canEdit) {
      error("You don't have permission to edit attendance records");
      return;
    }
    setShowSaveConfirm(true);
  };

  const confirmSave = async (attendanceData: AttendanceRecord[]) => {
    setIsSubmitting(true);
    
    try {
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
      success("Attendance data saved successfully");
      setShowSaveConfirm(false);
    } catch (err) {
      error("Failed to save attendance data");
      console.error("Save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAll = () => {
    if (!canEdit) {
      error("You don't have permission to update attendance records");
      return;
    }
    setShowBulkUpdate(true);
  };

  // Fixed the function signature to make it work with the container component
  const handleBulkUpdate = async (
    attendanceData: AttendanceRecord[],
    data: {
      present: boolean;
      startTime: string;
      endTime: string;
      overtimeHours: number;
      note: string;
    }
  ) => {
    setIsSubmitting(true);
    
    try {
      const updatedRecords = attendanceData.map(record => ({
        ...record,
        present: data.present,
        startTime: data.startTime,
        endTime: data.endTime,
        overtimeHours: data.overtimeHours,
        note: data.note
      }));
      
      await bulkSaveAttendance(updatedRecords);
      success("All attendance records updated successfully");
      setShowBulkUpdate(false);
    } catch (err) {
      error("Failed to update attendance records");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to manually refresh data
  const refreshData = () => {
    // This function is a placeholder that will trigger a refresh in the parent component
  };

  return {
    isSubmitting,
    showBulkUpdate,
    setShowBulkUpdate,
    showSaveConfirm,
    setShowSaveConfirm,
    handleSave,
    confirmSave,
    handleUpdateAll,
    handleBulkUpdate,
    refreshData
  };
};
