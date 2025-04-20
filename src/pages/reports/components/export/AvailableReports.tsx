
import { Download, FileText, FileSpreadsheet } from "lucide-react";

const AvailableReports = () => {
  return (
    <div className="bg-card shadow-sm rounded-lg border p-6">
      <h2 className="text-xl font-medium mb-4">Available Reports</h2>
      
      <div className="space-y-3">
        <div className="p-3 border rounded-md flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center">
            <FileText size={18} className="mr-3" />
            <span>Daily Attendance</span>
          </div>
          <button className="text-primary hover:text-primary/80">
            <Download size={16} />
          </button>
        </div>
        
        <div className="p-3 border rounded-md flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center">
            <FileText size={18} className="mr-3" />
            <span>Weekly Summary</span>
          </div>
          <button className="text-primary hover:text-primary/80">
            <Download size={16} />
          </button>
        </div>
        
        <div className="p-3 border rounded-md flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center">
            <FileSpreadsheet size={18} className="mr-3" />
            <span>Monthly Report</span>
          </div>
          <button className="text-primary hover:text-primary/80">
            <Download size={16} />
          </button>
        </div>
        
        <div className="p-3 border rounded-md flex items-center justify-between hover:bg-accent/50 transition-colors">
          <div className="flex items-center">
            <FileSpreadsheet size={18} className="mr-3" />
            <span>Employee Directory</span>
          </div>
          <button className="text-primary hover:text-primary/80">
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailableReports;
