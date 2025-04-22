import { createContext, useContext, ReactNode, useEffect } from "react";
import { AttendanceContextType } from "./attendance/types";
import { useAttendanceState } from "./attendance/useAttendanceState";
import { useAttendanceOperations } from "./attendance/useAttendanceOperations";

const getTodayISODate = () => new Date().toISOString().split('T')[0];

const AttendanceContext = createContext<AttendanceContextType>({
  attendanceRecords: [],
  filteredRecords: [],
  currentDate: getTodayISODate(),
  setCurrentDate: () => {},
  filters: { date: getTodayISODate() },
  setFilters: () => {},
  loading: false,
  refreshData: () => {},
  addAttendanceRecord: async () => ({
    id: '',
    employeeId: '',
    employeeName: '',
    date: '',
    present: false,
    startTime: '',
    endTime: '',
    overtimeHours: 0,
    note: '',
  }),
  updateAttendanceRecord: async () => ({
    id: '',
    employeeId: '',
    employeeName: '',
    date: '',
    present: false,
    startTime: '',
    endTime: '',
    overtimeHours: 0,
    note: '',
  }),
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
    refreshData,
  } = useAttendanceState();

  const operations = useAttendanceOperations(
    attendanceRecords,
    setAttendanceRecords,
    setLoading
  );

  useEffect(() => {
    console.log("AttendanceContext - Current date changed to:", currentDate);
    setFilters(prev => ({ ...prev, date: currentDate }));
  }, [currentDate, setFilters]);

  useEffect(() => {
    const freshDate = getTodayISODate();
    console.log("AttendanceContext - Initializing with fresh date on mount:", freshDate);
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
        refreshData,
        ...operations,
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
