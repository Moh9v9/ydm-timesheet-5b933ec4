import { AttendanceRecord, Employee, ExportFormat } from "./types";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Convert data to CSV format
 */
const convertToCSV = (data: Record<string, any>[]): string => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

/**
 * Convert data to XLSX format using xlsx library
 */
const convertToXLSX = (data: Record<string, any>[]): Uint8Array => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  
  // Generate a binary string from the workbook
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  return new Uint8Array(excelBuffer);
};

/**
 * Convert data to PDF format using jsPDF library
 */
const convertToPDF = (data: Record<string, any>[]): Uint8Array => {
  if (!data || data.length === 0) {
    // Return an empty PDF if there's no data
    const emptyPdf = new jsPDF();
    emptyPdf.text("No data available", 20, 20);
    return new Uint8Array(emptyPdf.output('arraybuffer'));
  }
  
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Extract rows for jsPDF-AutoTable
  const rows = data.map(row => 
    headers.map(header => String(row[header] || ''))
  );
  
  // Add app name above the report title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text("YDM TimeSheet", 14, 13);
  
  // Removed "Generated Report" text from the header
  
  // Format the date correctly with en-US locale and options
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(12);
  doc.text(`Date: ${formattedDate}`, 14, 27);
  
  // Add table with data
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [63, 81, 181],
    },
  });
  
  // Convert to Uint8Array
  return new Uint8Array(doc.output('arraybuffer'));
};

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

/**
 * Format attendance records for export
 */
export const formatAttendanceForExport = (
  records: AttendanceRecord[], 
  reportType: string, 
  date: string
): Record<string, any>[] => {
  return records.map(record => ({
    'Date': record.date,
    'Employee Name': record.employeeName,
    'Present': record.present ? 'Yes' : 'No',
    'Start Time': record.startTime || 'N/A',
    'End Time': record.endTime || 'N/A',
    'Overtime Hours': record.overtimeHours,
    'Notes': record.note || ''
  }));
};

/**
 * Format employee data for export
 */
export const formatEmployeesForExport = (
  employees: Employee[]
): Record<string, any>[] => {
  return employees.map(employee => ({
    'Full Name': employee.fullName,
    'Iqama No': employee.iqamaNo,
    'Project': employee.project,
    'Location': employee.location,
    'Job Title': employee.jobTitle,
    'Payment Type': employee.paymentType,
    'Rate of Payment': employee.rateOfPayment,
    'Sponsorship': employee.sponsorship,
    'Status': employee.status
  }));
};

/**
 * Download generated file
 */
export const downloadFile = (content: string | Uint8Array, filename: string, mimeType: string, isBinary: boolean = false): void => {
  // Create appropriate blob based on content type
  const blob = isBinary 
    ? new Blob([content as Uint8Array], { type: mimeType })
    : new Blob([content as string], { type: mimeType });
    
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
