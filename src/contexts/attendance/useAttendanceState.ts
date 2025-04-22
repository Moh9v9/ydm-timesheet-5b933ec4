
import { useState, useEffect, useCallback } from "react";
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";
import { readAttendanceByDate } from "@/lib/googleSheets";

const getTodayISODate = () => new Date().toISOString().split('T')[0];

export const useAttendanceState = () => {
  const freshDate = getTodayISODate();

  const [currentDate, setCurrentDate] = useState<string>(freshDate);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [filters, setFilters] = useState<AttendanceFilters>({ date: currentDate });
  const [loading, setLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refreshData = useCallback(() => {
    console.log("useAttendanceState - Forcing data refresh");
    setRefreshCounter(prev => prev + 1);
  }, []);

  useEffect(() => {
    console.log("useAttendanceState - Setting filters date to:", currentDate);
    setFilters(prevFilters => ({
      ...prevFilters,
      date: currentDate
    }));
  }, [currentDate]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true);
      try {
        console.log("useAttendanceState - Fetching records with filters:", filters);

        const records = await readAttendanceByDate(filters.date || "");

        let filtered = records;

        if (filters.employeeId) {
          filtered = filtered.filter(r => r.employeeId === filters.employeeId);
        }

        if (filters.present !== undefined) {
          filtered = filtered.filter(r => String(r.present) === String(filters.present));
        }

        const formattedRecords: AttendanceRecord[] = filtered.map(record => ({
          id: record.id,
          employeeId: record.employeeId,
          employeeName: record.employeeName || '',
          date: record.date,
          present: record.present,
          startTime: record.startTime || '',
          endTime: record.endTime || '',
          overtimeHours: record.overtimeHours || 0,
          note: record.note || ''
        }));

        console.log(`useAttendanceState - Fetched ${formattedRecords.length} records for date ${filters.date}`);
        setAttendanceRecords(formattedRecords);

      } catch (error) {
        console.error('❌ Error fetching attendance records from Google Sheets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [filters, refreshCounter]);

  return {
    attendanceRecords,
    setAttendanceRecords,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
    loading,
    setLoading,
    filteredRecords: attendanceRecords,
    refreshData,
  };
};
