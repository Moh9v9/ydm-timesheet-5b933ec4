
import { AttendanceRecord, AttendanceFilters } from "@/lib/types";

export interface AttendanceContextType {
  attendanceRecords: AttendanceRecord[];
  filteredRecords: AttendanceRecord[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
  filters: AttendanceFilters;
  setFilters: (filters: AttendanceFilters) => void;
  loading: boolean;
  refreshData: () => void; // Add this function type
  
  // CRUD operations
  getAttendanceRecord: (id: string) => AttendanceRecord | undefined;
  getRecordsByEmployeeAndDate: (employeeId: string, date: string) => Promise<AttendanceRecord | null>;
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => Promise<AttendanceRecord>;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => Promise<AttendanceRecord>;
  deleteAttendanceRecord: (id: string) => Promise<void>;
  bulkSaveAttendance: (records: (Omit<AttendanceRecord, "id"> | AttendanceRecord)[]) => Promise<AttendanceRecord[]>;
}
