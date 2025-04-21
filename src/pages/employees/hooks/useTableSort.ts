
import { useState } from "react";
import { SortField, SortDirection } from "../types/table-types";

export const useTableSort = () => {
  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = (employees: any[]) => {
    const indexedData = employees.map((employee, index) => ({
      employee,
      originalIndex: index
    }));
    
    indexedData.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      
      switch (sortField) {
        case "fullName":
          return direction * (a.employee.fullName || "").localeCompare(b.employee.fullName || "");
        case "iqamaNo":
          return direction * ((a.employee.iqamaNo || 0) - (b.employee.iqamaNo || 0));
        case "project":
          return direction * (a.employee.project || "").localeCompare(b.employee.project || "");
        case "location":
          return direction * (a.employee.location || "").localeCompare(b.employee.location || "");
        case "jobTitle":
          return direction * (a.employee.jobTitle || "").localeCompare(b.employee.jobTitle || "");
        case "paymentType":
          return direction * (a.employee.paymentType || "").localeCompare(b.employee.paymentType || "");
        case "rateOfPayment":
          return direction * (Number(a.employee.rateOfPayment || 0) - Number(b.employee.rateOfPayment || 0));
        case "sponsorship":
          return direction * (a.employee.sponsorship || "").localeCompare(b.employee.sponsorship || "");
        case "status":
          return direction * (a.employee.status || "").localeCompare(b.employee.status || "");
        default:
          return 0;
      }
    });

    return indexedData;
  };

  return {
    sortField,
    sortDirection,
    handleSort,
    getSortedData
  };
};
