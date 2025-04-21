
import { useState } from "react";
import { useNotification } from "@/components/ui/notification";
import { useEmployees } from "@/contexts/EmployeeContext";
import { ExportFormat, ReportType } from "@/lib/types";
import { formatAttendanceForExport, generateFileContent, downloadFile } from "@/lib/reportUtils";
import { format, parse, endOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface UseReportGenerationProps {
  reportType: ReportType;
  exportFormat: ExportFormat;
  selectedDate: Date;
  searchTerm: string;
  selectedProject?: string;
  selectedLocation?: string;
  selectedPaymentType?: string;
  includeInactive: boolean;
  attendanceRecords: any[];
}

interface ReportFilters {
  reportType: ReportType;
  exportFormat: ExportFormat;
  date: Date;
  searchTerm?: string;
  project?: string;
  location?: string;
  paymentType?: string;
  includeInactive?: boolean;
}

export const useReportGeneration = ({
  reportType,
  exportFormat,
  selectedDate,
  searchTerm,
  selectedProject,
  selectedLocation,
  selectedPaymentType,
  includeInactive,
  attendanceRecords
}: UseReportGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { filteredEmployees } = useEmployees();
  const { success, error } = useNotification();

  const generateReport = async (filters?: ReportFilters) => {
    setIsGenerating(true);
    
    try {
      const reportTypeName = {
        daily: "Daily Attendance",
        monthly: "Monthly Attendance",
      }[reportType];
      
      const formatName = {
        csv: "CSV",
        xlsx: "Excel",
        pdf: "PDF"
      }[exportFormat];
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Generating ${reportType} report for date: ${formattedDate}`);
      
      let allRecords = [...attendanceRecords];
      
      if (reportType === 'monthly') {
        // Build the query
        let query = supabase
          .from('attendance_records')
          .select('*')
          .eq('present', true); // Only get present records
        
        // Get the month and year from selected date for monthly reports
        const selectedMonth = selectedDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        const lastDayOfMonth = endOfMonth(selectedDate);
        
        // Add date filtering for the selected month - using the proper last day of month
        query = query.gte('date', `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`)
                     .lte('date', format(lastDayOfMonth, 'yyyy-MM-dd'));
        
        // Add employee filter if an employee is selected
        if (searchTerm && searchTerm !== "") {
          console.log(`Filtering attendance records by employee: ${searchTerm}`);
          query = query.ilike('employee_name', `%${searchTerm}%`);
        }
        
        // Apply project filter if selected
        const projectFilter = filters?.project || selectedProject;
        if (projectFilter && projectFilter !== "all") {
          console.log(`Filtering by project: ${projectFilter}`);
          
          // Get employee IDs with the selected project
          const { data: projectEmployees } = await supabase
            .from('employees')
            .select('id')
            .eq('project', projectFilter)
            .or(includeInactive ? `status.eq.Active,status.eq.Archived` : 'status.eq.Active');
            
          if (projectEmployees && projectEmployees.length > 0) {
            const employeeIds = projectEmployees.map(emp => emp.id);
            query = query.in('employee_uuid', employeeIds);
          }
        }
        
        // Apply location filter if selected
        const locationFilter = filters?.location || selectedLocation;
        if (locationFilter && locationFilter !== "all") {
          console.log(`Filtering by location: ${locationFilter}`);
          
          // Get employee IDs with the selected location
          const { data: locationEmployees } = await supabase
            .from('employees')
            .select('id')
            .eq('location', locationFilter)
            .or(includeInactive ? `status.eq.Active,status.eq.Archived` : 'status.eq.Active');
            
          if (locationEmployees && locationEmployees.length > 0) {
            const employeeIds = locationEmployees.map(emp => emp.id);
            query = query.in('employee_uuid', employeeIds);
          }
        }
        
        // Apply payment type filter if selected
        const paymentTypeFilter = filters?.paymentType || selectedPaymentType;
        if (paymentTypeFilter && paymentTypeFilter !== "all") {
          console.log(`Filtering by payment type: ${paymentTypeFilter}`);
          
          // We need to get employee IDs with the selected payment type first
          const { data: filteredEmployees } = await supabase
            .from('employees')
            .select('id, payment_type')
            .eq('payment_type', paymentTypeFilter)
            .or(includeInactive ? `status.eq.Active,status.eq.Archived` : 'status.eq.Active');
          
          if (filteredEmployees && filteredEmployees.length > 0) {
            const employeeIds = filteredEmployees.map(emp => emp.id);
            console.log(`Found ${employeeIds.length} employees with payment type '${paymentTypeFilter}'`);
            
            // Filter attendance records by these employee IDs
            query = query.in('employee_uuid', employeeIds);
          } else {
            console.log(`No employees found with payment type: ${paymentTypeFilter}`);
            // Return early as no employees match criteria
            setIsGenerating(false);
            error(`No employees found with payment type: ${paymentTypeFilter}`);
            return;
          }
        }
        
        // If include inactive is turned on but no payment type filter,
        // we need to handle that separately
        if (includeInactive && (!paymentTypeFilter || paymentTypeFilter === "all")) {
          console.log('Including inactive employees in the report');
          
          // Get all employee IDs regardless of status
          const { data: allEmployees } = await supabase
            .from('employees')
            .select('id')
            .or('status.eq.Active,status.eq.Archived');
          
          if (allEmployees && allEmployees.length > 0) {
            const employeeIds = allEmployees.map(emp => emp.id);
            query = query.in('employee_uuid', employeeIds);
          }
        } else if (!includeInactive && (!paymentTypeFilter || paymentTypeFilter === "all")) {
          // If not including inactive and no specific payment type, only get active employees
          const { data: activeEmployees } = await supabase
            .from('employees')
            .select('id')
            .eq('status', 'Active');
            
          if (activeEmployees && activeEmployees.length > 0) {
            const employeeIds = activeEmployees.map(emp => emp.id);
            query = query.in('employee_uuid', employeeIds);
          }
        }
          
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data) {
          console.log(`Fetched ${data.length} total attendance records from database`);
          allRecords = data.map(record => ({
            id: record.id,
            employeeId: record.employee_uuid,
            employeeName: record.employee_name || '',
            date: record.date,
            present: record.present,
            startTime: record.start_time || '',
            endTime: record.end_time || '',
            overtimeHours: record.overtime_hours || 0,
            note: record.note || ''
          }));
        }
      } else if (searchTerm && searchTerm !== "") {
        allRecords = allRecords.filter(record => 
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && record.present
        );
      } else {
        allRecords = allRecords.filter(record => record.present);
      }

      // Create filter object for the formatter
      const formatterFilters = {
        project: filters?.project || selectedProject,
        location: filters?.location || selectedLocation,
        paymentType: filters?.paymentType || selectedPaymentType,
        searchTerm: filters?.searchTerm || searchTerm
      };

      const formattedData = formatAttendanceForExport(allRecords, reportType, formattedDate, formatterFilters);
      const { content, mimeType, isBinary } = generateFileContent(formattedData, exportFormat);
      
      const dateStr = format(selectedDate, "yyyyMMdd");
      const employeeStr = searchTerm ? `-${searchTerm.replace(/\s+/g, '-')}` : '';
      const paymentTypeStr = (filters?.paymentType || selectedPaymentType) !== 'all' ? `-${filters?.paymentType || selectedPaymentType}` : '';
      const filename = `${reportType}-attendance${employeeStr}${paymentTypeStr}-${dateStr}.${exportFormat}`;
      
      downloadFile(content, filename, mimeType, isBinary);
      
      success(`${reportTypeName} exported as ${formatName} successfully`);
      console.log("Export request:", {
        reportType,
        exportFormat,
        date: formattedDate,
        employee: searchTerm || "All",
        project: filters?.project || selectedProject || "All",
        location: filters?.location || selectedLocation || "All",
        paymentType: filters?.paymentType || selectedPaymentType || "All",
        includeInactive,
        employeesCount: filteredEmployees.length,
        recordsCount: formattedData.length
      });
    } catch (err) {
      error("Failed to generate report");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReport
  };
};
