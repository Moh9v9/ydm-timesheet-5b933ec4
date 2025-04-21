
import ReportItem from "./ReportItem";

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

export default AvailableReports;
