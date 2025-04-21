
import { createContext, useContext, ReactNode } from "react";
import { EmployeeContextType } from "./employee/types";
import { useEmployeeState } from "./employee/useEmployeeState";
import { useEmployeeOperations } from "./employee/useEmployeeOperations";
import { useAttendance } from "@/contexts/AttendanceContext"; // for attendance date context

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  // Only try get attendance date if inside a page that provides it (Attendance)
  let currentAttendanceDate: string | undefined = undefined;
  try {
    // Will fail if AttendanceContext doesn't exist, swallow error silently
    const attendanceContext = useAttendance();
    currentAttendanceDate = attendanceContext.currentDate;
    console.log("EmployeeContext - Current attendance date:", currentAttendanceDate);
  } catch (error) {
    console.log("No AttendanceContext available, continuing without attendance date filtering");
  }

  // --- Pass currentAttendanceDate into hook so employee filtering is correct ---
  const {
    employees,
    setEmployees,
    filteredEmployees,
    filters,
    setFilters,
    loading,
    setLoading,
    error,
    dataFetched,
    refreshEmployees
  } = useEmployeeState(currentAttendanceDate);

  const operations = useEmployeeOperations(
    employees,
    setEmployees,
    setLoading
  );

  // Export loading state to consumers to help with synchronization
  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,
        filters,
        setFilters,
        loading,
        error,
        dataFetched,
        refreshEmployees,
        ...operations
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
