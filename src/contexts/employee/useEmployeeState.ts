
import { useState } from "react";
import { Employee, EmployeeFilters } from "@/lib/types";

export const useEmployeeState = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<EmployeeFilters>({
    status: "Active"
  });
  const [loading, setLoading] = useState(false);

  // Filter employees based on current filters
  const filteredEmployees = employees.filter(employee => {
    if (filters.status && employee.status !== filters.status) return false;
    if (filters.project && employee.project !== filters.project) return false;
    if (filters.location && employee.location !== filters.location) return false;
    if (filters.paymentType && employee.paymentType !== filters.paymentType) return false;
    if (filters.sponsorship && employee.sponsorship !== filters.sponsorship) return false;
    return true;
  });

  return {
    employees,
    setEmployees,
    filteredEmployees,
    filters,
    setFilters,
    loading,
    setLoading,
  };
};
