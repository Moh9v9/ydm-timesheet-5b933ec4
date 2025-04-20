
import { AttendanceRecord } from "@/lib/types";

export const filterAttendanceRecords = (
  records: AttendanceRecord[],
  filters: { date?: string; employeeId?: string; present?: boolean }
) => {
  return records.filter(record => {
    if (filters.date && record.date !== filters.date) return false;
    if (filters.employeeId && record.employeeId !== filters.employeeId) return false;
    if (filters.present !== undefined && record.present !== filters.present) return false;
    return true;
  });
};

export const findAttendanceRecord = (
  records: AttendanceRecord[],
  id: string
): AttendanceRecord | undefined => {
  return records.find(record => record.id === id);
};

export const findRecordByEmployeeAndDate = (
  records: AttendanceRecord[],
  employeeId: string,
  date: string
): AttendanceRecord | undefined => {
  return records.find(
    record => record.employeeId === employeeId && record.date === date
  );
};
