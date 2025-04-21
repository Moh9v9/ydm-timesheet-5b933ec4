
import { useState } from "react";
import { StyledSelect } from "@/components/ui/styled-select";
import { ExportFormat, ReportType } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { Form } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import DateRangeInputs from "./DateRangeInputs";
import { SearchBar } from "@/pages/employees/components/SearchBar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ReportSelectionFormProps {
  reportType: ReportType;
  setReportType: (value: ReportType) => void;
  exportFormat: ExportFormat;
  setExportFormat: (value: ExportFormat) => void;
  currentDate: string;
  showFilters: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const ReportSelectionForm = ({
  reportType,
  setReportType,
  exportFormat,
  setExportFormat,
  currentDate,
  showFilters,
  selectedDate,
  setSelectedDate
}: ReportSelectionFormProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const { getUniqueValues } = useEmployees();
  
  const reportTypeOptions = [
    { value: "daily", label: "Daily Attendance" },
    { value: "weekly", label: "Weekly Attendance" },
    { value: "monthly", label: "Monthly Attendance" },
    { value: "employees", label: "Full Employee List" }
  ];

  const exportFormatOptions = [
    { value: "csv", label: "CSV (Comma Separated)" },
    { value: "xlsx", label: "Excel (XLSX)" },
    { value: "pdf", label: "PDF Document" }
  ];

  const paymentTypes = ["all", "Monthly", "Daily"];
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
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      {showFilters && (
        <div className="mt-4 space-y-4">
          <div className="p-4 border rounded-lg bg-muted/20 dark:bg-gray-800/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Basic Filters</h3>
              </div>
              
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
          </div>

          <Collapsible
            open={isAdvancedOpen}
            onOpenChange={setIsAdvancedOpen}
            className="border rounded-lg bg-muted/20 dark:bg-gray-800/30 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Advanced Filters</h3>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                {isAdvancedOpen ? (
                  <>
                    <span>Less filters</span>
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    <span>More filters</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="space-y-4 mt-4">
              <StyledSelect
                label="Payment Type"
                value={selectedPaymentType}
                onValueChange={setSelectedPaymentType}
                placeholder="All Payment Types"
                options={paymentTypes.map(pt => ({ 
                  value: pt, 
                  label: pt === "all" ? "All Payment Types" : pt 
                }))}
              />
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeInactive" 
                  checked={includeInactive}
                  onCheckedChange={(checked) => setIncludeInactive(checked as boolean)}
                />
                <label
                  htmlFor="includeInactive"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include Inactive Employees
                </label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default ReportSelectionForm;
