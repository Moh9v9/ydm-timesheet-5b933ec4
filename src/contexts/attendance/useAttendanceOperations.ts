
import { AttendanceRecord } from "@/lib/types";

export const useAttendanceOperations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  // Get attendance record by ID
  const getAttendanceRecord = (id: string) => {
    return attendanceRecords.find(record => record.id === id);
  };

  // Get attendance record by employee ID and date
  const getRecordsByEmployeeAndDate = (employeeId: string, date: string) => {
    return attendanceRecords.find(
      record => record.employeeId === employeeId && record.date === date
    );
  };

  // Add new attendance record
  const addAttendanceRecord = async (record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newRecord: AttendanceRecord = {
      ...record,
      id: `${Date.now()}`,
    };
    
    setAttendanceRecords([...attendanceRecords, newRecord]);
    setLoading(false);
    return newRecord;
  };

  // Update attendance record
  const updateAttendanceRecord = async (
    id: string,
    recordData: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedRecords = attendanceRecords.map(record => {
      if (record.id === id) {
        return { ...record, ...recordData };
      }
      return record;
    });
    
    setAttendanceRecords(updatedRecords);
    setLoading(false);
    
    const updatedRecord = updatedRecords.find(record => record.id === id);
    if (!updatedRecord) {
      throw new Error("Attendance record not found");
    }
    
    return updatedRecord;
  };

  // Delete attendance record
  const deleteAttendanceRecord = async (id: string): Promise<void> => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
    setLoading(false);
  };

  // Bulk save attendance records
  const bulkSaveAttendance = async (
    records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]
  ): Promise<AttendanceRecord[]> => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRecords: AttendanceRecord[] = [];
    
    for (const record of records) {
      if ("id" in record) {
        const existingIndex = attendanceRecords.findIndex(r => r.id === record.id);
        if (existingIndex !== -1) {
          attendanceRecords[existingIndex] = record;
        } else {
          newRecords.push(record);
        }
      } else {
        const newRecord: AttendanceRecord = {
          ...record,
          id: `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        };
        newRecords.push(newRecord);
      }
    }
    
    setAttendanceRecords([...attendanceRecords.filter(r => 
      !records.some(newR => "id" in newR && newR.id === r.id)
    ), ...newRecords]);
    
    setLoading(false);
    return newRecords;
  };

  return {
    getAttendanceRecord,
    getRecordsByEmployeeAndDate,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    bulkSaveAttendance,
  };
};
