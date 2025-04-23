
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { supabase } from "@/integrations/supabase/client";
import { useAttendance } from "@/contexts/AttendanceContext";
import { SponsorshipType, PaymentType } from "@/lib/types";

interface SponsorshipBreakdown {
  'YDM co': number;
  'YDM est': number;
  'Outside': number;
}

interface PaymentTypeBreakdown {
  'Monthly': number;
  'Daily': number;
}

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  sponsorshipBreakdown: SponsorshipBreakdown;
  paymentBreakdown: PaymentTypeBreakdown;
  presentBreakdown: SponsorshipBreakdown;
  absentBreakdown: SponsorshipBreakdown;
  presentPaymentBreakdown: PaymentTypeBreakdown;
  absentPaymentBreakdown: PaymentTypeBreakdown;
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
    paymentBreakdown: {
      'Monthly': 0,
      'Daily': 0
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
    },
    presentPaymentBreakdown: {
      'Monthly': 0,
      'Daily': 0
    },
    absentPaymentBreakdown: {
      'Monthly': 0,
      'Daily': 0
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
          .select('*, employees!inner(sponsorship, payment_type)')
          .eq('date', currentDate);
        
        if (error) {
          console.error("Error fetching attendance stats:", error);
          throw error;
        }

        // Calculate active employees and their breakdowns
        const activeEmployees = filteredEmployees?.filter(emp => emp.status === "Active") || [];
        const totalActiveEmployees = activeEmployees.length;

        // Calculate sponsorship breakdown for total employees
        const sponsorshipBreakdown: SponsorshipBreakdown = {
          'YDM co': activeEmployees.filter(emp => emp.sponsorship === 'YDM co').length,
          'YDM est': activeEmployees.filter(emp => emp.sponsorship === 'YDM est').length,
          'Outside': activeEmployees.filter(emp => emp.sponsorship === 'Outside').length
        };

        // Calculate payment type breakdown for total employees
        const paymentBreakdown: PaymentTypeBreakdown = {
          'Monthly': activeEmployees.filter(emp => emp.paymentType === 'Monthly').length,
          'Daily': activeEmployees.filter(emp => emp.paymentType === 'Daily').length
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
        const presentPaymentBreakdown: PaymentTypeBreakdown = {
          'Monthly': 0,
          'Daily': 0
        };
        const absentPaymentBreakdown: PaymentTypeBreakdown = {
          'Monthly': 0,
          'Daily': 0
        };

        // Calculate present and absent counts with breakdowns
        attendanceData?.forEach(record => {
          const sponsorship = record.employees?.sponsorship as SponsorshipType;
          const paymentType = record.employees?.payment_type as PaymentType;
          
          if (record.present) {
            presentBreakdown[sponsorship]++;
            presentPaymentBreakdown[paymentType]++;
          } else {
            absentBreakdown[sponsorship]++;
            absentPaymentBreakdown[paymentType]++;
          }
        });

        const presentCount = Object.values(presentBreakdown).reduce((a, b) => a + b, 0);
        const absentCount = Object.values(absentBreakdown).reduce((a, b) => a + b, 0);

        setStats({
          totalEmployees: totalActiveEmployees,
          presentToday: presentCount,
          absentToday: absentCount,
          sponsorshipBreakdown,
          paymentBreakdown,
          presentBreakdown,
          absentBreakdown,
          presentPaymentBreakdown,
          absentPaymentBreakdown
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
        const paymentBreakdown = {
          'Monthly': activeEmployees.filter(emp => emp.paymentType === 'Monthly').length,
          'Daily': activeEmployees.filter(emp => emp.paymentType === 'Daily').length
        };
        
        setStats(prev => ({
          ...prev,
          totalEmployees: activeEmployees.length,
          sponsorshipBreakdown,
          paymentBreakdown,
          presentBreakdown: { 'YDM co': 0, 'YDM est': 0, 'Outside': 0 },
          absentBreakdown: { 'YDM co': 0, 'YDM est': 0, 'Outside': 0 },
          presentPaymentBreakdown: { 'Monthly': 0, 'Daily': 0 },
          absentPaymentBreakdown: { 'Monthly': 0, 'Daily': 0 }
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceStats();
    
  }, [filteredEmployees, currentDate]);

  return { ...stats, isLoading };
};
