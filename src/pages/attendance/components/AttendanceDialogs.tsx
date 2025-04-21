
import BulkUpdateDialog from "./BulkUpdateDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { AttendanceRecord } from "@/lib/types";

interface AttendanceDialogsProps {
  showBulkUpdate: boolean;
  setShowBulkUpdate: (open: boolean) => void;
  showSaveConfirm: boolean;
  setShowSaveConfirm: (open: boolean) => void;
  onBulkUpdateConfirm: (data: any) => void;
  onConfirmSave: () => void;
  attendanceData: AttendanceRecord[];
  isSubmitting: boolean;
}

const AttendanceDialogs = ({
  showBulkUpdate,
  setShowBulkUpdate,
  showSaveConfirm,
  setShowSaveConfirm,
  onBulkUpdateConfirm,
  onConfirmSave,
  attendanceData,
  isSubmitting,
}: AttendanceDialogsProps) => (
  <>
    <BulkUpdateDialog
      open={showBulkUpdate}
      onClose={() => setShowBulkUpdate(false)}
      onConfirm={data => onBulkUpdateConfirm(attendanceData, data)}
    />
    <ConfirmDialog
      open={showSaveConfirm}
      onOpenChange={setShowSaveConfirm}
      onConfirm={onConfirmSave}
      title="Save Attendance Records"
      description="Are you sure you want to save these attendance records? This action cannot be undone."
      confirmText={isSubmitting ? "Saving..." : "Save Records"}
    />
  </>
);

export default AttendanceDialogs;
