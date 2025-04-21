
import { AttendanceRecord, Employee, ExportFormat } from "../types";
import { format, parse, startOfMonth, endOfMonth } from 'date-fns';

export const formatAttendanceForExport = (
  records: AttendanceRecord[],
  reportType: string,
  date: string
): Record<string, any>[] => {
  let filteredRecords = [...records];

  if (reportType === 'daily') {
    filteredRecords = records.filter(record => record.date === date);
  } else if (reportType === 'weekly') {
    const selectedDate = new Date(date);
    const sevenDaysLater = new Date(selectedDate);
    sevenDaysLater.setDate(selectedDate.getDate() + 6);
    filteredRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= selectedDate && recordDate <= sevenDaysLater;
    });
  } else if (reportType === 'monthly') {
    try {
      const selectedDate = parse(date, 'yyyy-MM-dd', new Date());
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      filteredRecords = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });
      console.log(\`Filtered \${filteredRecords.length} records for month of \${format(selectedDate, 'MMMM yyyy')}\`);
    } catch (err) {
      console.error("Error filtering monthly records:", err);
    }
  }

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
