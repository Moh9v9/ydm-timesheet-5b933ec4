
import { useState, useEffect } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";

export const useAttendanceData = (canEdit: boolean, refreshTrigger: number = 0) => {
  const { filteredEmployees, loading: employeesLoading } = useEmployees();
  const { currentDate, getRecordsByEmployeeAndDate } = useAttendance();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState<string>('');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Effect to fetch attendance data only when date changes, employees load, or explicit refresh is triggered
  useEffect(() => {
    // Only fetch if we have employees
    if (filteredEmployees.length > 0) {
      // Check if we should fetch based on date change, refresh trigger
      const shouldFetch = 
        currentDate !== lastFetchedDate || 
        refreshTrigger > 0 || 
        !hasAttemptedFetch;
      
      if (shouldFetch) {
        console.log(`Fetching attendance data: date=${currentDate}, employees=${filteredEmployees.length}, lastFetch=${lastFetchedDate}, refreshTrigger=${refreshTrigger}, hasAttempted=${hasAttemptedFetch}`);
        
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
                  employeeName: employee.fullName,
                  date: currentDate,
                  present: false,
                  startTime: "",
                  endTime: "",
                  overtimeHours: 0,
                  note: ''
                };
              }
            });
            
            const results = await Promise.all(attendancePromises);
            console.log(`Loaded ${results.length} attendance records for ${currentDate}`);
            setAttendanceData(results);
            setLastFetchedDate(currentDate); // Update last fetched date
            setHasAttemptedFetch(true); // Mark that we've attempted to fetch
          } catch (error) {
            console.error("Error fetching attendance data:", error);
          } finally {
            setIsLoading(false);
          }
        };
        
        fetchAttendanceData();
      }
    } else if (!employeesLoading && filteredEmployees.length === 0 && !hasAttemptedFetch) {
      // If we have no employees and are done loading, mark as attempted to prevent looping
      setHasAttemptedFetch(true);
      setIsLoading(false);
    }
  }, [
    filteredEmployees, 
    currentDate, 
    getRecordsByEmployeeAndDate, 
    lastFetchedDate, 
    employeesLoading, 
    refreshTrigger,
    hasAttemptedFetch
  ]);

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
    isLoading: isLoading || employeesLoading, // Consider both loading states
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  };
};
