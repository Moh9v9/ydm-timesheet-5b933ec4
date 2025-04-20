
import { Download, FileText, FileSpreadsheet } from "lucide-react";

const AvailableReports = () => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 p-5 shadow-sm h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium dark:text-gray-200">Recent Reports</h2>
      </div>
      
      <div className="border-t dark:border-gray-700 pt-4 mt-2">
        <p className="text-muted-foreground text-sm text-center">No recent reports available</p>
      </div>
    </div>
  );
};

export default AvailableReports;
