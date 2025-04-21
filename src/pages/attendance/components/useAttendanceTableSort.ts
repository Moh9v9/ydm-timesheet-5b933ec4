
import { useState, useCallback } from "react";
import { AttendanceRecord, Employee } from "@/lib/types";

export type SortField = "employee" | "status" | "startTime" | "endTime" | "overtimeHours" | "notes";
export type SortDirection = "asc" | "desc";

interface UseAttendanceTableSortProps {
  attendanceData: AttendanceRecord[];
  filteredEmployees: Employee[];
}

export function useAttendanceTableSort({ attendanceData, filteredEmployees }: UseAttendanceTableSortProps) {
  const [sortField, setSortField] = useState<SortField>("employee");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = useCallback(() => {
    const indexedData = attendanceData.map((record, index) => ({
      record,
      originalIndex: index
    }));

    indexedData.sort((a, b) => {
      const employeeA = filteredEmployees.find(emp => emp.id === a.record.employeeId);
      const employeeB = filteredEmployees.find(emp => emp.id === b.record.employeeId);

      if (!employeeA || !employeeB) return 0;
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "employee":
          return direction * employeeA.fullName.localeCompare(employeeB.fullName);
        case "status":
          return direction * (Number(a.record.present) - Number(b.record.present));
        case "startTime":
          return direction * (a.record.startTime || "").localeCompare(b.record.startTime || "");
        case "endTime":
          return direction * (a.record.endTime || "").localeCompare(b.record.endTime || "");
        case "overtimeHours":
          return direction * ((a.record.overtimeHours || 0) - (b.record.overtimeHours || 0));
        case "notes":
          return direction * (a.record.note || "").localeCompare(b.record.note || "");
        default:
          return 0;
      }
    });

    return indexedData;
  }, [attendanceData, filteredEmployees, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    getSortedData
  };
}
