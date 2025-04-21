
import convertToCSV from './csvUtils';
import convertToXLSX from './xlsxUtils';
import convertToPDF from './pdfUtils';
import { formatAttendanceForExport, formatEmployeesForExport } from './exportFormatters';
import downloadFile from './downloadUtils';

import { ExportFormat } from "../types";

/**
 * Generate file content based on export format
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

export {
  convertToCSV,
  convertToXLSX,
  convertToPDF,
  formatAttendanceForExport,
  formatEmployeesForExport,
  downloadFile,
};
