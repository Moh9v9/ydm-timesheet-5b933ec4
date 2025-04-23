
import { useState, useCallback } from "react";
import { useNotification } from "@/components/ui/notification";
import { useEmployees } from "@/contexts/EmployeeContext";
import { ExportFormat, ReportType } from "@/lib/types";
import { formatAttendanceForExport } from "@/lib/reportUtils";
import { format } from "date-fns";
import { useReportFilters } from "./report-generation/useReportFilters";
import { useReportGenerator } from "./report-generation/useReportGenerator";

interface UseReportGenerationProps {
  reportType: ReportType;
  exportFormat: ExportFormat;
  selectedDate: Date;
  searchTerm: string;
  selectedProject?: string;
  selectedLocation?: string;
  selectedPaymentType?: string;
  includeInactive: boolean;
  attendanceRecords: any[];
}

interface ReportFilters {
  reportType: ReportType;
  exportFormat: ExportFormat;
  date: Date;
  searchTerm?: string;
  project?: string;
  location?: string;
  paymentType?: string;
  includeInactive?: boolean;
}

export const useReportGeneration = ({
  reportType,
  exportFormat,
  selectedDate,
  searchTerm,
  selectedProject,
  selectedLocation,
  selectedPaymentType,
  includeInactive,
  attendanceRecords
}: UseReportGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { filteredEmployees } = useEmployees();
  const { success, error } = useNotification();
  const { applyMonthlyFilters } = useReportFilters();
  const { generateFormattedReport } = useReportGenerator();

  // Optimize the generate report function with useCallback
  const generateReport = useCallback(async (filters?: ReportFilters) => {
    setIsGenerating(true);
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Generating ${reportType} report for date: ${formattedDate}`);
      
      let allRecords = [...attendanceRecords];
      
      if (reportType === 'monthly') {
        // Get filtered records using the report filters
        const filterParams = {
          selectedDate,
          searchTerm,
          selectedProject,
          selectedLocation,
          selectedPaymentType,
          includeInactive
        };
        
        const filteredRecords = await applyMonthlyFilters(filterParams);
        
        if (filteredRecords) {
          console.log(`Fetched ${filteredRecords.length} total attendance records`);
          allRecords = filteredRecords;
        }
      } else if (searchTerm && searchTerm !== "") {
        allRecords = allRecords.filter(record => 
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && record.present
        );
      } else {
        allRecords = allRecords.filter(record => record.present);
      }

      // Create filter object for the formatter
      const formatterFilters = {
        project: filters?.project || selectedProject,
        location: filters?.location || selectedLocation,
        paymentType: filters?.paymentType || selectedPaymentType,
        searchTerm: filters?.searchTerm || searchTerm
      };

      const formattedData = formatAttendanceForExport(allRecords, reportType, formattedDate, formatterFilters);
      
      const { reportTypeName, formatName, recordCount } = generateFormattedReport(
        formattedData,
        reportType,
        exportFormat,
        selectedDate,
        searchTerm,
        filters?.paymentType || selectedPaymentType
      );
      
      success(`${reportTypeName} exported as ${formatName} successfully`);
      console.log("Export request:", {
        reportType,
        exportFormat,
        date: formattedDate,
        employee: searchTerm || "All",
        project: filters?.project || selectedProject || "All",
        location: filters?.location || selectedLocation || "All",
        paymentType: filters?.paymentType || selectedPaymentType || "All",
        includeInactive,
        employeesCount: filteredEmployees.length,
        recordsCount: recordCount
      });
    } catch (err) {
      error("Failed to generate report");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [
    reportType,
    exportFormat, 
    selectedDate, 
    searchTerm, 
    selectedProject, 
    selectedLocation, 
    selectedPaymentType, 
    includeInactive,
    attendanceRecords,
    applyMonthlyFilters,
    generateFormattedReport,
    filteredEmployees,
    success,
    error
  ]);

  return {
    isGenerating,
    generateReport
  };
};
