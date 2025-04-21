
import { Card, CardContent } from "@/components/ui/card";
import { useEmployeeExport } from "../hooks/useEmployeeExport";
import EmployeeExportFilters from "./export/EmployeeExportFilters";
import EmployeeExportHeader from "./export/sections/EmployeeExportHeader";
import EmployeeExportControls from "./export/sections/EmployeeExportControls";
import EmployeeExportActions from "./export/sections/EmployeeExportActions";

const EmployeeExportSection = () => {
  const {
    exportFormat,
    setExportFormat,
    isGenerating,
    showFilters,
    setShowFilters,
    filters,
    handleFilterChange,
    generateReport,
    uniqueValues,
    filteredEmployeesCount
  } = useEmployeeExport();

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
              filteredEmployeesCount={filteredEmployeesCount}
              projects={uniqueValues.projects}
              locations={uniqueValues.locations}
              paymentTypes={uniqueValues.paymentTypes}
              sponsorships={uniqueValues.sponsorships}
              show={showFilters}
            />
            
            <EmployeeExportActions
              isGenerating={isGenerating}
              filteredEmployeesCount={filteredEmployeesCount}
              onGenerate={generateReport}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeExportSection;
