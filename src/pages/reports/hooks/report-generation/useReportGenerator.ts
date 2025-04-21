
import { format } from "date-fns";
import { ExportFormat, ReportType } from "@/lib/types";
import { generateFileContent } from "@/lib/reportUtils";
import { downloadFile } from "@/lib/reportUtils";
import { useMemo } from "react";

export const useReportGenerator = () => {
  // Memoize the function to prevent unnecessary re-creation on re-renders
  const generateFormattedReport = useMemo(() => (
    formattedData: any[],
    reportType: ReportType,
    exportFormat: ExportFormat,
    selectedDate: Date,
    searchTerm?: string,
    selectedPaymentType?: string
  ) => {
    const reportTypeName = {
      daily: "Daily Attendance",
      monthly: "Monthly Attendance",
    }[reportType];
    
    const formatName = {
      csv: "CSV",
      xlsx: "Excel",
      pdf: "PDF"
    }[exportFormat];
    
    const { content, mimeType, isBinary } = generateFileContent(formattedData, exportFormat);
    
    const dateStr = format(selectedDate, "yyyyMMdd");
    const employeeStr = searchTerm ? `-${searchTerm.replace(/\s+/g, '-')}` : '';
    const paymentTypeStr = selectedPaymentType !== 'all' ? `-${selectedPaymentType}` : '';
    const filename = `${reportType}-attendance${employeeStr}${paymentTypeStr}-${dateStr}.${exportFormat}`;
    
    downloadFile(content, filename, mimeType, isBinary);
    
    return {
      reportTypeName,
      formatName,
      recordCount: formattedData.length
    };
  }, []);

  return {
    generateFormattedReport
  };
};
