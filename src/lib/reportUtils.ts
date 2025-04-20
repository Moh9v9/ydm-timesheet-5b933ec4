
import { AttendanceRecord, Employee, ExportFormat } from "./types";
import { convertToCSV } from "./export/csvUtils";
import { convertToXLSX } from "./export/xlsxUtils";
import { convertToPDF } from "./export/pdfUtils";
import { formatAttendanceForExport, formatEmployeesForExport } from "./export/formatters";
import { downloadFile } from "./export/downloadUtils";

/**
 * Generate file content based on export format.
 */
export const generateFileContent = (
  data: Record<string, any>[],
  format: ExportFormat
): { content: string | Uint8Array; mimeType: string; isBinary: boolean } => {
  let content: string | Uint8Array;
  let mimeType: string;
  let isBinary: boolean = false;
  switch (format) {
    case 'csv':
      content = convertToCSV(data);
      mimeType = 'text/csv';
      break;
    case 'xlsx':
      content = convertToXLSX(data);
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      isBinary = true;
      break;
    case 'pdf':
      content = convertToPDF(data);
      mimeType = 'application/pdf';
      isBinary = true;
      break;
    default:
      content = convertToCSV(data);
      mimeType = 'text/csv';
  }
  return { content, mimeType, isBinary };
};

// Exporting formatters and download for external usage.
export {
  formatAttendanceForExport,
  formatEmployeesForExport,
  downloadFile
};
