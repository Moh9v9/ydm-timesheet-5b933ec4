
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

const SummaryTableHeader = () => {
  const { t } = useLanguage();
  
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
        <TableHead className="font-medium">{t('employee')}</TableHead>
        <TableHead className="font-medium">{t('date')}</TableHead>
        <TableHead className="font-medium">{t('status')}</TableHead>
        <TableHead className="font-medium">{t('totalHours')}</TableHead>
        <TableHead className="font-medium">{t('overtime')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default SummaryTableHeader;
