
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeExportActionsProps {
  isGenerating: boolean;
  filteredEmployeesCount: number;
  onGenerate: () => void;
}

const EmployeeExportActions = ({
  isGenerating,
  filteredEmployeesCount,
  onGenerate,
}: EmployeeExportActionsProps) => {
  return (
    <div className="flex mt-6 justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">
          Total employees: <strong>{filteredEmployeesCount}</strong>
        </p>
      </div>
      <Button
        onClick={onGenerate}
        disabled={isGenerating || filteredEmployeesCount === 0}
        className="gap-2"
      >
        <Download size={16} />
        {isGenerating ? "Generating..." : "Export Employee Data"}
      </Button>
    </div>
  );
};

export default EmployeeExportActions;
