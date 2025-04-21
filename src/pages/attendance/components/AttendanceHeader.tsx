
import ActionButtons from "./header/ActionButtons";
import PageTitle from "./header/PageTitle";

interface AttendanceHeaderProps {
  canEdit: boolean;
  canViewAttendance: boolean;
  isSubmitting: boolean;
  onUpdateAll: () => void;
  onSave: () => void;
  onRefresh?: () => void;
}

const AttendanceHeader = ({
  canEdit,
  canViewAttendance,
  isSubmitting,
  onUpdateAll,
  onSave,
  onRefresh,
}: AttendanceHeaderProps) => {
  // Show ActionButtons if user can edit (full controls) OR can view attendance (refresh only)
  if (!canEdit && !canViewAttendance) {
    // Don't show anything if no permissions at all
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <PageTitle />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <PageTitle />
      <ActionButtons
        isSubmitting={isSubmitting}
        onUpdateAll={canEdit ? onUpdateAll : undefined}
        onSave={canEdit ? onSave : undefined}
        onRefresh={onRefresh}
        canEdit={canEdit}
        canViewAttendance={canViewAttendance}
      />
    </div>
  );
};

export default AttendanceHeader;
