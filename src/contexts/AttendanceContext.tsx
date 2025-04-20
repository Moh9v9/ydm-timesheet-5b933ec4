
import { createContext, useContext, ReactNode } from "react";
import { AttendanceContextType } from "./attendance/types";
import { useAttendanceState } from "./attendance/useAttendanceState";
import { useAttendanceOperations } from "./attendance/useAttendanceOperations";

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

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
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};
