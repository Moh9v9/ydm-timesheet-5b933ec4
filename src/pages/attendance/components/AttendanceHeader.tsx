
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";

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
      <div>
        <h1 className="text-2xl font-bold">Daily Attendance</h1>
        <p className="text-muted-foreground">
          Manage employee attendance records
        </p>
      </div>
      
      {canEdit && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onUpdateAll}
            disabled={isSubmitting}
            variant="secondary"
            className="flex-1 sm:flex-none sm:min-w-[160px]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isSubmitting ? "Updating..." : "Update All"}
          </Button>
          
          <Button 
            onClick={onSave}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:min-w-[160px]"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AttendanceHeader;
