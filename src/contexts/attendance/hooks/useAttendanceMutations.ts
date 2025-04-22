import { AttendanceRecord } from "@/lib/types";
import {
  addAttendanceRecordToSheet,
  updateAttendanceRecordInSheet,
} from "@/lib/googleSheets";

export const useAttendanceMutations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  // Add new attendance record
  const addAttendanceRecord = async (
    record: Omit<AttendanceRecord, "id">
  ): Promise<AttendanceRecord> => {
    setLoading(true);
    try {
      const newRecord: AttendanceRecord = {
        ...record,
        id: (Date.now() + Math.random()).toString(), // يمكنك استبداله بـ uuid
      };

      await addAttendanceRecordToSheet(newRecord);
      setAttendanceRecords([...attendanceRecords, newRecord]);
      return newRecord;
    } catch (err) {
      console.error("Error adding attendance record:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update attendance record
  const updateAttendanceRecord = async (
    id: string,
    record: Partial<AttendanceRecord>
  ): Promise<AttendanceRecord> => {
    setLoading(true);
    try {
      await updateAttendanceRecordInSheet({ id, ...record });

      const updated = attendanceRecords.map((r) =>
        r.id === id ? { ...r, ...record } : r
      );

      const updatedRecord = updated.find((r) => r.id === id)!;

      setAttendanceRecords(updated);
      return updatedRecord;
    } catch (err) {
      console.error("Error updating attendance record:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addAttendanceRecord,
    updateAttendanceRecord,
  };
};
