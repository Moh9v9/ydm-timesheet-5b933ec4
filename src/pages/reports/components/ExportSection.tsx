
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useNotification } from "@/components/ui/notification";
import { Download, FileText, Calendar, Filter } from "lucide-react";
import { ExportFormat, ReportType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import ReportSelectionForm from "./export/ReportSelectionForm";
import AvailableReports from "./export/AvailableReports";

const ExportSection = () => {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
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
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Report</CardTitle>
                <CardDescription>Generate attendance data for selected time period</CardDescription>
              </div>
              <Calendar className="text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <ReportSelectionForm
                  reportType={reportType}
                  setReportType={setReportType}
                  exportFormat={exportFormat}
                  setExportFormat={setExportFormat}
                  currentDate={currentDate}
                  showFilters={showFilters}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="mt-8 ml-4 flex items-center gap-2 self-start"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "More Filters"}
              </Button>
            </div>
            
            <div className="pt-4 mt-2 border-t">
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="gap-2"
              >
                <Download size={16} />
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <AvailableReports />
      </div>
    </div>
  );
};

export default ExportSection;
