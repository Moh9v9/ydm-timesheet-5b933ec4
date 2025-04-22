
import { AttendanceRecord } from "@/lib/types";
import { readAttendanceByDate } from "@/lib/googleSheets";

export const useAttendanceQueries = () => {
  // Get attendance record by ID
  const getAttendanceRecord = (attendanceRecords: AttendanceRecord[], id: string) => {
    return attendanceRecords.find(record => record.id === id);
  };

  // Get attendance record by employee ID and date
  const getRecordsByEmployeeAndDate = async (employeeId: string, date: string): Promise<AttendanceRecord | null> => {
    try {
      // Fetch attendance records for the specified date from Google Sheets
      const records = await readAttendanceByDate(date);
      
      // Find the record matching the employee ID
      const record = records.find(r => r.employeeId === employeeId);
      
      if (!record) {
        return null;
      }
      
      return {
        id: record.id,
        employeeId: record.employeeId,
        employeeName: record.employeeName || '',
        date: record.date,
        present: record.present === 'true' || record.present === true,
        startTime: record.startTime || '',
        endTime: record.endTime || '',
        overtimeHours: Number(record.overtimeHours) || 0,
        note: record.note || ''
      };
    } catch (error) {
      console.error('Error fetching attendance record:', error);
      return null;
    }
  };

  return {
    getAttendanceRecord,
    getRecordsByEmployeeAndDate,
  };
};
