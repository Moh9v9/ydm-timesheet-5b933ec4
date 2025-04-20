
import React, { createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";
import { AttendanceContextType } from "./attendance/types";
import { useAttendanceState } from "./attendance/useAttendanceState";
import { 
  filterAttendanceRecords, 
  findAttendanceRecord, 
  findRecordByEmployeeAndDate 
} from "./attendance/operations";

const AttendanceContext = createContext<AttendanceContextType | null>(null);

export const AttendanceProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    attendanceRecords,
    setAttendanceRecords,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
    loading,
    setLoading
  } = useAttendanceState();

  // Filter records based on current filters
  const filteredRecords = filterAttendanceRecords(attendanceRecords, filters);

  // Get a specific attendance record by ID
  const getAttendanceRecord = (id: string): AttendanceRecord | undefined => {
    return findAttendanceRecord(attendanceRecords, id);
  };

  // Get record by employee and date
  const getRecordsByEmployeeAndDate = (employeeId: string, date: string): AttendanceRecord | undefined => {
    return findRecordByEmployeeAndDate(attendanceRecords, employeeId, date);
  };

  // Create new attendance record
  const addAttendanceRecord = async (record: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> => {
    setLoading(true);
    try {
      const newRecord = {
        ...record,
        id: uuidv4()
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
      return newRecord;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing attendance record
  const updateAttendanceRecord = async (id: string, record: Partial<AttendanceRecord>): Promise<AttendanceRecord> => {
    setLoading(true);
    try {
      const existingRecord = getAttendanceRecord(id);
      if (!existingRecord) {
        throw new Error(`Attendance record with ID ${id} not found`);
      }

      const updatedRecord = {
        ...existingRecord,
        ...record
      };

      setAttendanceRecords(
        attendanceRecords.map(rec => (rec.id === id ? updatedRecord : rec))
      );

      return updatedRecord;
    } finally {
      setLoading(false);
    }
  };

  // Delete an attendance record
  const deleteAttendanceRecord = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      setAttendanceRecords(attendanceRecords.filter(rec => rec.id !== id));
    } finally {
      setLoading(false);
    }
  };

  // Bulk save attendance records (create or update)
  const bulkSaveAttendance = async (
    records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]
  ): Promise<AttendanceRecord[]> => {
    setLoading(true);
    try {
      const savedRecords: AttendanceRecord[] = [];
      const newAttendanceRecords = [...attendanceRecords];
      
      for (const record of records) {
        // If the record has an ID and it's not temporary
        if ('id' in record && !record.id.startsWith('temp_')) {
          // Update existing record
          const index = newAttendanceRecords.findIndex(r => r.id === record.id);
          if (index !== -1) {
            newAttendanceRecords[index] = { ...record } as AttendanceRecord;
            savedRecords.push(newAttendanceRecords[index]);
          }
        } else {
          // Check if there's already a record for this employee and date
          const existingRecord = findRecordByEmployeeAndDate(
            newAttendanceRecords,
            record.employeeId,
            record.date
          );
          
          if (existingRecord) {
            // Update existing record
            const index = newAttendanceRecords.findIndex(r => r.id === existingRecord.id);
            if (index !== -1) {
              const updatedRecord = { ...existingRecord, ...record, id: existingRecord.id };
              newAttendanceRecords[index] = updatedRecord;
              savedRecords.push(updatedRecord);
            }
          } else {
            // Create new record
            const newRecord = { ...record, id: uuidv4() } as AttendanceRecord;
            newAttendanceRecords.push(newRecord);
            savedRecords.push(newRecord);
          }
        }
      }
      
      setAttendanceRecords(newAttendanceRecords);
      return savedRecords;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        filteredRecords,
        currentDate,
        setCurrentDate,
        filters,
        setFilters,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        getAttendanceRecord,
        getRecordsByEmployeeAndDate,
        bulkSaveAttendance,
        loading
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
