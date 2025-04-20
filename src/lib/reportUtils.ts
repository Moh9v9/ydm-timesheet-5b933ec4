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
 * Adds logo and app name at the top.
 */
const convertToPDF = (data: Record<string, any>[]): Uint8Array => {
  const APP_NAME = "AttendanceX";
  // Placeholder logo
  const LOGO_URL = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=128&q=80";
  
  // Helper to fetch image as DataURL (since jsPDF addImage needs base64/dataURL)
  function getImageDataUrl(url: string): Promise<string> {
    return fetch(url)
      .then(res => res.blob())
      .then(blob => new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }));
  }

  // This function needs to be async to fetch and embed the logo.
  // Since our current API is not async, we'll do this synchronously,
  // but you may want to refactor for full async later.

  let imageDataUrl: string | undefined = undefined;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", LOGO_URL, false); // sync xhr call (old JS trick)
  xhr.responseType = "blob";
  try {
    xhr.send();
    if (xhr.status === 200) {
      const reader = new FileReader();
      reader.onloadend = function() {
        imageDataUrl = reader.result as string;
      };
      reader.readAsDataURL(xhr.response);
      // Block (sync) until finished
      const start = Date.now();
      while (!imageDataUrl && Date.now() - start < 2000) {} // wait max 2s
    }
  } catch (e) {
    // If the logo fetch fails, just skip it
  }

  if (!data || data.length === 0) {
    const doc = new jsPDF();
    // Add logo and name (minimal, since no data)
    if (imageDataUrl) doc.addImage(imageDataUrl, "JPEG", 14, 10, 16, 16);
    doc.setFontSize(16);
    doc.text(APP_NAME, 32, 20);
    doc.text("No data available", 20, 40);
    return new Uint8Array(doc.output('arraybuffer'));
  }

  const doc = new jsPDF();

  // Add logo left top corner (JPEG/PNG), then app name
  if (imageDataUrl) doc.addImage(imageDataUrl, "JPEG", 14, 10, 16, 16);
  doc.setFontSize(18);
  doc.text(APP_NAME, 34, 22);

  // Add main title below logo/name 
  doc.setFontSize(15);
  doc.text("Generated Report", 14, 34);
  
  // Format the date correctly, shown below the title
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.setFontSize(11);
  doc.text(`Date: ${formattedDate}`, 14, 41);

  // Extract headers/rows
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => String(row[header] || '')));

  // Add table with data
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 47,
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
}

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
