
import { useState } from "react";
import { StyledSelect } from "@/components/ui/styled-select";
import { ExportFormat, ReportType } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import DateRangeInputs from "./DateRangeInputs";
import { SearchBar } from "@/pages/employees/components/SearchBar";

interface ReportSelectionFormProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
  currentDate: string;
  showFilters: boolean;
}

const ReportSelectionForm = ({
  reportType,
  setReportType,
  exportFormat,
  setExportFormat,
  currentDate,
  showFilters
}: ReportSelectionFormProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { getUniqueValues } = useEmployees();
  
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

  // Get unique values for filters
  const projects = ["all", ...getUniqueValues("project")];
  const locations = ["all", ...getUniqueValues("location")];

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
      
      {showFilters && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/20 dark:bg-gray-800/30 space-y-4">
          <h3 className="text-sm font-medium mb-2">Additional Filters</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StyledSelect
              label="Project"
              value={selectedProject}
              onValueChange={setSelectedProject}
              placeholder="All Projects"
              options={projects.map(p => ({ value: p, label: p === "all" ? "All Projects" : p }))}
            />
            
            <StyledSelect
              label="Location"
              value={selectedLocation}
              onValueChange={setSelectedLocation}
              placeholder="All Locations"
              options={locations.map(l => ({ value: l, label: l === "all" ? "All Locations" : l }))}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Employee Search
            </label>
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Filter by employee name..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSelectionForm;
