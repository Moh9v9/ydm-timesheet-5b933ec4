
import { useState } from "react";
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";
import { MOCK_ATTENDANCE, TODAY } from "./mock-data";

export const useAttendanceState = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [currentDate, setCurrentDate] = useState<string>(TODAY);
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: currentDate
  });
  const [loading, setLoading] = useState(false);

  return {
    attendanceRecords,
    setAttendanceRecords,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
    loading,
    setLoading
  };
};
