
import { createContext, useContext, ReactNode, useEffect } from "react";
import { AttendanceContextType } from "./attendance/types";
import { useAttendanceState } from "./attendance/useAttendanceState";
import { useAttendanceOperations } from "./attendance/useAttendanceOperations";

// Function to always get a fresh today date
const getTodayISODate = () => new Date().toISOString().split('T')[0];

// Create a context with a default value to prevent the "must be used within Provider" error
const AttendanceContext = createContext<AttendanceContextType>({
  attendanceRecords: [],
  filteredRecords: [],
  currentDate: getTodayISODate(), // Always use fresh date
  setCurrentDate: () => {},
  filters: { date: getTodayISODate() }, // Always use fresh date
  setFilters: () => {},
  loading: false,
  // Default implementations that will never be used but satisfy TypeScript
  addAttendanceRecord: async () => ({ id: '', employeeId: '', employeeName: '', date: '', present: false, startTime: '', endTime: '', overtimeHours: 0, note: '' }),
  updateAttendanceRecord: async () => ({ id: '', employeeId: '', employeeName: '', date: '', present: false, startTime: '', endTime: '', overtimeHours: 0, note: '' }),
  deleteAttendanceRecord: async () => {},
  getAttendanceRecord: () => undefined,
  getRecordsByEmployeeAndDate: async () => null,
  bulkSaveAttendance: async () => [],
});

export const AttendanceProvider = ({ children }: { children: ReactNode }) => {
  const {
    attendanceRecords,
    setAttendanceRecords,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
    loading,
    setLoading,
    filteredRecords,
  } = useAttendanceState();

  const operations = useAttendanceOperations(
    attendanceRecords,
    setAttendanceRecords,
    setLoading
  );
  
  // Ensure filters are updated with the current date whenever it changes
  useEffect(() => {
    console.log("AttendanceContext - Current date changed to:", currentDate);
    setFilters(prev => ({ ...prev, date: currentDate }));
  }, [currentDate, setFilters]);

  // Add an effect to ensure date is always fresh on remount
  useEffect(() => {
    const freshDate = getTodayISODate();
    console.log("AttendanceContext - Initializing with fresh date on mount:", freshDate);
    
    // This ensures that when the provider mounts, we always start with today's date
    // This is especially important after a page refresh
    setCurrentDate(freshDate);
  }, [setCurrentDate]);

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        filteredRecords,
        currentDate,
        setCurrentDate,
        filters,
        setFilters,
        loading,
        ...operations
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
