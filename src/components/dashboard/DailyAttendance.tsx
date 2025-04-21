
import { useState, useEffect } from "react";
import Attendance from "@/pages/attendance/Attendance";
import { useEmployees } from "@/contexts/EmployeeContext";
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

  // We need to wrap Attendance with both providers to ensure context availability
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
