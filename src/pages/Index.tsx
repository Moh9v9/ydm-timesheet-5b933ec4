
import { Suspense } from "react";
import Dashboard from "./dashboard/Dashboard";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import DailyAttendance from "@/components/dashboard/DailyAttendance";

const Index = () => {
  return (
    <div className="container py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>
      
      <Dashboard />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Today's Attendance</h2>
        <AttendanceProvider>
          <EmployeeProvider>
            <Suspense fallback={<div>Loading attendance data...</div>}>
              <DailyAttendance />
            </Suspense>
          </EmployeeProvider>
        </AttendanceProvider>
      </div>
    </div>
  );
};

export default Index;
