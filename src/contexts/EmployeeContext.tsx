
import { createContext, useContext, ReactNode } from "react";
import { EmployeeContextType } from "./employee/types";
import { useEmployeeState } from "./employee/useEmployeeState";
import { useEmployeeOperations } from "./employee/useEmployeeOperations";

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const {
    employees,
    setEmployees,
    filteredEmployees,
    filters,
    setFilters,
    loading,
    setLoading,
    error,
    refreshEmployees
  } = useEmployeeState();

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
