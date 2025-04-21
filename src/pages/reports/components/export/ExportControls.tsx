import React from 'react';
import { ReportType, ExportFormat } from "@/lib/types";
import ReportSelectionForm from "./ReportSelectionForm";
import BasicReportControls from "./controls/BasicReportControls";
import FilterToggleButton from "./controls/FilterToggleButton";
import GenerateReportButton from "./controls/GenerateReportButton";

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
          <BasicReportControls
            reportType={reportType}
            setReportType={setReportType}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
            currentDate={currentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          
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
        
        <FilterToggleButton 
          showFilters={showFilters} 
          onToggle={() => setShowFilters(!showFilters)} 
        />
      </div>
      
      <GenerateReportButton 
        isGenerating={isGenerating} 
        onClick={onGenerate} 
      />
    </>
  );
};

export default ExportControls;
