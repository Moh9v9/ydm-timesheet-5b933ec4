
import { useState } from "react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { ExportFormat, ReportType } from "@/lib/types";
import { useReportGeneration } from "../hooks/useReportGeneration";
import ReportConfigSection from "./export/sections/ReportConfigSection";

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
  
  // Create a complete filters object to pass to useReportGeneration
  const filters = {
    reportType,
    exportFormat,
    date: selectedDate,
    searchTerm,
    project: selectedProject !== "all" ? selectedProject : undefined,
    location: selectedLocation !== "all" ? selectedLocation : undefined,
    paymentType: selectedPaymentType !== "all" ? selectedPaymentType : undefined,
    includeInactive
  };
  
  const { isGenerating, generateReport } = useReportGeneration({
    reportType,
    exportFormat,
    selectedDate,
    searchTerm,
    selectedProject: filters.project,
    selectedLocation: filters.location,
    selectedPaymentType: filters.paymentType,
    includeInactive,
    attendanceRecords
  });
  
  return (
    <div className="grid grid-cols-1">
      <div>
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
          onGenerate={() => generateReport(filters)}
        />
      </div>
    </div>
  );
};

export default ExportSection;
