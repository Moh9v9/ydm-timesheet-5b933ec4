
import { AttendanceRecord, Employee } from "../types";

/**
 * Format attendance records for export.
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
 * Format employee data for export.
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
