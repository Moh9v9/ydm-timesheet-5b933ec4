
import { StyledSelect } from "@/components/ui/styled-select";
import { ExportFormat, ReportType } from "@/lib/types";
import DateRangeInputs from "./DateRangeInputs";

interface ReportSelectionFormProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
  currentDate: string;
}

const ReportSelectionForm = ({
  reportType,
  setReportType,
  exportFormat,
  setExportFormat,
  currentDate,
}: ReportSelectionFormProps) => {
  const reportTypeOptions = [
    { value: "daily", label: "Daily Attendance" },
    { value: "weekly", label: "Weekly Attendance" },
    { value: "monthly", label: "Monthly Attendance" },
    { value: "employees", label: "Full Employee List" }
  ];

  const exportFormatOptions = [
    { value: "csv", label: "CSV" },
    { value: "xlsx", label: "Excel (XLSX)" },
    { value: "pdf", label: "PDF" }
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
      
      <DateRangeInputs 
        reportType={reportType} 
        currentDate={currentDate} 
      />
    </div>
  );
};

export default ReportSelectionForm;
