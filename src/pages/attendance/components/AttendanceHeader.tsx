
import ActionButtons from "./header/ActionButtons";
import PageTitle from "./header/PageTitle";

interface AttendanceHeaderProps {
  canEdit: boolean;
  isSubmitting: boolean;
  onUpdateAll: () => void;
  onSave: () => void;
  onRefresh?: () => void;
}

const AttendanceHeader = ({
  canEdit,
  isSubmitting,
  onUpdateAll,
  onSave,
  onRefresh,
}: AttendanceHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <PageTitle />
      {canEdit && (
        <ActionButtons
          isSubmitting={isSubmitting}
          onUpdateAll={onUpdateAll}
          onSave={onSave}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};

export default AttendanceHeader;
