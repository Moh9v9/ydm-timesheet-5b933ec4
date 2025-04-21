
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}

export const useStatistics = () => {
  const { filteredEmployees } = useEmployees();
  const { currentDate } = useAttendance(); // Get the selected date from AttendanceContext
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });
  
  // State to track manual refreshes
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const fetchDirectFromDatabase = async () => {
      try {
        // Use the selected date from AttendanceContext instead of today's date
        console.log("useStatistics - Fetching data for current date:", currentDate, "Refresh count:", refreshCount);
        
        // Get records directly from Supabase for the selected date
        const { data, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', currentDate);
        
        if (error) {
          console.error("Error fetching attendance stats:", error);
          throw error;
        }

        console.log(`useStatistics - Retrieved ${data?.length || 0} records for ${currentDate}`);

        // Calculate present and absent counts
        const presentCount = (data || []).filter(record => record.present).length;
        const absentCount = (data || []).filter(record => !record.present).length;

        setStats({
          totalEmployees: filteredEmployees?.length || 0,
          presentToday: presentCount,
          absentToday: absentCount,
        });
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
        
        // If database fetch fails, still show employees count
        setStats(prev => ({
          ...prev,
          totalEmployees: filteredEmployees?.length || 0,
        }));
      }
    };

    // Initial fetch
    fetchDirectFromDatabase();
    
    // No more automatic refresh
  }, [filteredEmployees, currentDate, refreshCount]); // Include currentDate to refresh when date changes

  // Add a method to manually trigger a refresh
  const refreshStats = () => {
    setRefreshCount(prev => prev + 1);
  };

  return {
    ...stats,
    refreshStats
  };
};
