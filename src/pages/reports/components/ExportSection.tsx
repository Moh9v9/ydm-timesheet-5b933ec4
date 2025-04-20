import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { ExportFormat, ReportType } from "@/lib/types";
import { StyledSelect } from "@/components/ui/styled-select";

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

  const reportTypeOptions = [
    { value: "daily", label: "Daily Attendance" },
    { value: "weekly", label: "Weekly Attendance" },
    { value: "monthly", label: "Monthly Attendance" },
    { value: "employees", label: "Full Employee List" }
  ];

  const exportFormatOptions = [
    { value: "csv", label: "CSV" },
    { value: "xlsx", label: "Excel (XLSX)" },
    { value: "pdf", label: "PDF" }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-card shadow-sm rounded-lg border p-6 space-y-6">
        <h2 className="text-xl font-medium">Generate Report</h2>
        
        <div className="space-y-4">
          <StyledSelect
            label="Report Type"
            value={reportType}
            onValueChange={(value: ReportType) => setReportType(value)}
            placeholder="Select Report Type"
            options={reportTypeOptions}
          />
          
          <StyledSelect
            label="Export Format"
            value={exportFormat}
            onValueChange={(value: ExportFormat) => setExportFormat(value)}
            placeholder="Select Export Format"
            options={exportFormatOptions}
          />
          
          {reportType === "daily" && (
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={currentDate}
                className="w-full p-2 border border-input rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-offset-2"
              />
            </div>
          )}
          
          {reportType === "weekly" && (
            <div>
              <label htmlFor="week" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Week
              </label>
              <input
                type="week"
                id="week"
                className="w-full p-2 border border-input rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-offset-2"
              />
            </div>
          )}
          
          {reportType === "monthly" && (
            <div>
              <label htmlFor="month" className="block text-sm font-medium mb-1 dark:text-gray-200">
                Month
              </label>
              <input
                type="month"
                id="month"
                className="w-full p-2 border border-input rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary dark:focus:ring-offset-2"
              />
            </div>
          )}
          
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
      </div>
      
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
    </div>
  );
};

export default ExportSection;
