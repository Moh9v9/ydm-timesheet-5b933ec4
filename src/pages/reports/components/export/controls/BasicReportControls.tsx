
import React from 'react';
import { StyledSelect } from "@/components/ui/styled-select";
import { ReportType, ExportFormat } from "@/lib/types";

interface BasicReportControlsProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
}

const BasicReportControls: React.FC<BasicReportControlsProps> = ({
  reportType,
  setReportType,
  exportFormat,
  setExportFormat,
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

  return null; // We'll remove this component's rendering
};

export default BasicReportControls;

