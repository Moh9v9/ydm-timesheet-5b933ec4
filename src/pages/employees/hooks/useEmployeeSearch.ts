
import { useState } from "react";
import { Employee } from "@/lib/types";

export const useEmployeeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filterEmployeesBySearch = (employees: Employee[], term: string) => {
    return employees.filter(employee => 
      employee.fullName.toLowerCase().includes(term.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(term.toLowerCase()) ||
      employee.project.toLowerCase().includes(term.toLowerCase()) ||
      employee.location.toLowerCase().includes(term.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(term.toLowerCase())
    );
  };

  return {
    searchTerm,
    showFilters,
    setSearchTerm,
    setShowFilters,
    filterEmployeesBySearch
  };
};
