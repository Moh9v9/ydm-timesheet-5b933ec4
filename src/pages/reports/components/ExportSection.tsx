
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";
import { Download } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-card shadow-sm rounded-lg border p-6 space-y-6">
        <h2 className="text-xl font-medium">Generate Report</h2>
        
        <ReportSelectionForm
          reportType={reportType}
          setReportType={setReportType}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          currentDate={currentDate}
        />
        
        <div className="pt-2">
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            <Download size={16} className="mr-2" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
      
      <AvailableReports />
    </div>
  );
};

export default ExportSection;
