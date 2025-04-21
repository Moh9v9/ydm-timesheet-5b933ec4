
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useAttendanceFetch } from "./useAttendanceData/attendanceFetch";
import { determineIsLoading } from "./useAttendanceData/loadingHelpers";
import { useAttendanceHandlers } from "./useAttendanceData/handlers";

export const useAttendanceData = (canEdit: boolean, refreshTrigger: number = 0) => {
  const { filteredEmployees, loading: employeesLoading, dataFetched } = useEmployees();
  const { currentDate } = useAttendance();

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState<string>('');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useAttendanceFetch(
    refreshTrigger,
    setAttendanceData,
    setLastFetchedDate,
    setIsLoading,
    setHasAttemptedFetch
  );

  const areEmployeesLoaded = dataFetched && !employeesLoading;

  const handlers = useAttendanceHandlers(canEdit, attendanceData, setAttendanceData);

  return {
    attendanceData,
    isLoading: determineIsLoading(employeesLoading, dataFetched, isLoading),
    employeesLoaded: areEmployeesLoaded,
    ...handlers
  };
};
