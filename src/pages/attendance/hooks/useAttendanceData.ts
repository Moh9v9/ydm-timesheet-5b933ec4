
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useAttendanceEmployees } from "./useAttendanceEmployees";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useAttendanceFetch } from "./useAttendanceData/attendanceFetch";
import { determineIsLoading } from "./useAttendanceData/loadingHelpers";
import { useAttendanceHandlers } from "./useAttendanceData/handlers";

export const useAttendanceData = (canEdit: boolean, refreshTrigger: number = 0) => {
  const { currentDate } = useAttendance();
  const { attendanceEmployees, loading: employeesLoading } = useAttendanceEmployees(currentDate);

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState<string>('');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useAttendanceFetch(
    refreshTrigger,
    attendanceEmployees,
    employeesLoading,
    setAttendanceData,
    setLastFetchedDate,
    setIsLoading,
    setHasAttemptedFetch
  );

  const areEmployeesLoaded = attendanceEmployees.length > 0;

  const handlers = useAttendanceHandlers(canEdit, attendanceData, setAttendanceData);

  return {
    attendanceData,
    isLoading: determineIsLoading(employeesLoading, areEmployeesLoaded, isLoading),
    employeesLoaded: areEmployeesLoaded,
    ...handlers
  };
};
