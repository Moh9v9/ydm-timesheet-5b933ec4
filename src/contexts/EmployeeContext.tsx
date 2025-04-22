
import { createContext, useContext, ReactNode } from "react";
import { EmployeeContextType } from "./employee/types";
import { useEmployeeState } from "./employee/useEmployeeState";
import { useEmployeeOperations } from "./employee/useEmployeeOperations";
import { useAttendance } from "@/contexts/AttendanceContext"; // for attendance date context

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  console.log("🟢 EmployeeProvider - Mounting provider");
  
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
    refreshEmployees,
  } = useEmployeeState(currentAttendanceDate);

  const operations = useEmployeeOperations(employees, setEmployees, setLoading);

  console.log("🟢 EmployeeProvider - Provider ready with", employees.length, "employees");

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
        ...operations,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  console.log("🔍 useEmployees - Attempting to access EmployeeContext");
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    console.error("❌ useEmployees - ERROR: Hook called outside of EmployeeProvider!");
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  console.log("✅ useEmployees - Successfully accessed EmployeeContext");
  return context;
};
