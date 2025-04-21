
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useStatistics } from "@/hooks/useStatistics";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardInformation } from "@/components/dashboard/CardInformation";
import DailyAttendance from "@/components/dashboard/DailyAttendance";

const Dashboard = () => {
  const { user } = useAuth();
  const { setCurrentDate } = useAttendance();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get today's date and format it for display - always fresh
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  // Get statistics - our hook will use the current date internally
  const stats = useStatistics();

  useEffect(() => {
    if (!isInitialized && user) {
      const freshToday = new Date();
      const freshTodayISO = freshToday.toISOString().split('T')[0];
      console.log("Dashboard - Setting current date on mount/refresh:", freshTodayISO);
      if (setCurrentDate) {
        setCurrentDate(freshTodayISO);
        setIsInitialized(true);
      }
    }
  }, [setCurrentDate, user, isInitialized]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || "User"}
          </p>
        </div>
        <div className="mt-2 md:mt-0 text-sm font-medium text-muted-foreground">
          {formattedDate}
        </div>
      </div>

      {!user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <CardInformation
          totalEmployees={stats.totalEmployees}
          presentToday={stats.presentToday}
          absentToday={stats.absentToday}
        />
      )}

      <div className="mt-6">
        {user && <DailyAttendance />}
      </div>
    </div>
  );
};

export default Dashboard;
