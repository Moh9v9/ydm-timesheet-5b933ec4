
import { AttendanceRecord } from "@/lib/types";
import { useAttendanceQueries } from "./hooks/useAttendanceQueries";
import { useAttendanceMutations } from "./hooks/useAttendanceMutations";
import { useBulkOperations } from "./hooks/useBulkOperations";

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
