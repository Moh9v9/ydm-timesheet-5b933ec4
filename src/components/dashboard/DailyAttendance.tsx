
import { useState, useEffect } from "react";
import Attendance from "@/pages/attendance/Attendance";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";

const DailyAttendance = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only initialize once - this prevents multiple mounts of Attendance
    if (!initialized) {
      console.log("DailyAttendance - Initializing component");
      setInitialized(true);
    }
    
    // No dependency array - this effect runs only once on mount
  }, []); 

  // Only render Attendance component when initialized, and wrap it with necessary providers
  // IMPORTANT: EmployeeProvider must be INSIDE AttendanceProvider so it can access the attendance date
  return (
    <div className="mt-2">
      {initialized && (
        <AttendanceProvider>
          <EmployeeProvider>
            <Attendance />
          </EmployeeProvider>
        </AttendanceProvider>
      )}
    </div>
  );
};

export default DailyAttendance;
