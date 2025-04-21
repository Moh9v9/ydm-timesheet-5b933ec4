
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Employee, AttendanceRecord } from "@/lib/types";
import { format } from "date-fns";

interface DashboardAttendanceTableProps {
  currentDate: string;
  employeeData: Employee[];
}

export const DashboardAttendanceTable = ({ currentDate, employeeData }: DashboardAttendanceTableProps) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const formattedDate = currentDate === new Date().toISOString().split('T')[0] 
    ? "Today" 
    : format(new Date(currentDate), "MMMM d, yyyy");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('attendance_records')
          .select('*')
          .eq('date', currentDate);
        
        if (error) {
          console.error("Error fetching dashboard attendance:", error);
          throw error;
        }
        
        // Transform data to match AttendanceRecord type
        const formattedData = data.map(record => ({
          id: record.id,
          employeeId: record.employee_uuid,
          employeeName: record.employee_name,
          date: record.date,
          present: record.present,
          startTime: record.start_time,
          endTime: record.end_time,
          overtimeHours: record.overtime_hours,
          note: record.note
        }));
        
        setAttendanceData(formattedData);
      } catch (error) {
        console.error("Failed to fetch dashboard attendance data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [currentDate]);
  
  return (
    <div>
      <div className="py-3 px-4 border-b bg-muted/30">
        <span className="font-medium">{formattedDate}'s Attendance</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/20">
            <tr>
              <th className="text-left py-2 px-4 font-medium">Employee Name</th>
              <th className="text-left py-2 px-4 font-medium">Status</th>
              <th className="text-left py-2 px-4 font-medium">Time In</th>
              <th className="text-left py-2 px-4 font-medium">Time Out</th>
              <th className="text-left py-2 px-4 font-medium">OT Hours</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary rounded-full"></div>
                    Loading attendance data...
                  </div>
                </td>
              </tr>
            ) : attendanceData.length > 0 ? (
              attendanceData.map(record => {
                const employee = employeeData.find(emp => emp.id === record.employeeId);
                if (!employee) return null;
                
                return (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">{employee.fullName}</td>
                    <td className="py-2 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.present 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {record.present ? "Present" : "Absent"}
                      </span>
                    </td>
                    <td className="py-2 px-4">{record.startTime || "-"}</td>
                    <td className="py-2 px-4">{record.endTime || "-"}</td>
                    <td className="py-2 px-4">{record.overtimeHours || "0"}</td>
                  </tr>
                );
              })
            ) : employeeData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  No employees found. Please add employees first.
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  No attendance records for {formattedDate}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
