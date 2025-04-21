
import { useState } from "react";
import AttendanceDialogs from "./AttendanceDialogs";
import { AttendanceRecord } from "@/lib/types";
import { useAttendanceOperations } from "../hooks/useAttendanceOperations";

interface AttendanceDialogsContainerProps {
  attendanceData: AttendanceRecord[];
  canEdit: boolean;
  onSuccessfulSave?: () => void;
}

const AttendanceDialogsContainer = ({
  attendanceData,
  canEdit,
  onSuccessfulSave
}: AttendanceDialogsContainerProps) => {
  const {
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
  } = useAttendanceOperations(canEdit);

  // Pass the needed callbacks and values to AttendanceDialogs
  return (
    <AttendanceDialogs
      showBulkUpdate={showBulkUpdate}
      setShowBulkUpdate={setShowBulkUpdate}
      showSaveConfirm={showSaveConfirm}
      setShowSaveConfirm={setShowSaveConfirm}
      onBulkUpdateConfirm={(data: any) => handleBulkUpdate(attendanceData, data)}
      onConfirmSave={async () => {
        await confirmSave(attendanceData);
        if (onSuccessfulSave) onSuccessfulSave();
      }}
      attendanceData={attendanceData}
      isSubmitting={isSubmitting}
    />
  );
};

export default AttendanceDialogsContainer;
