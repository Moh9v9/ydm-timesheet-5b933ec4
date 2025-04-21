
import { createContext, useContext, ReactNode, useEffect } from "react";
import { EmployeeContextType } from "./employee/types";
import { useEmployeeState } from "./employee/useEmployeeState";
import { useEmployeeOperations } from "./employee/useEmployeeOperations";
import { useAttendance } from "@/contexts/AttendanceContext"; // for attendance date context

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  // Get current attendance date from AttendanceContext if available
  let currentAttendanceDate: string | undefined = undefined;
  try {
    const attendanceContext = useAttendance();
    currentAttendanceDate = attendanceContext?.currentDate;
    console.log("EmployeeContext - Got attendance date for filtering:", currentAttendanceDate);
  } catch (error) {
    console.log("EmployeeContext - No AttendanceContext available, continuing without date filtering");
  }

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
