
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ExportFormat, ReportType } from "@/lib/types";
import ExportControls from "../ExportControls";

interface ReportConfigSectionProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
  currentDate: string;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedProject: string;
  setSelectedProject: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedPaymentType: string;
  setSelectedPaymentType: (value: string) => void;
  includeInactive: boolean;
  setIncludeInactive: (value: boolean) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const ReportConfigSection = ({
  reportType,
  setReportType,
  exportFormat,
  setExportFormat,
  currentDate,
  showFilters,
  setShowFilters,
  selectedDate,
  setSelectedDate,
  searchTerm,
  setSearchTerm,
  selectedProject,
  setSelectedProject,
  selectedLocation,
  setSelectedLocation,
  selectedPaymentType,
  setSelectedPaymentType,
  includeInactive,
  setIncludeInactive,
  isGenerating,
  onGenerate
}: ReportConfigSectionProps) => {
  return (
    <Card>
      <div className="border-b dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold dark:text-gray-100">Attendance Report</h2>
            <p className="text-sm text-muted-foreground">Generate detailed attendance reports with advanced filtering options</p>
          </div>
          <Calendar className="text-gray-400 dark:text-gray-500" size={20} />
        </div>
      </div>
      
      <div className="p-6">
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
          onGenerate={onGenerate}
        />
      </div>
    </Card>
  );
};

export default ReportConfigSection;
