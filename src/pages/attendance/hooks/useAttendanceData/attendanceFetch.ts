
import { useEffect, useRef, useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";

export function useAttendanceFetch(
  refreshTrigger: number,
  setAttendanceData: (data: AttendanceRecord[]) => void,
  setLastFetchedDate: (date: string) => void,
  setIsLoading: (loading: boolean) => void,
  setHasAttemptedFetch: (b: boolean) => void
) {
  const { filteredEmployees, loading: employeesLoading, dataFetched } = useEmployees();
  const { currentDate, getRecordsByEmployeeAndDate } = useAttendance();
  const [hasAttemptedFetch, _setHasAttemptedFetch] = useState(false);
  const [lastFetchedDate, _setLastFetchedDate] = useState<string>("");
  const fetchingRef = useRef(false);
  const initAttemptedRef = useRef(false);

  // Reset fetch attempt when date changes
  useEffect(() => {
    if (lastFetchedDate !== currentDate) {
      setHasAttemptedFetch(false);
    }
  }, [currentDate, lastFetchedDate, setHasAttemptedFetch]);

  useEffect(() => {
    if (!employeesLoading && dataFetched && !initAttemptedRef.current) {
      initAttemptedRef.current = true;
      if (filteredEmployees.length === 0) {
        setHasAttemptedFetch(true);
        setIsLoading(false);
        return;
      }
    }

    if (filteredEmployees.length > 0 && !fetchingRef.current && dataFetched) {
      const shouldFetch =
        currentDate !== lastFetchedDate || 
        refreshTrigger > 0 || 
        !hasAttemptedFetch;

      if (shouldFetch) {
        fetchingRef.current = true;
        const fetchAttendanceData = async () => {
          setIsLoading(true);
          
          // Filter employees based on creation date
          const eligibleEmployees = filteredEmployees.filter(emp => {
            const employeeCreatedAt = new Date(emp.created_at);
            const attendanceDate = new Date(currentDate);
            // Only include employees created on or before the attendance date
            return employeeCreatedAt <= attendanceDate;
          }).filter(emp => emp.status === "Active");

          try {
            const attendancePromises = eligibleEmployees.map(async (employee) => {
              const existingRecord = await getRecordsByEmployeeAndDate(employee.id, currentDate);
              if (existingRecord) {
                return existingRecord;
              } else {
                return {
                  id: `temp_${employee.id}_${currentDate}`,
                  employeeId: employee.id,
                  employeeName: employee.fullName,
                  date: currentDate,
                  present: false,
                  startTime: "",
                  endTime: "",
                  overtimeHours: 0,
                  note: ''
                };
              }
            });

            const results = await Promise.all(attendancePromises);
            setAttendanceData(results);
            setLastFetchedDate(currentDate);
            setHasAttemptedFetch(true);
          } catch (error) {
            console.error("Error fetching attendance data:", error);
          } finally {
            setIsLoading(false);
            fetchingRef.current = false;
          }
        };
        fetchAttendanceData();
      }
    } else if (dataFetched && !employeesLoading && filteredEmployees.length === 0 && !hasAttemptedFetch) {
      setHasAttemptedFetch(true);
      setIsLoading(false);
    }
  }, [
    filteredEmployees, 
    currentDate, 
    getRecordsByEmployeeAndDate, 
    lastFetchedDate, 
    employeesLoading,
    dataFetched,
    refreshTrigger,
    hasAttemptedFetch,
    setAttendanceData,
    setLastFetchedDate,
    setHasAttemptedFetch,
    setIsLoading
  ]);
}
