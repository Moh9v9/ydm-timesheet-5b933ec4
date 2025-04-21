
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { Calendar } from "lucide-react";
import { ExportFormat, ReportType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AvailableReports from "./export/AvailableReports";
import { useReportGeneration } from "../hooks/useReportGeneration";
import ExportControls from "./export/ExportControls";

const ExportSection = () => {
  const [reportType, setReportType] = useState<ReportType>("daily");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("all");
  const [includeInactive, setIncludeInactive] = useState(false);
  
  const { attendanceRecords, currentDate } = useAttendance();
  
  const { isGenerating, generateReport } = useReportGeneration({
    reportType,
    exportFormat,
    selectedDate,
    searchTerm,
    selectedPaymentType,
    includeInactive,
    attendanceRecords
  });
  
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
            <ExportControls
              reportType={reportType}
              setReportType={setReportType}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              currentDate={currentDate}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedPaymentType={selectedPaymentType}
              setSelectedPaymentType={setSelectedPaymentType}
              includeInactive={includeInactive}
              setIncludeInactive={setIncludeInactive}
              isGenerating={isGenerating}
              onGenerate={generateReport}
            />
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
