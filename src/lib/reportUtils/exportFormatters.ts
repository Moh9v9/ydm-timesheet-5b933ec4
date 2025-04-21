
import { AttendanceRecord, Employee, ExportFormat } from "../types";
import { format, parse, startOfMonth, endOfMonth } from 'date-fns';

export const formatAttendanceForExport = (
  records: AttendanceRecord[],
  reportType: string,
  date: string,
  filters?: {
    project?: string;
    location?: string;
    paymentType?: string;
    searchTerm?: string;
  }
): Record<string, any>[] => {
  let filteredRecords = [...records];

  // Apply date filtering
  if (reportType === 'daily') {
    filteredRecords = records.filter(record => record.date === date);
  } else if (reportType === 'monthly') {
    try {
      const selectedDate = parse(date, 'yyyy-MM-dd', new Date());
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      filteredRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      console.log(`Filtered ${filteredRecords.length} records for month of ${format(selectedDate, 'MMMM yyyy')}`);
    } catch (err) {
      console.error("Error filtering monthly records:", err);
    }
  }

  // Apply additional filters if provided
  if (filters) {
    // Apply name search filter if provided
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter(record => 
        record.employeeName.toLowerCase().includes(searchLower)
      );
    }

    // These filters depend on having employee data attached to the record
    // For integration with other filters, the calling code should pre-filter these
  }

  // Sort records by date then by employee name for better readability
  filteredRecords.sort((a, b) => {
    // First compare by date
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;
    
    // If dates are equal, compare by employee name
    return a.employeeName.localeCompare(b.employeeName);
  });

  return filteredRecords.map(record => ({
    'Date': record.date,
    'Employee Name': record.employeeName,
    'Present': record.present ? 'Yes' : 'No',
    'Start Time': record.startTime || 'N/A',
    'End Time': record.endTime || 'N/A',
    'Overtime Hours': record.overtimeHours,
    'Notes': record.note || ''
  }));
};

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
