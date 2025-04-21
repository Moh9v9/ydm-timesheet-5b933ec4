
import { AttendanceRecord } from "@/lib/types";

export function useAttendanceHandlers(
  canEdit: boolean,
  attendanceData: AttendanceRecord[],
  setAttendanceData: (data: AttendanceRecord[]) => void
) {
  const toggleAttendance = (index: number) => {
    if (!canEdit) return;
    const newData = [...attendanceData];
    newData[index].present = !newData[index].present;
    if (!newData[index].present) {
      newData[index].startTime = "";
      newData[index].endTime = "";
      newData[index].overtimeHours = 0;
    } else {
      newData[index].startTime = "07:00";
      newData[index].endTime = "17:00";
    }
    setAttendanceData(newData);
  };

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    if (!canEdit) return;
    const newData = [...attendanceData];
    newData[index][field] = value;
    setAttendanceData(newData);
  };

  const handleOvertimeChange = (index: number, value: string) => {
    if (!canEdit) return;
    const newData = [...attendanceData];
    newData[index].overtimeHours = parseFloat(value) || 0;
    setAttendanceData(newData);
  };

  const handleNoteChange = (index: number, value: string) => {
    if (!canEdit) return;
    const newData = [...attendanceData];
    newData[index].note = value;
    setAttendanceData(newData);
  };

  return {
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange,
  };
}
