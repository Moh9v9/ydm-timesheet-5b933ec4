
import { useState, useEffect } from "react";
import Attendance from "@/pages/attendance/Attendance";

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

  // The parent Index component already provides AttendanceProvider and EmployeeProvider
  return (
    <div className="mt-2">
      {initialized && (
        <Attendance />
      )}
    </div>
  );
};

export default DailyAttendance;
