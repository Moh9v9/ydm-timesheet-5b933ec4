
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";
import { Download, FileText } from "lucide-react";
import { ExportFormat, ReportType } from "@/lib/types";
import ReportSelectionForm from "./export/ReportSelectionForm";
import AvailableReports from "./export/AvailableReports";

const ExportSection = () => {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords, currentDate } = useAttendance();
  const { success, error } = useNotification();
  
  const generateReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const reportTypeName = {
          daily: "Daily Attendance",
          weekly: "Weekly Attendance",
          monthly: "Monthly Attendance",
          employees: "Employee List"
        }[reportType];
        
        const formatName = {
          csv: "CSV",
          xlsx: "Excel",
          pdf: "PDF"
        }[exportFormat];
        
        success(`${reportTypeName} exported as ${formatName} successfully`);
        console.log("Export request:", {
          reportType,
          exportFormat,
          date: currentDate,
          employeesCount: filteredEmployees.length,
          recordsCount: attendanceRecords.length
        });
      } catch (err) {
        error("Failed to generate report");
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 1500);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-medium dark:text-gray-200">Generate Report</h2>
            <FileText className="text-gray-400 dark:text-gray-500" size={20} />
          </div>
          
          <div className="border-t dark:border-gray-700 pt-4 mt-2">
            <ReportSelectionForm
              reportType={reportType}
              setReportType={setReportType}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              currentDate={currentDate}
            />
          </div>
          
          <div className="pt-6 mt-2">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="px-4 py-2.5 bg-primary text-white rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Download size={16} className="mr-2" />
              {isGenerating ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <AvailableReports />
      </div>
    </div>
  );
};

export default ExportSection;
