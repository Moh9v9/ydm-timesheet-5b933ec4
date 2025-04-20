
import { createContext, useContext, useState, ReactNode } from "react";
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";
import { format, parseISO } from "date-fns";

// Generate today's date in ISO format
const TODAY = new Date().toISOString().split('T')[0];

// Mock data for attendance records
const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "1",
    date: TODAY, // Today's date
    present: true,
    startTime: "07:00",
    endTime: "17:00",
    overtimeHours: 0
  },
  {
    id: "2",
    employeeId: "2",
    date: TODAY,
    present: true,
    startTime: "07:30",
    endTime: "17:30",
    overtimeHours: 0.5
  },
  {
    id: "3",
    employeeId: "3",
    date: TODAY,
    present: false,
    startTime: "", // Empty for absent
    endTime: "",
    overtimeHours: 0
  },
  {
    id: "4",
    employeeId: "4",
    date: TODAY,
    present: true,
    startTime: "07:00",
    endTime: "17:00",
    overtimeHours: 0
  },
  {
    id: "5",
    employeeId: "5",
    date: TODAY,
    present: true,
    startTime: "07:15",
    endTime: "18:30",
    overtimeHours: 1.5
  }
];

interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  filteredRecords: AttendanceRecord[];
  currentDate: string; // ISO date string
  setCurrentDate: (date: string) => void;
  filters: AttendanceFilters;
  setFilters: (filters: AttendanceFilters) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => Promise<AttendanceRecord>;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => Promise<AttendanceRecord>;
  deleteAttendanceRecord: (id: string) => Promise<void>;
  getAttendanceRecord: (id: string) => AttendanceRecord | undefined;
  getRecordsByEmployeeAndDate: (employeeId: string, date: string) => AttendanceRecord | undefined;
  bulkSaveAttendance: (records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]) => Promise<AttendanceRecord[]>;
  loading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [currentDate, setCurrentDate] = useState<string>(TODAY);
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: currentDate
  });
  const [loading, setLoading] = useState(false);

  // Filter attendance records based on current filters
  const filteredRecords = attendanceRecords.filter(record => {
    if (filters.date && record.date !== filters.date) return false;
    if (filters.employeeId && record.employeeId !== filters.employeeId) return false;
    if (filters.present !== undefined && record.present !== filters.present) return false;
    return true;
  });

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
    
    // Generate new ID
    const newRecord: AttendanceRecord = {
      ...record,
      id: `${Date.now()}`,
    };
    
    setAttendanceRecords(prev => [...prev, newRecord]);
    setLoading(false);
    return newRecord;
  };

  // Update attendance record
  const updateAttendanceRecord = async (
    id: string,
    recordData: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> => {
    setLoading(true);
    
    // Simulate API delay
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setAttendanceRecords(prev => prev.filter(record => record.id !== id));
    setLoading(false);
  };

  // Bulk save attendance records
  const bulkSaveAttendance = async (
    records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]
  ): Promise<AttendanceRecord[]> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const savedRecords: AttendanceRecord[] = [];
    const updatedAllRecords = [...attendanceRecords];
    
    // Process each record
    for (const record of records) {
      if ("id" in record && record.id && !record.id.startsWith('temp_')) {
        // Update existing record
        const existingIndex = updatedAllRecords.findIndex(r => r.id === record.id);
        if (existingIndex !== -1) {
          updatedAllRecords[existingIndex] = record as AttendanceRecord;
          savedRecords.push(updatedAllRecords[existingIndex]);
        }
      } else {
        // Find if we already have a record for this employee and date
        const existingRecordIndex = updatedAllRecords.findIndex(
          r => r.employeeId === record.employeeId && r.date === record.date
        );
        
        if (existingRecordIndex !== -1) {
          // Update the existing record
          updatedAllRecords[existingRecordIndex] = {
            ...updatedAllRecords[existingRecordIndex],
            ...record,
            id: updatedAllRecords[existingRecordIndex].id
          };
          savedRecords.push(updatedAllRecords[existingRecordIndex]);
        } else {
          // Add new record
          const newRecord: AttendanceRecord = {
            ...record,
            id: `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          };
          updatedAllRecords.push(newRecord);
          savedRecords.push(newRecord);
        }
      }
    }
    
    // Update state with new records
    setAttendanceRecords(updatedAllRecords);
    
    setLoading(false);
    return savedRecords;
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

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
