
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  absentToday: number;
}

export const useStatistics = () => {
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const activeEmployees = filteredEmployees.filter(
      (employee) => employee.status === "Active"
    ).length;

    const todayRecords = attendanceRecords.filter(
      (record) => record.date === today
    );
    const presentToday = todayRecords.filter((record) => record.present).length;
    const absentToday = todayRecords.filter((record) => !record.present).length;

    setStats({
      totalEmployees: filteredEmployees.length,
      activeEmployees,
      presentToday,
      absentToday,
    });
  }, [filteredEmployees, attendanceRecords]);

  return stats;
};
