
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
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
  console.log("📊 useStatistics - Hook initializing");
  const { filteredEmployees } = useEmployees();
  console.log("📊 useStatistics - Successfully got filteredEmployees:", filteredEmployees?.length);
  
  const { currentDate, attendanceRecords } = useAttendance();
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

        // Instead of using Supabase, use the attendanceRecords from the AttendanceContext
        const todayRecords = attendanceRecords.filter(record => record.date === currentDate);
        
        // Calculate present and absent counts with breakdowns
        for (const employee of activeEmployees) {
          const record = todayRecords.find(rec => rec.employeeId === employee.id);
          const isPresent = record?.present || false;
          
          if (isPresent) {
            presentBreakdown[employee.sponsorship as SponsorshipType]++;
            presentPaymentBreakdown[employee.paymentType as PaymentType]++;
          } else {
            absentBreakdown[employee.sponsorship as SponsorshipType]++;
            absentPaymentBreakdown[employee.paymentType as PaymentType]++;
          }
        }

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
        
        // If fetch fails, still show active employees count
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
    
  }, [filteredEmployees, currentDate, attendanceRecords]);

  return { ...stats, isLoading };
};
