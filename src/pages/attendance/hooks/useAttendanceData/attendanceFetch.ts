
import { Dispatch, SetStateAction, useEffect } from "react";
import { AttendanceRecord, Employee } from "@/lib/types";
import { useAttendance } from "@/contexts/AttendanceContext";
import { readAttendanceByDate } from "@/lib/googleSheets";

export const useAttendanceFetch = (
  refreshTrigger: number,
  attendanceEmployees: Employee[],
  employeesLoading: boolean,
  setAttendanceData: Dispatch<SetStateAction<AttendanceRecord[]>>,
  setLastFetchedDate: Dispatch<SetStateAction<string>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHasAttemptedFetch: Dispatch<SetStateAction<boolean>>
) => {
  const { currentDate } = useAttendance();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (employeesLoading || !currentDate) return;

      setIsLoading(true);
      console.log(`📆 Fetching attendance from Google Sheets for ${currentDate} (refresh ${refreshTrigger})`);

      try {
        const records = await readAttendanceByDate(currentDate);

        if (!records || records.length === 0) {
          console.log(`ℹ️ No attendance records found for ${currentDate}.`);
          setAttendanceData([]);
          setLastFetchedDate(currentDate);
          setHasAttemptedFetch(true);
          return;
        }

        const formattedRecords: AttendanceRecord[] = records.map(record => ({
          id: record.id,
          employeeId: record.employeeId,
          employeeName: record.employeeName || '',
          date: record.date,
          present: record.present,
          startTime: record.startTime || '',
          endTime: record.endTime || '',
          overtimeHours: record.overtimeHours || 0,
          note: record.note !== null ? record.note || '' : ''
        }));

        setAttendanceData(formattedRecords);
        setLastFetchedDate(currentDate);
        setHasAttemptedFetch(true);
        console.log(`✅ Loaded ${formattedRecords.length} records from Google Sheets`);
      } catch (error) {
        console.error("❌ Error fetching attendance from Google Sheets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [refreshTrigger, employeesLoading, currentDate]);
};
