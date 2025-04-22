
import { useEffect, useRef, useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useAttendance } from "@/contexts/AttendanceContext";

export function useAttendanceFetch(
  refreshTrigger: number,
  attendanceEmployees: any[],
  employeesLoading: boolean,
  setAttendanceData: (data: AttendanceRecord[]) => void,
  setLastFetchedDate: (date: string) => void,
  setIsLoading: (loading: boolean) => void,
  setHasAttemptedFetch: (b: boolean) => void
) {
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
    // eslint-disable-next-line
  }, [currentDate, lastFetchedDate]);

  useEffect(() => {
    // If not loading and we haven't attempted a fetch yet
    if (!employeesLoading && !initAttemptedRef.current) {
      initAttemptedRef.current = true;
      if (attendanceEmployees.length === 0) {
        setHasAttemptedFetch(true);
        setIsLoading(false);
        return;
      }
    }

    if (attendanceEmployees.length > 0 && !fetchingRef.current) {
      const shouldFetch =
        currentDate !== lastFetchedDate || 
        refreshTrigger > 0 || 
        !hasAttemptedFetch;

      if (shouldFetch) {
        fetchingRef.current = true;
        const fetchAttendanceData = async () => {
          setIsLoading(true);
          try {
            // Get attendance records for all employees 
            // (our attendanceEmployees list already contains only relevant employees)
            const attendancePromises = attendanceEmployees.map(async (employee) => {
              const existingRecord = await getRecordsByEmployeeAndDate(employee.id, currentDate);
              
              if (existingRecord) {
                console.log(`Found existing record for ${employee.fullName} (${employee.status}) with present=${existingRecord.present}`);
                return existingRecord;
              } else {
                // Create placeholder records
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
            setLastFetchedDate(currentDate); // Update last fetched date
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
    } else if (!employeesLoading && attendanceEmployees.length === 0 && !hasAttemptedFetch) {
      setHasAttemptedFetch(true);
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [
    attendanceEmployees, 
    currentDate, 
    getRecordsByEmployeeAndDate, 
    lastFetchedDate, 
    employeesLoading,
    refreshTrigger,
    hasAttemptedFetch
  ]);
}
