
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
import { 
  formatAttendanceForExport, 
  generateFileContent, 
  downloadFile 
} from "@/lib/reportUtils";
import { format, parse } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

const ExportSection = () => {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords, currentDate } = useAttendance();
  const { success, error } = useNotification();
  
  const generateReport = async () => {
    setIsGenerating(true);
    
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
      
      // Fetch all records for the selected period
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Generating ${reportType} report for date: ${formattedDate}`);
      
      let allRecords = [...attendanceRecords];
      
      // For monthly and weekly reports, fetch all relevant records
      if (reportType === 'monthly' || reportType === 'weekly') {
        // Build the query
        let query = supabase
          .from('attendance_records')
          .select('*');
        
        // Add employee filter if an employee is selected
        if (searchTerm && searchTerm !== "") {
          console.log(`Filtering attendance records by employee: ${searchTerm}`);
          query = query.eq('employee_name', searchTerm);
        }
          
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data) {
          console.log(`Fetched ${data.length} total attendance records from database`);
          allRecords = data.map(record => ({
            id: record.id,
            employeeId: record.employee_uuid,
            employeeName: record.employee_name || '',
            date: record.date,
            present: record.present,
            startTime: record.start_time || '',
            endTime: record.end_time || '',
            overtimeHours: record.overtime_hours || 0,
            note: record.note || ''
          }));
        }
      } else if (searchTerm && searchTerm !== "") {
        // For daily reports, filter the existing records by employee name
        allRecords = allRecords.filter(record => record.employeeName === searchTerm);
      }
      
      // Format data for export
      const formattedData = formatAttendanceForExport(allRecords, reportType, formattedDate);
      
      // Generate file content
      const { content, mimeType, isBinary } = generateFileContent(formattedData, exportFormat);
      
      // Create filename based on report type and date and employee if filtered
      const dateStr = format(selectedDate, "yyyyMMdd");
      const employeeStr = searchTerm ? `-${searchTerm.replace(/\s+/g, '-')}` : '';
      const filename = `${reportType}-attendance${employeeStr}-${dateStr}.${exportFormat}`;
      
      // Download the file
      downloadFile(content, filename, mimeType, isBinary);
      
      success(`${reportTypeName} exported as ${formatName} successfully`);
      console.log("Export request:", {
        reportType,
        exportFormat,
        date: formattedDate,
        employee: searchTerm || "All",
        employeesCount: filteredEmployees.length,
        recordsCount: formattedData.length
      });
    } catch (err) {
      error("Failed to generate report");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance Report</CardTitle>
                <CardDescription>Generate detailed attendance reports with advanced filtering options</CardDescription>
              </div>
              <Calendar className="text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <ReportSelectionForm
                  reportType={reportType}
                  setReportType={setReportType}
                  exportFormat={exportFormat}
                  setExportFormat={setExportFormat}
                  currentDate={currentDate}
                  showFilters={showFilters}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="mt-8 ml-4 flex items-center gap-2 self-start"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
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
