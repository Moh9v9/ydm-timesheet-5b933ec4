
import { useState } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import { EmployeeFilters, ExportFormat } from "@/lib/types";
import { 
  formatEmployeesForExport, 
  generateFileContent, 
  downloadFile 
} from "@/lib/reportUtils";
import { format } from "date-fns";

export const useEmployeeExport = () => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EmployeeFilters>({});
  
  const { employees, filteredEmployees } = useEmployees();
  const { success, error } = useNotification();

  const handleFilterChange = (key: keyof EmployeeFilters, value: string | undefined) => {
    if (!value || value === "all") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
      console.log('Filter removed:', key);
    } else {
      setFilters({
        ...filters,
        [key]: value
      });
      console.log('Filter added:', key, value);
    }
  };

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const formatName = {
          csv: "CSV",
          xlsx: "Excel",
          pdf: "PDF"
        }[exportFormat];
        
        // Use ALL employees instead of filteredEmployees as the source data,
        // and then apply our filters directly to ensure archived employees are included
        let employeesToExport = employees.filter(employee => {
          if (filters.project && employee.project !== filters.project) return false;
          if (filters.location && employee.location !== filters.location) return false;
          if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
          if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
          if (filters.status && employee.status !== filters.status) return false;
          return true;
        });
        
        console.log('Generating report with filters:', filters);
        console.log('Filtered employees count:', employeesToExport.length);
        
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
          totalEmployees: employees.length,
          exportedEmployees: employeesToExport.length
        });
      } catch (err) {
        console.error('Error generating report:', err);
        error("Failed to generate employee report");
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  const uniqueValues = {
    projects: ["all", ...getUniqueValues("project")],
    locations: ["all", ...getUniqueValues("location")],
    paymentTypes: ["all", ...getUniqueValues("paymentType")],
    sponsorships: ["all", ...getUniqueValues("sponsorship")]
  };

  const getUniqueValues = (field: keyof EmployeeFilters) => {
    // Make sure we include values from ALL employees, not just filtered ones
    return Array.from(new Set(employees.map(employee => employee[field] as string))).filter(Boolean);
  };

  return {
    exportFormat,
    setExportFormat,
    isGenerating,
    showFilters,
    setShowFilters,
    filters,
    handleFilterChange,
    generateReport,
    uniqueValues,
    filteredEmployeesCount: employees.filter(employee => {
      if (filters.project && employee.project !== filters.project) return false;
      if (filters.location && employee.location !== filters.location) return false;
      if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
      if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
      if (filters.status && employee.status !== filters.status) return false;
      return true;
    }).length
  };
};
