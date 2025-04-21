
import { useEffect, useState, useRef } from "react";
import Attendance from "@/pages/attendance/Attendance";

const DailyAttendance = () => {
  // Use a ref to track if we've initialized to prevent unnecessary rerenders
  const hasInitializedRef = useRef(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only initialize once - this prevents multiple mounts of Attendance
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setInitialized(true);
    }
  }, []);

  return (
    <div className="mt-2">
      {initialized && <Attendance />}
    </div>
  );
};

export default DailyAttendance;
