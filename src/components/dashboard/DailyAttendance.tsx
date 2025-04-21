
import { useEffect, useState } from "react";
import Attendance from "@/pages/attendance/Attendance";

const DailyAttendance = () => {
  // Track if this is the initial render to prevent multiple refreshes
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Set initialized to true after first render
    if (!initialized) {
      setInitialized(true);
    }
  }, [initialized]);

  // Only render Attendance component when initialized
  // This prevents multiple component mounts causing refreshes
  return (
    <div className="mt-2">
      {initialized && <Attendance />}
    </div>
  );
};

export default DailyAttendance;
