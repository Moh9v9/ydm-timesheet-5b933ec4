
import { useState } from "react";
import AttendanceDialogs from "./AttendanceDialogs";
import { AttendanceRecord } from "@/lib/types";
import { useAttendanceOperations } from "../hooks/useAttendanceOperations";
import { useAttendance } from "@/contexts/AttendanceContext";

interface AttendanceDialogsContainerProps {
  attendanceData: AttendanceRecord[];
  canEdit: boolean;
  onSuccessfulSave?: () => void;
  // Add new props for controlling dialogs from parent
  showBulkUpdate: boolean;
  setShowBulkUpdate: (show: boolean) => void;
  showSaveConfirm: boolean;
  setShowSaveConfirm: (show: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
}

const AttendanceDialogsContainer = ({
  attendanceData,
  canEdit,
  onSuccessfulSave,
  showBulkUpdate,
  setShowBulkUpdate,
  showSaveConfirm,
  setShowSaveConfirm,
  isSubmitting,
  setIsSubmitting
}: AttendanceDialogsContainerProps) => {
  const { refreshData } = useAttendance();
  const {
    handleSave,
    confirmSave,
    handleBulkUpdate
  } = useAttendanceOperations(canEdit);

  const handleConfirmSave = async () => {
    if (!canEdit || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Starting confirm save with", attendanceData.length, "records");
      const result = await confirmSave(attendanceData);
      console.log("Save completed, refreshing data");
      refreshData();
      if (onSuccessfulSave) {
        onSuccessfulSave();
      }
      setShowSaveConfirm(false);
    } catch (err) {
      console.error("Error during save:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AttendanceDialogs
      showBulkUpdate={showBulkUpdate}
      setShowBulkUpdate={setShowBulkUpdate}
      showSaveConfirm={showSaveConfirm}
      setShowSaveConfirm={setShowSaveConfirm}
      onBulkUpdateConfirm={(data: any) => {
        setIsSubmitting(true);
        handleBulkUpdate(attendanceData, data)
          .then(() => {
            setShowBulkUpdate(false);
            refreshData();
            if (onSuccessfulSave) onSuccessfulSave();
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }}
      onConfirmSave={handleConfirmSave}
      attendanceData={attendanceData}
      isSubmitting={isSubmitting}
    />
  );
};

export default AttendanceDialogsContainer;
