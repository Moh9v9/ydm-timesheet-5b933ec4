
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
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        setIsLoading(true);
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

        // Calculate total ACTIVE employees count only
        const activeEmployees = filteredEmployees?.filter(emp => emp.status === "Active") || [];
        const totalActiveEmployees = activeEmployees.length;

        console.log(`useStatistics - Calculated stats: Present: ${presentCount}, Absent: ${absentCount}, Total Active: ${totalActiveEmployees}`);

        setStats({
          totalEmployees: totalActiveEmployees, // Now only counting active employees
          presentToday: presentCount,
          absentToday: absentCount,
        });
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
        
        // If database fetch fails, still show active employees count
        const activeEmployees = filteredEmployees?.filter(emp => emp.status === "Active") || [];
        setStats(prev => ({
          ...prev,
          totalEmployees: activeEmployees.length,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceStats();
    
  }, [filteredEmployees, currentDate]);

  return { ...stats, isLoading };
};
