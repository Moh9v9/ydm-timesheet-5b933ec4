
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { AttendanceRecord } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
}

// Always get a fresh date
const getTodayISODate = () => new Date().toISOString().split('T')[0];

export const useStatistics = () => {
  const { filteredEmployees } = useEmployees();
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
        // Always get a fresh date for today
        const today = getTodayISODate();
        console.log("useStatistics - Fetching data for fresh current date:", today, "Refresh count:", refreshCount);
        
        // Get records directly from Supabase for today's date
        const { data, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', today);
        
        if (error) {
          console.error("Error fetching attendance stats:", error);
          throw error;
        }

        console.log(`useStatistics - Retrieved ${data?.length || 0} records for ${today}`);

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
  }, [filteredEmployees, refreshCount]); // Include refreshCount to enable manual refreshes

  return stats;
};
