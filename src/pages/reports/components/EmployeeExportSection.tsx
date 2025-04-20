
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { Download, FileText, Filter } from "lucide-react";
import { ExportFormat, EmployeeFilters, PaymentType, SponsorshipType } from "@/lib/types";
import { StyledSelect } from "@/components/ui/styled-select";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import AvailableReports from "./export/AvailableReports";
import { 
  formatEmployeesForExport, 
  generateFileContent, 
  downloadFile 
} from "@/lib/reportUtils";
import { format } from "date-fns";

const EmployeeExportSection = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<EmployeeFilters>({});
  
  const { filteredEmployees, getUniqueValues } = useEmployees();
  const { success, error } = useNotification();
  
  const generateReport = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const formatName = {
          csv: "CSV",
          xlsx: "Excel",
          pdf: "PDF"
        }[exportFormat];
        
        // Format employee data for export
        const formattedData = formatEmployeesForExport(filteredEmployees);
        
        // Generate file content
        const { content, mimeType, isBinary } = generateFileContent(formattedData, exportFormat);
        
        // Create filename
        const dateStr = format(new Date(), "yyyyMMdd");
        const filename = `employee-data-${dateStr}.${exportFormat}`;
        
        // Download the file
        downloadFile(content, filename, mimeType, isBinary);
        
        success(`Employee data exported as ${formatName} successfully with ${filteredEmployees.length} records`);
        console.log("Export request:", {
          type: "employees",
          exportFormat,
          filters,
          employeesCount: filteredEmployees.length
        });
      } catch (err) {
        error("Failed to generate employee report");
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  const handleFilterChange = (key: keyof EmployeeFilters, value: string | undefined) => {
    if (!value || value === "all") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ 
        ...filters, 
        [key]: value 
      });
    }
  };
  
  const exportFormatOptions = [
    { value: "csv", label: "CSV" },
    { value: "xlsx", label: "Excel (XLSX)" },
    { value: "pdf", label: "PDF" }
  ];

  // Get unique values for filters
  const projects = ["all", ...getUniqueValues("project")];
  const locations = ["all", ...getUniqueValues("location")];
  const paymentTypes = ["all", ...getUniqueValues("paymentType")];
  const sponsorships = ["all", ...getUniqueValues("sponsorship")];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Data Export</CardTitle>
                <CardDescription>Export employee information based on filters</CardDescription>
              </div>
              <FileText className="text-gray-400 dark:text-gray-500" size={20} />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <StyledSelect
                label="Export Format"
                value={exportFormat}
                onValueChange={(value: ExportFormat) => setExportFormat(value)}
                placeholder="Select Export Format"
                options={exportFormatOptions}
                className="w-64"
              />
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 border rounded-lg bg-muted/20 dark:bg-gray-800/30">
                <StyledSelect
                  label="Project"
                  value={filters.project || "all"}
                  onValueChange={(value) => handleFilterChange("project", value === "all" ? undefined : value)}
                  placeholder="All Projects"
                  options={projects.map(p => ({ value: p, label: p === "all" ? "All Projects" : p }))}
                />
                
                <StyledSelect
                  label="Location"
                  value={filters.location || "all"}
                  onValueChange={(value) => handleFilterChange("location", value === "all" ? undefined : value)}
                  placeholder="All Locations"
                  options={locations.map(l => ({ value: l, label: l === "all" ? "All Locations" : l }))}
                />
                
                <StyledSelect
                  label="Payment Type"
                  value={filters.paymentType || "all"}
                  onValueChange={(value) => handleFilterChange("paymentType", value === "all" ? undefined : value as PaymentType)}
                  placeholder="All Payment Types"
                  options={paymentTypes.map(p => ({ value: p, label: p === "all" ? "All Payment Types" : p }))}
                />
                
                <StyledSelect
                  label="Sponsorship"
                  value={filters.sponsorship || "all"}
                  onValueChange={(value) => handleFilterChange("sponsorship", value === "all" ? undefined : value as SponsorshipType)}
                  placeholder="All Sponsorships"
                  options={sponsorships.map(s => ({ value: s, label: s === "all" ? "All Sponsorships" : s }))}
                />
                
                <div className="col-span-1 sm:col-span-2">
                  <small className="text-muted-foreground">
                    {filteredEmployees.length} employees match the selected filters
                  </small>
                </div>
              </div>
            )}
            
            <div className="flex mt-6 justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total employees: <strong>{filteredEmployees.length}</strong>
                </p>
              </div>
              
              <Button
                onClick={generateReport}
                disabled={isGenerating || filteredEmployees.length === 0}
                className="gap-2"
              >
                <Download size={16} />
                {isGenerating ? "Generating..." : "Export Employee Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <AvailableReports />
      </div>
    </div>
  );
};

export default EmployeeExportSection;
