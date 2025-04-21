
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAttendanceLoading(currentDate: string, filteredEmployeesLength: number, employeesLoading: boolean, dataFetched: boolean, user: any) {
  const [actualRecordCount, setActualRecordCount] = useState(0);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!initialCheckDone && user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const fetchActualRecordCount = async () => {
        setRecordsLoading(true);
        try {
          const { count, error } = await supabase
            .from("attendance_records")
            .select("*", { count: "exact", head: true })
            .eq("date", currentDate);

          if (!error) {
            setActualRecordCount(count || 0);
            if ((count && count > 0) || (filteredEmployeesLength > 0 && !employeesLoading)) {
              setDataRefreshTrigger((prev) => prev + 1);
            }
          }
        } catch {
          // ignore; handled in Attendance.tsx
        } finally {
          setRecordsLoading(false);
          setInitialCheckDone(true);
        }
      };

      fetchActualRecordCount();
    }
  }, [currentDate, filteredEmployeesLength, user, initialCheckDone, employeesLoading, dataFetched]);

  useEffect(() => {
    if (initialCheckDone && user) {
      const updateRecordCount = async () => {
        try {
          const { count, error } = await supabase
            .from("attendance_records")
            .select("*", { count: "exact", head: true })
            .eq("date", currentDate);

          if (!error) {
            setActualRecordCount(count || 0);
          }
        } catch {
          // ignore
        }
      };

      updateRecordCount();
    }
  }, [currentDate, initialCheckDone, user]);

  const handleRefresh = () => {
    setRecordsLoading(true);
    setDataRefreshTrigger((prev) => prev + 1);
    const updateRecordCount = async () => {
      try {
        const { count, error } = await supabase
          .from("attendance_records")
          .select("*", { count: "exact", head: true })
          .eq("date", currentDate);

        if (!error) {
          setActualRecordCount(count || 0);
        }
      } catch {
        // ignore
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
