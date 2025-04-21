
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { CardInformation } from "@/components/dashboard/CardInformation";
import DailyAttendance from "@/components/dashboard/DailyAttendance";
import { useStatistics } from "@/hooks/useStatistics";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { Suspense } from "react";

const Index = () => {
  const { user } = useAuth();
  
  // Use today's date for display
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  return (
    <div className="space-y-6 animate-fade-in container py-10 max-w-7xl mx-auto">
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

      {/* AttendanceProvider and EmployeeProvider need to wrap both the statistics and attendance components */}
      <AttendanceProvider>
        <EmployeeProvider>
          <DashboardStats />

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Today's Attendance</h2>
            <Suspense fallback={<div>Loading attendance data...</div>}>
              <DailyAttendance />
            </Suspense>
          </div>
        </EmployeeProvider>
      </AttendanceProvider>
    </div>
  );
};

// Separate component to load stats inside the providers
const DashboardStats = () => {
  const { totalEmployees, presentToday, absentToday, isLoading } = useStatistics();
  const { user } = useAuth();
  
  console.log("Dashboard stats:", { totalEmployees, presentToday, absentToday, isLoading });

  // Simply render the CardInformation component with stats
  if (!user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }
  
  return (
    <CardInformation
      totalEmployees={isLoading ? 0 : totalEmployees}
      presentToday={isLoading ? 0 : presentToday}
      absentToday={isLoading ? 0 : absentToday}
      isLoading={isLoading}
    />
  );
};

export default Index;
