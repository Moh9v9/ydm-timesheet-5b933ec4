import { AttendanceRecord } from "@/lib/types";
import {
  updateAttendanceRecordInSheet,
  deleteAttendanceRecordFromSheet,
} from "@/lib/googleSheets";

export const useBulkOperations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const deleteAttendanceRecord = async (id: string) => {
    setLoading(true);
    try {
      await deleteAttendanceRecordFromSheet(id);
      setAttendanceRecords(attendanceRecords.filter((rec) => rec.id !== id));
    } catch (err) {
      console.error("❌ Error deleting attendance record:", err);
    } finally {
      setLoading(false);
    }
  };

  const bulkSaveAttendance = async (records: AttendanceRecord[]) => {
    setLoading(true);
    try {
      for (const record of records) {
        await updateAttendanceRecordInSheet(record);
      }

      const updatedIds = records.map((r) => r.id);
      const updatedData = attendanceRecords.map((r) => {
        const updated = records.find((u) => u.id === r.id);
        return updated ? { ...r, ...updated } : r;
      });

      setAttendanceRecords(updatedData);
    } catch (err) {
      console.error("❌ Error in bulk saving attendance records:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAttendanceRecord,
    bulkSaveAttendance,
  };
};
