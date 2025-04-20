
import { AttendanceRecord } from "@/lib/types";

// Generate today's date in ISO format
export const TODAY = new Date().toISOString().split('T')[0];

// Mock data for attendance records
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "1",
    employeeId: "1",
    date: TODAY,
    present: true,
    startTime: "07:00",
    endTime: "17:00",
    overtimeHours: 0
  },
  {
    id: "2",
    employeeId: "2",
    date: TODAY,
    present: true,
    startTime: "07:30",
    endTime: "17:30",
    overtimeHours: 0.5
  },
  {
    id: "3",
    employeeId: "3",
    date: TODAY,
    present: false,
    startTime: "",
    endTime: "",
    overtimeHours: 0
  },
  {
    id: "4",
    employeeId: "4",
    date: TODAY,
    present: true,
    startTime: "07:00",
    endTime: "17:00",
    overtimeHours: 0
  },
  {
    id: "5",
    employeeId: "5",
    date: TODAY,
    present: true,
    startTime: "07:15",
    endTime: "18:30",
    overtimeHours: 1.5
  }
];
