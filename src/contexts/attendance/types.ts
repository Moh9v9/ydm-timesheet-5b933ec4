
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";

export interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  filteredRecords: AttendanceRecord[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
  filters: AttendanceFilters;
  setFilters: (filters: AttendanceFilters) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => Promise<AttendanceRecord>;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => Promise<AttendanceRecord>;
  deleteAttendanceRecord: (id: string) => Promise<void>;
  getAttendanceRecord: (id: string) => AttendanceRecord | undefined;
  getRecordsByEmployeeAndDate: (employeeId: string, date: string) => AttendanceRecord | undefined;
  bulkSaveAttendance: (records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]) => Promise<AttendanceRecord[]>;
  loading: boolean;
}
