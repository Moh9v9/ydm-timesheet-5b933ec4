
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeExportFormatSelect from "../EmployeeExportFormatSelect";
import { ExportFormat } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmployeeExportControlsProps {
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const EmployeeExportControls = ({
  exportFormat,
  setExportFormat,
  showFilters,
  setShowFilters,
}: EmployeeExportControlsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <EmployeeExportFormatSelect
        exportFormat={exportFormat}
        setExportFormat={setExportFormat}
      />
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter size={16} />
        {showFilters ? t('hideFilters') : t('showFilters')}
      </Button>
    </div>
  );
};

export default EmployeeExportControls;
