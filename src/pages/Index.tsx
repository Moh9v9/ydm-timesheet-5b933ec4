
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CardInformation } from "@/components/dashboard/CardInformation";
import DailyAttendance from "@/components/dashboard/DailyAttendance";
import { useStatistics } from "@/hooks/useStatistics";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { RecentEmployees } from "@/components/dashboard/RecentEmployees";

const Index = () => {
  const { user } = useAuth();
  
  // Use today's date for display
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  // Get attendance statistics
  const stats = useStatistics();
  
  console.log("Dashboard rendering with stats:", stats);

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

      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceChart 
            presentToday={stats.presentToday}
            absentToday={stats.absentToday}
            activeEmployees={stats.totalEmployees}
          />
          <RecentEmployees />
        </div>
      )}

      <div className="mt-6">
        {user && <DailyAttendance />}
      </div>
    </div>
  );
};

export default Index;
