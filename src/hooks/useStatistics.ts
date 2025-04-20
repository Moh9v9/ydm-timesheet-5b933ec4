
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { AttendanceRecord } from "@/lib/types";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}

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

export const useStatistics = (selectedDate: string) => {
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });

  useEffect(() => {
    const records = attendanceRecords || [];
    const todayRecords = getTodayAttendanceRecords(records, selectedDate);
    const { presentCount, absentCount } = calculateAttendanceCounts(todayRecords);

    setStats({
      totalEmployees: filteredEmployees?.length || 0,
      presentToday: presentCount,
      absentToday: absentCount,
    });
  }, [filteredEmployees, attendanceRecords, selectedDate]);

  return stats;
};
