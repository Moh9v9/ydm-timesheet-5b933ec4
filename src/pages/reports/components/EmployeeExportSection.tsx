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
import EmployeeExportFilters from "./export/EmployeeExportFilters";
import EmployeeExportFormatSelect from "./export/EmployeeExportFormatSelect";

const EmployeeExportSection = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
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
              <EmployeeExportFormatSelect
                exportFormat={exportFormat}
                setExportFormat={setExportFormat}
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
