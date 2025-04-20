
import { Download, FileText, FileSpreadsheet } from "lucide-react";

const AvailableReports = () => {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 p-5 shadow-sm h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-medium dark:text-gray-200">Available Templates</h2>
      </div>
      
      <div className="border-t dark:border-gray-700 pt-4 mt-2">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-center text-muted-foreground py-4">
            Select your report options and click generate to create a new report.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailableReports;
