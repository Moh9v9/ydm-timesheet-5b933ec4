
import { FileText } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const EmployeeExportHeader = () => {
  const { t } = useLanguage();

  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>{t('employeeDataExport')}</CardTitle>
          <CardDescription>{t('exportEmployeeInfo')}</CardDescription>
        </div>
        <FileText className="text-gray-400 dark:text-gray-500" size={20} />
      </div>
    </CardHeader>
  );
};

export default EmployeeExportHeader;
