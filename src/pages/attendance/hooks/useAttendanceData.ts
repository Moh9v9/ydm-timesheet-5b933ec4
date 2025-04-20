
import { useState, useEffect } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";

export const useAttendanceData = (canEdit: boolean) => {
  const { filteredEmployees } = useEmployees();
  const { currentDate, getRecordsByEmployeeAndDate } = useAttendance();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const activeEmployees = filteredEmployees.filter(emp => emp.status === "Active");
    
    const initialAttendanceData = activeEmployees.map(employee => {
      const existingRecord = getRecordsByEmployeeAndDate(employee.id, currentDate);
      
      if (existingRecord) {
        return existingRecord;
      } else {
        return {
          id: `temp_${employee.id}_${currentDate}`,
          employeeId: employee.id,
          date: currentDate,
          present: true,
          startTime: "07:00",
          endTime: "17:00",
          overtimeHours: 0
        };
      }
    });
    
    setAttendanceData(initialAttendanceData);
  }, [filteredEmployees, currentDate, getRecordsByEmployeeAndDate]);

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
    attendanceData,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  };
};
