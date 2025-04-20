
import { useState, useEffect } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";

export const useAttendanceData = (canEdit: boolean) => {
  const { filteredEmployees } = useEmployees();
  const { currentDate, getRecordsByEmployeeAndDate } = useAttendance();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      const activeEmployees = filteredEmployees.filter(emp => emp.status === "Active");
      
      try {
        const attendancePromises = activeEmployees.map(async (employee) => {
          const existingRecord = await getRecordsByEmployeeAndDate(employee.id, currentDate);
          
          if (existingRecord) {
            return existingRecord;
          } else {
            return {
              id: `temp_${employee.id}_${currentDate}`,
              employeeId: employee.id,
              date: currentDate,
              present: false, // Changed default to false (absent)
              startTime: "",  // Empty start time for absent employees
              endTime: "",    // Empty end time for absent employees
              overtimeHours: 0,
              note: ''
            };
          }
        });
        
        const results = await Promise.all(attendancePromises);
        setAttendanceData(results);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [filteredEmployees, currentDate, getRecordsByEmployeeAndDate]);

  const toggleAttendance = (index: number) => {
    if (!canEdit) return;
    
    setAttendanceData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        present: !newData[index].present
      };
      
      if (!newData[index].present) {
        newData[index].startTime = "";
        newData[index].endTime = "";
        newData[index].overtimeHours = 0;
      } else {
        newData[index].startTime = "07:00";
        newData[index].endTime = "17:00";
      }
      
      return newData;
    });
  };

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    if (!canEdit) return;
    
    setAttendanceData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [field]: value
      };
      return newData;
    });
  };

  const handleOvertimeChange = (index: number, value: string) => {
    if (!canEdit) return;
    
    setAttendanceData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        overtimeHours: parseFloat(value) || 0
      };
      return newData;
    });
  };

  const handleNoteChange = (index: number, value: string) => {
    if (!canEdit) return;
    
    setAttendanceData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        note: value
      };
      return newData;
    });
  };

  return {
    attendanceData,
    isLoading,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  };
};
