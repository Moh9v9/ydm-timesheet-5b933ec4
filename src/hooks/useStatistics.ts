
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAttendance } from "@/contexts/AttendanceContext";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}

export const useStatistics = () => {
  const { filteredEmployees } = useEmployees();
  const { currentDate } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
  });
  
  // State to track data freshness
  const [lastFetchedDate, setLastFetchedDate] = useState<string>('');

  useEffect(() => {
    // Check if we need to fetch new data based on date change
    const shouldFetchNewData = currentDate !== lastFetchedDate;
    
    if (shouldFetchNewData) {
      const fetchDirectFromDatabase = async () => {
        try {
          console.log("useStatistics - Fetching data for selected date:", currentDate);
          
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

          // Calculate total employees count
          const totalEmployees = filteredEmployees?.length || 0;

          console.log(`useStatistics - Calculated stats: Present: ${presentCount}, Absent: ${absentCount}, Total: ${totalEmployees}`);

          setStats({
            totalEmployees: totalEmployees,
            presentToday: presentCount,
            absentToday: absentCount,
          });
          
          // Update last fetched date
          setLastFetchedDate(currentDate);
        } catch (error) {
          console.error("Error fetching attendance stats:", error);
          
          // If database fetch fails, still show employees count
          setStats(prev => ({
            ...prev,
            totalEmployees: filteredEmployees?.length || 0,
          }));
        }
      };

      // Fetch data when date changes
      fetchDirectFromDatabase();
    } else {
      // Even if we don't fetch new data, update the total employees count
      // This ensures the count is current even if the date hasn't changed
      if (filteredEmployees?.length !== stats.totalEmployees) {
        setStats(prev => ({
          ...prev,
          totalEmployees: filteredEmployees?.length || 0,
        }));
      }
    }
    
  }, [filteredEmployees, currentDate, lastFetchedDate, stats.totalEmployees]);

  return stats;
};
