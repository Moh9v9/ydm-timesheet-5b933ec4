
import { Download, FileText, FileSpreadsheet } from "lucide-react";

export interface ReportItemProps {
  title: string;
  date: string;
  type: 'csv' | 'excel' | 'pdf';
  icon: 'text' | 'spreadsheet';
}

export const ReportItem = ({ title, date, type, icon }: ReportItemProps) => {
  const getTypeColor = () => {
    switch (type) {
      case 'csv': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'excel': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
      case 'pdf': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
      default: return '';
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors group">
      <div className="flex items-center gap-3">
        {icon === 'text' ? 
          <FileText size={18} className="text-gray-500 dark:text-gray-400" /> : 
          <FileSpreadsheet size={18} className="text-gray-500 dark:text-gray-400" />
        }
        <div>
          <p className="text-sm font-medium dark:text-gray-300">{title}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor()}`}>
          {type.toUpperCase()}
        </span>
        <button className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <Download size={14} />
        </button>
      </div>
    </div>
  );
};

export default ReportItem;
