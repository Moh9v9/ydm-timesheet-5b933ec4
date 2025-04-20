
import { AttendanceRecord } from "@/lib/types";
import { useAttendanceQueries } from "./useAttendanceQueries";
import { useAttendanceMutations } from "./useAttendanceMutations";
import { useBulkOperations } from "./useBulkOperations";

export const useAttendanceOperations = (
  attendanceRecords: AttendanceRecord[],
  setAttendanceRecords: (records: AttendanceRecord[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const { getAttendanceRecord, getRecordsByEmployeeAndDate } = useAttendanceQueries();
  const { addAttendanceRecord, updateAttendanceRecord } = useAttendanceMutations(
    attendanceRecords,
    setAttendanceRecords,
    setLoading
  );
  const { deleteAttendanceRecord, bulkSaveAttendance } = useBulkOperations(
    attendanceRecords,
    setAttendanceRecords,
    setLoading
  );

  return {
    getAttendanceRecord: (id: string) => getAttendanceRecord(attendanceRecords, id),
    getRecordsByEmployeeAndDate,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    bulkSaveAttendance,
  };
};
