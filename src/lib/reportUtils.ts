
import { AttendanceRecord, Employee, ExportFormat } from "./types";

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
 * Convert data to XLSX format (simplified - in real scenario would use a library like xlsx)
 * This is a placeholder that generates CSV as a fallback
 */
const convertToXLSX = (data: Record<string, any>[]): string => {
  // In a real app, we would use a library like xlsx or exceljs to generate a proper Excel file
  // For this demo, we'll use CSV as a fallback
  return convertToCSV(data);
};

/**
 * Convert data to PDF format (simplified - in real scenario would use a library like pdfmake)
 * This is a placeholder that generates a simple text representation
 */
const convertToPDF = (data: Record<string, any>[]): string => {
  // In a real app, we would use a library like pdfmake or jspdf to generate a proper PDF file
  // For this demo, we'll create a simple text format
  let output = '';
  
  // Add headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    output += headers.join('\t') + '\n';
    output += headers.map(() => '---').join('\t') + '\n';
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => String(row[header]));
      output += values.join('\t') + '\n';
    }
  }
  
  return output;
};

/**
 * Generate file content based on export format
 */
export const generateFileContent = (
  data: Record<string, any>[],
  format: ExportFormat
): { content: string; mimeType: string } => {
  let content: string;
  let mimeType: string;
  
  switch (format) {
    case 'csv':
      content = convertToCSV(data);
      mimeType = 'text/csv';
      break;
    case 'xlsx':
      content = convertToXLSX(data);
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case 'pdf':
      content = convertToPDF(data);
      mimeType = 'application/pdf';
      break;
    default:
      content = convertToCSV(data);
      mimeType = 'text/csv';
  }
  
  return { content, mimeType };
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
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
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
