
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { CardInformation } from "@/components/dashboard/CardInformation";
import DailyAttendance from "@/components/dashboard/DailyAttendance";
import { useStatistics } from "@/hooks/useStatistics";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  console.log("🏠 Index - Rendering Index component");
  const { user } = useAuth();
  const { t } = useLanguage();

  // Use today's date for display
  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM d, yyyy");
  
  return (
    <div className="space-y-6 container py-10 max-w-7xl mx-auto min-h-[800px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('welcome')}, {user?.fullName || "User"}
          </p>
        </div>
        <div className="mt-2 md:mt-0 text-sm font-medium text-muted-foreground">
          {formattedDate}
        </div>
      </div>
      <AttendanceProvider>
        <EmployeeProvider>
          <DashboardContents />
        </EmployeeProvider>
      </AttendanceProvider>
    </div>
  );
};

// Move all provider-dependent content to a separate component
const DashboardContents = () => {
  console.log("📊 DashboardContents - Rendering inside providers");
  const { t } = useLanguage();
  
  return (
    <>
      <DashboardStats />

      <div className="mt-8 min-h-[400px]">
        <Suspense fallback={<div>{t('loading')}...</div>}>
          <DailyAttendance />
        </Suspense>
      </div>
    </>
  );
};

// Separate component to load stats inside the providers
const DashboardStats = () => {
  console.log("📈 DashboardStats - About to call useStatistics");
  
  const { 
    totalEmployees, 
    presentToday, 
    absentToday, 
    sponsorshipBreakdown,
    paymentBreakdown,
    presentBreakdown,
    absentBreakdown,
    presentPaymentBreakdown,
    absentPaymentBreakdown,
    isLoading 
  } = useStatistics();
  
  console.log("📈 DashboardStats - After useStatistics, totalEmployees:", totalEmployees);
  
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <CardInformation 
      totalEmployees={totalEmployees} 
      presentToday={presentToday} 
      absentToday={absentToday}
      sponsorshipBreakdown={sponsorshipBreakdown}
      paymentBreakdown={paymentBreakdown}
      presentBreakdown={presentBreakdown}
      absentBreakdown={absentBreakdown}
      presentPaymentBreakdown={presentPaymentBreakdown}
      absentPaymentBreakdown={absentPaymentBreakdown}
      isLoading={isLoading} 
    />
  );
};

export default Index;
