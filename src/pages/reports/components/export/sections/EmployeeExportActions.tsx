
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
  
  return (
    <div className="flex mt-6 justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">
          {t('totalEmployeesCount')} <strong>{filteredEmployeesCount}</strong>
        </p>
      </div>
      <Button
        onClick={onGenerate}
        disabled={isGenerating || filteredEmployeesCount === 0}
        className="gap-2"
      >
        <Download size={16} />
        {isGenerating ? t('generating') : t('exportEmployeeData')}
      </Button>
    </div>
  );
};

export default EmployeeExportActions;
