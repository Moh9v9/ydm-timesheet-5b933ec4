
import { useState } from "react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { ExportFormat, ReportType } from "@/lib/types";
import { useReportGeneration } from "../hooks/useReportGeneration";
import ReportConfigSection from "./export/sections/ReportConfigSection";
import AvailableReports from "./export/AvailableReports";

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
        <ReportConfigSection
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
      </div>
      
      <div className="lg:col-span-1">
        <AvailableReports />
      </div>
    </div>
  );
};

export default ExportSection;
