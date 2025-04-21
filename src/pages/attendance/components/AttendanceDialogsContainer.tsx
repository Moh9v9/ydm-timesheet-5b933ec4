
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
  // New controlled props
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

  // Pass the needed callbacks and values to AttendanceDialogs
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
            refreshData(); // Refresh data after bulk update
            if (onSuccessfulSave) onSuccessfulSave();
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }}
      onConfirmSave={async () => {
        setIsSubmitting(true);
        try {
          await confirmSave(attendanceData);
          refreshData(); // Refresh data after save
          if (onSuccessfulSave) onSuccessfulSave();
        } finally {
          setIsSubmitting(false);
        }
      }}
      attendanceData={attendanceData}
      isSubmitting={isSubmitting}
    />
  );
};

export default AttendanceDialogsContainer;
