
import React from 'react';
import { StyledSelect } from "@/components/ui/styled-select";
import { ReportType, ExportFormat } from "@/lib/types";

interface BasicReportControlsProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
  currentDate: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const BasicReportControls: React.FC<BasicReportControlsProps> = ({
  reportType,
  setReportType,
  exportFormat,
  setExportFormat,
  currentDate,
  selectedDate,
  setSelectedDate,
}) => {
  const reportTypeOptions = [
    { value: "daily", label: "Daily Attendance" },
    { value: "monthly", label: "Monthly Attendance" }
  ];

  const exportFormatOptions = [
    { value: "csv", label: "CSV (Comma Separated)" },
    { value: "xlsx", label: "Excel (XLSX)" },
    { value: "pdf", label: "PDF Document" }
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default BasicReportControls;
