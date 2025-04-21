
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CardInformation } from "@/components/dashboard/CardInformation";
import DailyAttendance from "@/components/dashboard/DailyAttendance";
import { useStatistics } from "@/hooks/useStatistics";

const Index = () => {
  const { user } = useAuth();
  
  // Use today's date for display
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  // Get attendance statistics
  const { totalEmployees, presentToday, absentToday, isLoading } = useStatistics();
  
  console.log("Dashboard rendering with stats:", { totalEmployees, presentToday, absentToday, isLoading });

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
          totalEmployees={totalEmployees}
          presentToday={presentToday}
          absentToday={absentToday}
          isLoading={isLoading}
        />
      )}

      <div className="mt-6">
        {user && <DailyAttendance />}
      </div>
    </div>
  );
};

export default Index;
