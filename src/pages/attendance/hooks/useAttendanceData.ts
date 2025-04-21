
import { useState, useEffect, useRef } from "react";
import { AttendanceRecord } from "@/lib/types";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";

export const useAttendanceData = (canEdit: boolean, refreshTrigger: number = 0) => {
  const { filteredEmployees, loading: employeesLoading, dataFetched } = useEmployees();
  const { currentDate, getRecordsByEmployeeAndDate } = useAttendance();
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchedDate, setLastFetchedDate] = useState<string>('');
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const fetchingRef = useRef(false);
  const initAttemptedRef = useRef(false);

  // Enhanced debugging logs
  console.log("🔍 useAttendanceData - DEBUG", { 
    employeeCount: filteredEmployees.length, 
    employeesLoading, 
    dataFetched, 
    hasAttemptedFetch, 
    lastFetchedDate, 
    currentDate,
    employees: filteredEmployees.map(e => ({ id: e.id, name: e.fullName, status: e.status }))
  });

  // Effect to fetch attendance data only when date changes, employees load, or explicit refresh is triggered
  useEffect(() => {
    // Handle the case where we have no employees but they're not loading anymore
    if (!employeesLoading && dataFetched && !initAttemptedRef.current) {
      console.log("🔍 Employee data loaded. Ready to process attendance data.");
      initAttemptedRef.current = true;
      
      if (filteredEmployees.length === 0) {
        // No employees available, no need to load attendance
        console.log("🔍 No employees found. Setting loading to false.");
        setHasAttemptedFetch(true);
        setIsLoading(false);
        return;
      }
    }

    // Only fetch if we have employees and we're not currently fetching
    if (filteredEmployees.length > 0 && !fetchingRef.current && dataFetched) {
      // Check if we should fetch based on date change, refresh trigger
      const shouldFetch = 
        currentDate !== lastFetchedDate || 
        refreshTrigger > 0 || 
        !hasAttemptedFetch;
      
      if (shouldFetch) {
        console.log(`🔍 Fetching attendance data: date=${currentDate}, employees=${filteredEmployees.length}, lastFetch=${lastFetchedDate}, refreshTrigger=${refreshTrigger}, hasAttempted=${hasAttemptedFetch}`);
        fetchingRef.current = true;
        
        const fetchAttendanceData = async () => {
          setIsLoading(true);
          const activeEmployees = filteredEmployees.filter(emp => emp.status === "Active");
          console.log(`🔍 Found ${activeEmployees.length} active employees out of ${filteredEmployees.length} total`);
          
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
            console.log(`🔍 Loaded ${results.length} attendance records for ${currentDate}`);
            setAttendanceData(results);
            setLastFetchedDate(currentDate); // Update last fetched date
            setHasAttemptedFetch(true); // Mark that we've attempted to fetch
          } catch (error) {
            console.error("Error fetching attendance data:", error);
          } finally {
            setIsLoading(false);
            fetchingRef.current = false;
          }
        };
        
        fetchAttendanceData();
      }
    } else if (dataFetched && !employeesLoading && filteredEmployees.length === 0 && !hasAttemptedFetch) {
      // If we have no employees but data is fetched, mark as attempted
      console.log("🔍 No employees but data fetched. Setting loading to false.");
      setHasAttemptedFetch(true);
      setIsLoading(false);
    }
  }, [
    filteredEmployees, 
    currentDate, 
    getRecordsByEmployeeAndDate, 
    lastFetchedDate, 
    employeesLoading,
    dataFetched,
    refreshTrigger,
    hasAttemptedFetch
  ]);

  // Reset fetch attempt when date changes
  useEffect(() => {
    if (lastFetchedDate !== currentDate) {
      setHasAttemptedFetch(false);
    }
  }, [currentDate, lastFetchedDate]);

  // Helper function to determine if we're in a valid loading state
  const determineIsLoading = () => {
    // If employees are still loading and we haven't fetched data yet
    if (employeesLoading && !dataFetched) {
      return true;
    }
    
    // If we're actively fetching attendance data
    if (isLoading) {
      return true;
    }
    
    return false;
  };

  // Updated to provide more accurate employeesLoaded state
  const areEmployeesLoaded = dataFetched && !employeesLoading;

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
    isLoading: determineIsLoading(),
    employeesLoaded: areEmployeesLoaded,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  };
};
