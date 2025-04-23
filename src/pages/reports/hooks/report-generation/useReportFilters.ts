
import { format, endOfMonth } from "date-fns";
import { useCallback } from "react";
import { useAttendance } from "@/contexts/AttendanceContext";

export const useReportFilters = () => {
  const { attendanceRecords } = useAttendance();
  
  // Optimize with useCallback to prevent recreation on each render
  const applyMonthlyFilters = useCallback(async ({
    selectedDate,
    searchTerm,
    selectedProject,
    selectedLocation,
    selectedPaymentType,
    includeInactive
  }: {
    selectedDate: Date;
    searchTerm?: string;
    selectedProject?: string;
    selectedLocation?: string;
    selectedPaymentType?: string;
    includeInactive: boolean;
  }) => {
    // Get the month and year from selected date for monthly reports
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    const lastDayOfMonth = endOfMonth(selectedDate);
    
    // Filter records by date range
    let filteredRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= new Date(`${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`) && 
             recordDate <= new Date(format(lastDayOfMonth, 'yyyy-MM-dd'));
    });
    
    // Add employee name filter if provided
    if (searchTerm && searchTerm !== "") {
      console.log(`Filtering attendance records by employee: ${searchTerm}`);
      filteredRecords = filteredRecords.filter(record => 
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // At this point, additional filters would be applied based on employee properties
    // This would require checking each employee against the filters
    
    return filteredRecords;
  }, [attendanceRecords]);

  return {
    applyMonthlyFilters
  };
};
