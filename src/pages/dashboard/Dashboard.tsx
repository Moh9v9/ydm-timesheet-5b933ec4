
import { Briefcase, UserCheck, UserMinus } from "lucide-react";
import { useStatistics } from "@/hooks/useStatistics";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardAttendanceTable } from "@/components/dashboard/DashboardAttendanceTable";

const Dashboard = () => {
  const { totalEmployees, presentToday, absentToday, refreshStats } = useStatistics();
  const { filteredEmployees } = useEmployees();
  const { currentDate } = useAttendance();
  
  // Count active employees for accurate stats
  const activeEmployees = filteredEmployees.filter(emp => emp.status === "Active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          icon={Briefcase}
          title="Total Employees"
          value={totalEmployees}
          colorClass="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatsCard
          icon={UserCheck}
          title="Present Today"
          value={presentToday}
          colorClass="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatsCard
          icon={UserMinus}
          title="Absent Today"
          value={absentToday}
          colorClass="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
        <h2 className="text-lg font-medium p-4 border-b">Daily Attendance</h2>
        <DashboardAttendanceTable 
          currentDate={currentDate}
          employeeData={filteredEmployees.filter(emp => emp.status === "Active")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
