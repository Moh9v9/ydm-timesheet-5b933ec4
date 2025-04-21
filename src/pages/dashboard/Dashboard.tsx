
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import Attendance from "@/pages/attendance/Attendance";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DailyAttendance } from "@/components/dashboard/DailyAttendance";

const Dashboard = () => {
  const { user } = useAuth();
  const { setCurrentDate } = useAttendance();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get today's date and format it for display - always fresh
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");

  useEffect(() => {
    if (!isInitialized && user) {
      const freshToday = new Date();
      const freshTodayISO = freshToday.toISOString().split("T")[0];
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : (
        <DailyAttendance />
      )}

      <div className="mt-6">
        {user && <Attendance />}
      </div>
    </div>
  );
};

export default Dashboard;
