
import { Button } from "@/components/ui/button";
import { RefreshCw, Save, RotateCcw } from "lucide-react";

interface ActionButtonsProps {
  isSubmitting: boolean;
  onUpdateAll: () => void;
  onSave: () => void;
  onRefresh?: () => void;
}

const ActionButtons = ({ isSubmitting, onUpdateAll, onSave, onRefresh }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {onRefresh && (
        <Button
          onClick={onRefresh}
          disabled={isSubmitting}
          variant="outline"
          className="flex-1 sm:flex-none"
          title="Manually refresh attendance data"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      )}
      
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
  );
};

export default ActionButtons;
