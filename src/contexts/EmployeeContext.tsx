
import { createContext, useContext, ReactNode, useEffect } from "react";
import { EmployeeContextType } from "./employee/types";
import { useEmployeeState } from "./employee/useEmployeeState";
import { useEmployeeOperations } from "./employee/useEmployeeOperations";
import { useAttendance } from "@/contexts/AttendanceContext";
import { employeeMatchesAttendanceFilters } from "./employee/employeeAttendanceFilter";
import { employeeMatchesFilters } from "./employee/employeeFilter";

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  // Determine if we're in attendance context or regular employees context
  let isAttendanceView = false;
  let currentAttendanceDate: string | undefined = undefined;
  
  try {
    const attendanceContext = useAttendance();
    if (attendanceContext) {
      isAttendanceView = true;
      currentAttendanceDate = attendanceContext.currentDate;
      console.log("EmployeeContext - Got attendance date for filtering:", currentAttendanceDate);
    }
  } catch (error) {
    console.log("EmployeeContext - No AttendanceContext available, using regular employee filters");
  }

  // Use the appropriate filter function based on context
  const filterFunction = isAttendanceView ? employeeMatchesAttendanceFilters : employeeMatchesFilters;

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
  } = useEmployeeState(
    isAttendanceView ? currentAttendanceDate : undefined,
    filterFunction
  );

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
        // Convert Error object to string if it exists
        error: error ? error.message : null,
        dataFetched,
        // Make refreshEmployees return a Promise
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
