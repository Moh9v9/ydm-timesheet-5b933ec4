
import { Download, FileText, FileSpreadsheet } from "lucide-react";

const AvailableReports = () => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 p-5 shadow-sm h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium dark:text-gray-200">Recent Reports</h2>
      </div>
      
      <div className="border-t dark:border-gray-700 pt-4 mt-2">
        <div className="space-y-3">
          <ReportItem 
            title="Daily Attendance" 
            date="Apr 19, 2025" 
            type="csv" 
            icon="text"
          />
          
          <ReportItem 
            title="Weekly Summary" 
            date="Week 16, 2025" 
            type="excel" 
            icon="spreadsheet"
          />
          
          <ReportItem 
            title="Monthly Report" 
            date="March 2025" 
            type="pdf" 
            icon="text"
          />
          
          <ReportItem 
            title="Employee Directory" 
            date="Apr 15, 2025" 
            type="excel" 
            icon="spreadsheet"
          />
        </div>
      </div>
    </div>
  );
};

interface ReportItemProps {
  title: string;
  date: string;
  type: 'csv' | 'excel' | 'pdf';
  icon: 'text' | 'spreadsheet';
}

const ReportItem = ({ title, date, type, icon }: ReportItemProps) => {
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

export default AvailableReports;
