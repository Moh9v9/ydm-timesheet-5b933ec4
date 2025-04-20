
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { User, UserCheck, UserX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useStatistics } from "@/hooks/useStatistics";
import Attendance from "@/pages/attendance/Attendance";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const { currentDate, setCurrentDate } = useAttendance();
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const stats = useStatistics(today); // Always use today's date for statistics

  // Always set to current day when Dashboard mounts
  useEffect(() => {
    if (setCurrentDate) {
      setCurrentDate(today);
    }
  }, [setCurrentDate, today]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName}
          </p>
        </div>
        <div className="mt-2 md:mt-0 text-sm font-medium text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatsCard
          icon={User}
          title="Total Employees"
          value={stats.totalEmployees}
          colorClass="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          icon={UserCheck}
          title="Total Present"
          value={stats.presentToday}
          colorClass="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />
        <StatsCard
          icon={UserX}
          title="Total Absent"
          value={stats.absentToday}
          colorClass="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
        />
      </div>

      <div className="mt-6">
        <Attendance />
      </div>
    </div>
  );
};

export default Dashboard;
