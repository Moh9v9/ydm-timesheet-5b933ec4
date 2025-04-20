
import { useState } from "react";
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";

export const useAttendanceState = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: currentDate
  });
  const [loading, setLoading] = useState(false);

  // Filter attendance records based on current filters
  const filteredRecords = attendanceRecords.filter(record => {
    if (filters.date && record.date !== filters.date) return false;
    if (filters.employeeId && record.employeeId !== filters.employeeId) return false;
    if (filters.present !== undefined && record.present !== filters.present) return false;
    return true;
  });

  return {
    attendanceRecords,
    setAttendanceRecords,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
    loading,
    setLoading,
    filteredRecords,
  };
};
