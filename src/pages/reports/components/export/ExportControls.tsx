
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter, Download } from "lucide-react";
import { ReportType, ExportFormat } from "@/lib/types";
import ReportSelectionForm from "./ReportSelectionForm";

interface ExportControlsProps {
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

const ExportControls: React.FC<ExportControlsProps> = ({
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
}) => {
  return (
    <>
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
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedPaymentType={selectedPaymentType}
            setSelectedPaymentType={setSelectedPaymentType}
            includeInactive={includeInactive}
            setIncludeInactive={setIncludeInactive}
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
          onClick={onGenerate}
          disabled={isGenerating}
          className="gap-2"
        >
          <Download size={16} />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </>
  );
};

export default ExportControls;
