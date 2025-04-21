
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { ExportFormat, EmployeeFilters } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import AvailableReports from "./export/AvailableReports";
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
        const formattedData = formatEmployeesForExport(filteredEmployees);
        const { content, mimeType, isBinary } = generateFileContent(formattedData, exportFormat);
        const dateStr = format(new Date(), "yyyyMMdd");
        const filename = `employee-data-${dateStr}.${exportFormat}`;
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
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
      <div className="lg:col-span-1">
        <AvailableReports />
      </div>
    </div>
  );
};

export default EmployeeExportSection;
