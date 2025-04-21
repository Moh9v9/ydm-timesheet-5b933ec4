
import { createContext, useContext, ReactNode, useEffect } from "react";
import { EmployeeContextType } from "./employee/types";
import { useEmployeeState } from "./employee/useEmployeeState";
import { useEmployeeOperations } from "./employee/useEmployeeOperations";
import { useAttendance } from "@/contexts/AttendanceContext";
import { employeeMatchesAttendanceFilters } from "./employee/employeeAttendanceFilter";

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  // Get current attendance date from AttendanceContext if available
  let currentAttendanceDate: string | undefined = undefined;
  try {
    const attendanceContext = useAttendance();
    currentAttendanceDate = attendanceContext?.currentDate;
    console.log("EmployeeContext - Got attendance date for filtering:", currentAttendanceDate);
  } catch (error) {
    console.log("EmployeeContext - No AttendanceContext available, using regular employee filters");
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
  } = useEmployeeState(currentAttendanceDate, employeeMatchesAttendanceFilters);

  const operations = useEmployeeOperations(
    employees,
    setEmployees,
    setLoading
  );

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,
        filters,
        setFilters,
        loading,
        // Fix #1: Convert Error object to string if it exists
        error: error ? error.message : null,
        dataFetched,
        // Fix #2: Make refreshEmployees return a Promise
        refreshEmployees: async () => {
          return Promise.resolve(refreshEmployees());
        },
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
