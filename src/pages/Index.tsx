
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
          {!user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          ) : (
            <CardInformation
              totalEmployees={user ? -1 : 0} // Pass -1 to force loading state until stats load
              presentToday={0}
              absentToday={0}
              isLoading={true} // Start with loading state
            />
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Today's Attendance</h2>
            <Suspense fallback={<div>Loading attendance data...</div>}>
              <DailyAttendance />
            </Suspense>
          </div>
          
          {/* Custom Statistics component to handle stats loading */}
          {user && <DashboardStats />}
        </EmployeeProvider>
      </AttendanceProvider>
    </div>
  );
};

// Separate component to load stats inside the providers
const DashboardStats = () => {
  const { totalEmployees, presentToday, absentToday, isLoading } = useStatistics();
  
  console.log("Dashboard stats:", { totalEmployees, presentToday, absentToday, isLoading });

  // Update the CardInformation with real stats once loaded
  if (!isLoading) {
    const cards = document.querySelector('.grid');
    if (cards) {
      // If we found the card container, update it with loaded stats
      setTimeout(() => {
        const stats = document.querySelector('.card-information');
        if (stats && stats.getAttribute('data-loaded') !== 'true') {
          console.log("Updating dashboard cards with real data");
          const newCards = document.createElement('div');
          newCards.className = 'card-information';
          newCards.setAttribute('data-loaded', 'true');
          
          // Replace cards with real data
          cards.replaceWith(
            <CardInformation
              totalEmployees={totalEmployees}
              presentToday={presentToday}
              absentToday={absentToday}
              isLoading={false}
            /> as any
          );
        }
      }, 100);
    }
  }
  
  return null; // This component just updates the UI, doesn't render anything directly
};

export default Index;
