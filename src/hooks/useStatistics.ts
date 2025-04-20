
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { AttendanceRecord } from "@/lib/types";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}

const getFormattedToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

const getTodayAttendanceRecords = (
  attendanceRecords: AttendanceRecord[],
  date: string
): AttendanceRecord[] => {
  return attendanceRecords.filter((record) => record.date === date);
};

const calculateAttendanceCounts = (records: AttendanceRecord[]) => {
  const presentCount = records.filter((record) => record.present).length;
  const absentCount = records.filter((record) => !record.present).length;
  
  return {
    presentCount,
    absentCount
  };
};

export const useStatistics = () => {
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });

  useEffect(() => {
    const today = getFormattedToday();
    const todayRecords = getTodayAttendanceRecords(attendanceRecords, today);
    const { presentCount, absentCount } = calculateAttendanceCounts(todayRecords);

    setStats({
      totalEmployees: filteredEmployees.length,
      presentToday: presentCount,
      absentToday: absentCount,
    });
  }, [filteredEmployees, attendanceRecords]);

  return stats;
};

