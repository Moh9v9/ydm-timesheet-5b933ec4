
import { useEffect, useRef, useState } from "react";
import { useAttendance } from "@/contexts/AttendanceContext";

export function useAttendanceLoading(currentDate: string, filteredEmployeesLength: number, employeesLoading: boolean, dataFetched: boolean, user: any) {
  const { attendanceRecords } = useAttendance();
  const [actualRecordCount, setActualRecordCount] = useState(0);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const hasInitializedRef = useRef(false);
  const lastFetchedDateRef = useRef('');

  useEffect(() => {
    // Only fetch when the date changes or on first load
    if (user && (!initialCheckDone || lastFetchedDateRef.current !== currentDate) && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      lastFetchedDateRef.current = currentDate;
      
      const fetchActualRecordCount = async () => {
        setRecordsLoading(true);
        try {
          // Instead of using Supabase, use the attendanceRecords from the AttendanceContext
          const todayRecords = attendanceRecords.filter(record => record.date === currentDate);
          const count = todayRecords.length;
          
          setActualRecordCount(count || 0);
          if ((count && count > 0) || (filteredEmployeesLength > 0 && !employeesLoading)) {
            setDataRefreshTrigger((prev) => prev + 1);
          }
        } catch (error) {
          console.error("Error fetching attendance count:", error);
        } finally {
          setRecordsLoading(false);
          setInitialCheckDone(true);
        }
      };

      fetchActualRecordCount();
    }
  }, [currentDate, filteredEmployeesLength, user, initialCheckDone, employeesLoading, dataFetched, attendanceRecords]);

  // This effect only runs when the date changes
  useEffect(() => {
    if (user && lastFetchedDateRef.current !== currentDate) {
      lastFetchedDateRef.current = currentDate;
      hasInitializedRef.current = false; // Allow a new fetch for the new date
      
      const updateRecordCount = async () => {
        try {
          setRecordsLoading(true);
          // Instead of using Supabase, use the attendanceRecords from the AttendanceContext
          const todayRecords = attendanceRecords.filter(record => record.date === currentDate);
          const count = todayRecords.length;
          
          setActualRecordCount(count || 0);
        } catch (error) {
          console.error("Error updating record count:", error);
        } finally {
          setRecordsLoading(false);
        }
      };

      updateRecordCount();
    }
  }, [currentDate, user, attendanceRecords]);

  const handleRefresh = () => {
    setRecordsLoading(true);
    setDataRefreshTrigger((prev) => prev + 1);
    hasInitializedRef.current = false; // Allow a refresh
    
    const updateRecordCount = async () => {
      try {
        // Instead of using Supabase, use the attendanceRecords from the AttendanceContext
        const todayRecords = attendanceRecords.filter(record => record.date === currentDate);
        const count = todayRecords.length;
        
        setActualRecordCount(count || 0);
      } catch (error) {
        console.error("Error handling refresh:", error);
      } finally {
        setRecordsLoading(false);
      }
    };
    updateRecordCount();
  };

  return {
    actualRecordCount,
    recordsLoading,
    dataRefreshTrigger,
    initialCheckDone,
    handleRefresh,
    setDataRefreshTrigger
  };
}
