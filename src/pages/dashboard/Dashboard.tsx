
// Dashboard.tsx
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { useStatistics } from "@/hooks/useStatistics";
// Removed useAttendance import here since we won't use currentDate from it now
import { Skeleton } from "@/components/ui/skeleton";
import { CardInformation } from "@/components/dashboard/CardInformation";
import DailyAttendance from "@/components/dashboard/DailyAttendance";

const Dashboard = () => {
  const { user } = useAuth();

  // Use today's actual date to display on dashboard, independent from Attendance context
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy"); 
  
  // Get statistics - will now use the current date from context as before (no change)
  const stats = useStatistics();

  console.log("Dashboard render - Displaying today's date:", formattedDate, "Stats:", stats);

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

