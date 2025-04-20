
import PageTitle from "./header/PageTitle";
import ActionButtons from "./header/ActionButtons";

interface AttendanceHeaderProps {
  canEdit: boolean;
  isSubmitting: boolean;
  onUpdateAll: () => void;
  onSave: () => void;
}

const AttendanceHeader = ({
  canEdit,
  isSubmitting,
  onUpdateAll,
  onSave
}: AttendanceHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <PageTitle />
      {canEdit && (
        <ActionButtons
          isSubmitting={isSubmitting}
          onUpdateAll={onUpdateAll}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default AttendanceHeader;
