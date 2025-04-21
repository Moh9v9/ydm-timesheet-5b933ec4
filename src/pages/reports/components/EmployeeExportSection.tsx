
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { ExportFormat, EmployeeFilters } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { 
  formatEmployeesForExport, 
  generateFileContent, 
  downloadFile 
} from "@/lib/reportUtils";
import { format } from "date-fns";
import EmployeeExportFilters from "./export/EmployeeExportFilters";
import EmployeeExportHeader from "./export/sections/EmployeeExportHeader";
import EmployeeExportControls from "./export/sections/EmployeeExportControls";
import EmployeeExportActions from "./export/sections/EmployeeExportActions";

const EmployeeExportSection = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
        
        // Apply all filters to the employees list
        const employeesToExport = filteredEmployees.filter(employee => {
          // Check each filter criteria
          if (filters.project && employee.project !== filters.project) return false;
          if (filters.location && employee.location !== filters.location) return false;
          if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
          if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
          if (filters.status && employee.status !== filters.status) return false;
          return true;
        });
        
        const formattedData = formatEmployeesForExport(employeesToExport);
        const { content, mimeType, isBinary } = generateFileContent(formattedData, exportFormat);
        const dateStr = format(new Date(), "yyyyMMdd");
        const filename = `employee-data-${dateStr}.${exportFormat}`;
        downloadFile(content, filename, mimeType, isBinary);
        
        success(`Employee data exported as ${formatName} successfully with ${employeesToExport.length} records`);
        console.log("Export request:", {
          type: "employees",
          exportFormat,
          filters,
          employeesCount: employeesToExport.length
        });
      } catch (err) {
        error("Failed to generate employee report");
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  // Get unique values for filters
  const projects = ["all", ...getUniqueValues("project")];
  const locations = ["all", ...getUniqueValues("location")];
  const paymentTypes = ["all", ...getUniqueValues("paymentType")];
  const sponsorships = ["all", ...getUniqueValues("sponsorship")];

  // Filters logic
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

  return (
    <div className="grid grid-cols-1">
      <div>
        <Card>
          <EmployeeExportHeader />
          <CardContent>
            <EmployeeExportControls
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
            
            <EmployeeExportFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              filteredEmployeesCount={filteredEmployees.length}
              projects={projects}
              locations={locations}
              paymentTypes={paymentTypes}
              sponsorships={sponsorships}
              show={showFilters}
            />
            
            <EmployeeExportActions
              isGenerating={isGenerating}
              filteredEmployeesCount={filteredEmployees.length}
              onGenerate={generateReport}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeExportSection;
