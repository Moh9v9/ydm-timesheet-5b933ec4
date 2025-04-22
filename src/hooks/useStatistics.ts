
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAttendance } from "@/contexts/AttendanceContext";
import { SponsorshipType } from "@/lib/types";

interface SponsorshipBreakdown {
  'YDM co': number;
  'YDM est': number;
  'Outside': number;
}

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  sponsorshipBreakdown: SponsorshipBreakdown;
  presentBreakdown: SponsorshipBreakdown;
  absentBreakdown: SponsorshipBreakdown;
}

export const useStatistics = () => {
  const { filteredEmployees } = useEmployees();
  const { currentDate } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    sponsorshipBreakdown: {
      'YDM co': 0,
      'YDM est': 0,
      'Outside': 0
    },
    presentBreakdown: {
      'YDM co': 0,
      'YDM est': 0,
      'Outside': 0
    },
    absentBreakdown: {
      'YDM co': 0,
      'YDM est': 0,
      'Outside': 0
    }
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        setIsLoading(true);
        console.log("useStatistics - Fetching data for selected date:", currentDate);
        
        // Get records directly from Supabase for the selected date
        const { data: attendanceData, error } = await supabase
          .from('attendance_records')
          .select('*, employees!inner(sponsorship)')
          .eq('date', currentDate);
        
        if (error) {
          console.error("Error fetching attendance stats:", error);
          throw error;
        }

        // Calculate active employees and their sponsorship breakdown
        const activeEmployees = filteredEmployees?.filter(emp => emp.status === "Active") || [];
        const totalActiveEmployees = activeEmployees.length;

        // Calculate sponsorship breakdown for total employees
        const sponsorshipBreakdown: SponsorshipBreakdown = {
          'YDM co': activeEmployees.filter(emp => emp.sponsorship === 'YDM co').length,
          'YDM est': activeEmployees.filter(emp => emp.sponsorship === 'YDM est').length,
          'Outside': activeEmployees.filter(emp => emp.sponsorship === 'Outside').length
        };

        // Initialize present/absent breakdowns
        const presentBreakdown: SponsorshipBreakdown = {
          'YDM co': 0,
          'YDM est': 0,
          'Outside': 0
        };
        const absentBreakdown: SponsorshipBreakdown = {
          'YDM co': 0,
          'YDM est': 0,
          'Outside': 0
        };

        // Calculate present and absent counts with sponsorship breakdown
        attendanceData?.forEach(record => {
          const sponsorship = record.employees?.sponsorship as SponsorshipType;
          if (record.present) {
            presentBreakdown[sponsorship]++;
          } else {
            absentBreakdown[sponsorship]++;
          }
        });

        const presentCount = Object.values(presentBreakdown).reduce((a, b) => a + b, 0);
        const absentCount = Object.values(absentBreakdown).reduce((a, b) => a + b, 0);

        console.log(`useStatistics - Calculated stats: Present: ${presentCount}, Absent: ${absentCount}, Total Active: ${totalActiveEmployees}`);

        setStats({
          totalEmployees: totalActiveEmployees,
          presentToday: presentCount,
          absentToday: absentCount,
          sponsorshipBreakdown,
          presentBreakdown,
          absentBreakdown
        });
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
        
        // If database fetch fails, still show active employees count
        const activeEmployees = filteredEmployees?.filter(emp => emp.status === "Active") || [];
        const sponsorshipBreakdown = {
          'YDM co': activeEmployees.filter(emp => emp.sponsorship === 'YDM co').length,
          'YDM est': activeEmployees.filter(emp => emp.sponsorship === 'YDM est').length,
          'Outside': activeEmployees.filter(emp => emp.sponsorship === 'Outside').length
        };
        
        setStats(prev => ({
          ...prev,
          totalEmployees: activeEmployees.length,
          sponsorshipBreakdown,
          presentBreakdown: { 'YDM co': 0, 'YDM est': 0, 'Outside': 0 },
          absentBreakdown: { 'YDM co': 0, 'YDM est': 0, 'Outside': 0 }
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceStats();
    
  }, [filteredEmployees, currentDate]);

  return { ...stats, isLoading };
};
