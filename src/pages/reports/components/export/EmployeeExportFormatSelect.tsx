
import { StyledSelect } from "@/components/ui/styled-select";
import { ExportFormat } from "@/lib/types";

interface EmployeeExportFormatSelectProps {
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
}

const exportFormatOptions = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (XLSX)" },
  { value: "pdf", label: "PDF" }
];

const EmployeeExportFormatSelect = ({
  exportFormat,
  setExportFormat
}: EmployeeExportFormatSelectProps) => (
  <StyledSelect
    label="Export Format"
    value={exportFormat}
    onValueChange={setExportFormat}
    placeholder="Select Export Format"
    options={exportFormatOptions}
    className="w-64"
  />
);

export default EmployeeExportFormatSelect;
