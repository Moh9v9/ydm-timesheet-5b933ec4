
import { useState, useEffect } from "react";
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useAttendanceState = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState<AttendanceFilters>({
    date: currentDate
  });
  const [loading, setLoading] = useState(false);

  // Update filters when currentDate changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      date: currentDate
    }));
  }, [currentDate]);

  // Fetch attendance records from Supabase
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true);
      try {
        const query = supabase
          .from('attendance_records')
          .select('*');

        if (filters.date) {
          query.eq('date', filters.date);
        }
        if (filters.employeeId) {
          query.eq('employee_uuid', filters.employeeId);
        }
        if (filters.present !== undefined) {
          query.eq('present', filters.present);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedRecords: AttendanceRecord[] = (data || []).map(record => ({
          id: record.id,
          employeeId: record.employee_uuid,
          employeeName: record.employee_name || '',
          date: record.date,
          present: record.present,
          startTime: record.start_time || '',
          endTime: record.end_time || '',
          overtimeHours: record.overtime_hours || 0,
          note: record.note || ''
        }));

        setAttendanceRecords(formattedRecords);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [filters]);

  // Filter attendance records based on current filters
  const filteredRecords = attendanceRecords;

  return {
    attendanceRecords,
    setAttendanceRecords,
    currentDate,
    setCurrentDate,
    filters,
    setFilters,
    loading,
    setLoading,
    filteredRecords,
  };
};
