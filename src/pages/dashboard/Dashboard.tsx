
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { BarChart3, User, UserCheck, UserX } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentEmployees } from "@/components/dashboard/RecentEmployees";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { useStatistics } from "@/hooks/useStatistics";

const Dashboard = () => {
  const { user } = useAuth();
  const stats = useStatistics();

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          icon={User}
          title="Total Employees"
          value={stats.totalEmployees}
          colorClass="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          icon={BarChart3}
          title="Active Employees"
          value={stats.activeEmployees}
          colorClass="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />
        <StatsCard
          icon={UserCheck}
          title="Present Today"
          value={stats.presentToday}
          colorClass="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />
        <StatsCard
          icon={UserX}
          title="Absent Today"
          value={stats.absentToday}
          colorClass="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentEmployees />
        <AttendanceChart
          presentToday={stats.presentToday}
          absentToday={stats.absentToday}
          activeEmployees={stats.activeEmployees}
        />
      </div>
    </div>
  );
};

export default Dashboard;
