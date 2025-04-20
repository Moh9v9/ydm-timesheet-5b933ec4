import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/components/ui/notification";
import { format, parse, addDays, subDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { AttendanceRecord } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BulkUpdateDialog from "./components/BulkUpdateDialog";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees } = useEmployees();
  const { 
    attendanceRecords, 
    currentDate, 
    setCurrentDate, 
    bulkSaveAttendance, 
    getRecordsByEmployeeAndDate 
  } = useAttendance();
  const { success, error, NotificationContainer } = useNotification();
  
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  
  const canEdit = user?.permissions.edit;
  
  // Prepare attendance data when employees or date changes
  useEffect(() => {
    const activeEmployees = filteredEmployees.filter(emp => emp.status === "Active");
    
    // Initialize attendance data for each active employee
    const initialAttendanceData = activeEmployees.map(employee => {
      // Check if existing record for the employee on this date
      const existingRecord = getRecordsByEmployeeAndDate(employee.id, currentDate);
      
      if (existingRecord) {
        return existingRecord;
      } else {
        // Create new record with default values
        return {
          id: `temp_${employee.id}_${currentDate}`,
          employeeId: employee.id,
          date: currentDate,
          present: true, 
          startTime: "07:00", // Updated default start time
          endTime: "17:00",   // Updated default end time (5 PM = 17:00)
          overtimeHours: 0
        };
      }
    });
    
    setAttendanceData(initialAttendanceData);
  }, [filteredEmployees, currentDate, getRecordsByEmployeeAndDate]);
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const date = parse(currentDate, "yyyy-MM-dd", new Date());
    const prevDate = subDays(date, 1);
    setCurrentDate(format(prevDate, "yyyy-MM-dd"));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const date = parse(currentDate, "yyyy-MM-dd", new Date());
    const nextDate = addDays(date, 1);
    setCurrentDate(format(nextDate, "yyyy-MM-dd"));
  };
  
  // Set to today
  const goToToday = () => {
    setCurrentDate(format(new Date(), "yyyy-MM-dd"));
  };
  
  // Handle date picker change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(e.target.value);
    setShowDatePicker(false);
  };
  
  // Toggle attendance status
  const toggleAttendance = (index: number) => {
    if (!canEdit) return;
    
    const newData = [...attendanceData];
    newData[index].present = !newData[index].present;
    
    // If marked as absent, clear times
    if (!newData[index].present) {
      newData[index].startTime = "";
      newData[index].endTime = "";
      newData[index].overtimeHours = 0;
    } else {
      // If marked as present, set default times
      newData[index].startTime = "07:00";
      newData[index].endTime = "17:00";
    }
    
    setAttendanceData(newData);
  };
  
  // Handle time changes
  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    if (!canEdit) return;
    
    const newData = [...attendanceData];
    newData[index][field] = value;
    setAttendanceData(newData);
  };
  
  // Handle overtime hours change
  const handleOvertimeChange = (index: number, value: string) => {
    if (!canEdit) return;
    
    const newData = [...attendanceData];
    newData[index].overtimeHours = parseFloat(value) || 0;
    setAttendanceData(newData);
  };
  
  // Save attendance data
  const handleSave = async () => {
    if (!canEdit) {
      error("You don't have permission to edit attendance records");
      return;
    }
    
    // Confirm save
    if (!window.confirm("Are you sure you want to save these attendance records?")) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await bulkSaveAttendance(attendanceData);
      success("Attendance data saved successfully");
    } catch (err) {
      error("Failed to save attendance data");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the handleUpdateAll function
  const handleUpdateAll = async () => {
    if (!canEdit) {
      error("You don't have permission to update attendance records");
      return;
    }
    
    setShowBulkUpdate(true);
  };

  const handleBulkUpdate = async (data: {
    present: boolean;
    startTime: string;
    endTime: string;
    overtimeHours: number;
  }) => {
    setIsSubmitting(true);
    
    try {
      const updatedRecords = attendanceData.map(record => ({
        ...record,
        present: data.present,
        startTime: data.startTime,
        endTime: data.endTime,
        overtimeHours: data.overtimeHours
      }));
      
      await bulkSaveAttendance(updatedRecords);
      success("All attendance records updated successfully");
      setShowBulkUpdate(false);
    } catch (err) {
      error("Failed to update attendance records");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <NotificationContainer />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Daily Attendance</h1>
          <p className="text-muted-foreground">
            Manage employee attendance records
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          {canEdit && (
            <>
              <button
                onClick={handleUpdateAll}
                disabled={isSubmitting}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center hover:bg-secondary/90 transition-colors disabled:opacity-70"
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Updating..." : "Update All"}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center p-4 bg-card rounded-lg border space-x-4">
        <button
          onClick={goToPreviousDay}
          className="w-10 h-10 rounded-full flex items-center justify-center 
                     transition-all duration-300 
                     bg-secondary text-secondary-foreground 
                     hover:bg-secondary/80 
                     focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                     shadow-sm hover:shadow-md"
          aria-label="Previous day"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium
                       hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
          >
            Today
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center space-x-2 px-6 py-3 border rounded-lg hover:bg-accent/50 
                           transition-all duration-300 min-w-[280px] justify-center
                           shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <CalendarIcon size={18} />
                <span className="font-medium">
                  {format(parse(currentDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={parse(currentDate, "yyyy-MM-dd", new Date())}
                onSelect={(date) => {
                  if (date) {
                    setCurrentDate(format(date, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
                className="rounded-md border shadow-md p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <button
          onClick={goToNextDay}
          className="w-10 h-10 rounded-full flex items-center justify-center 
                     transition-all duration-300 
                     bg-secondary text-secondary-foreground 
                     hover:bg-secondary/80 
                     focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                     shadow-sm hover:shadow-md"
          aria-label="Next day"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Attendance Table */}
      <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Overtime Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((record, index) => {
                  // Find the corresponding employee
                  const employee = filteredEmployees.find(
                    emp => emp.id === record.employeeId
                  );
                  
                  if (!employee) return null;
                  
                  return (
                    <tr key={record.id}>
                      <td>
                        <div>
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-xs text-muted-foreground">{employee.employeeId}</div>
                        </div>
                      </td>
                      
                      <td>
                        <div className="flex items-center">
                          <div 
                            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
                              record.present 
                                ? "attendance-present" 
                                : "attendance-absent"
                            }`}
                            onClick={() => toggleAttendance(index)}
                          >
                            <div 
                              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                record.present ? "translate-x-6" : ""
                              }`} 
                            />
                          </div>
                          <span className="ml-2">
                            {record.present ? "Present" : "Absent"}
                          </span>
                        </div>
                      </td>
                      
                      <td>
                        {record.present ? (
                          <input
                            type="time"
                            value={record.startTime}
                            onChange={(e) => handleTimeChange(index, "startTime", e.target.value)}
                            disabled={!canEdit || !record.present}
                            className="p-1 border rounded-md w-28"
                          />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                      
                      <td>
                        {record.present ? (
                          <input
                            type="time"
                            value={record.endTime}
                            onChange={(e) => handleTimeChange(index, "endTime", e.target.value)}
                            disabled={!canEdit || !record.present}
                            className="p-1 border rounded-md w-28"
                          />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                      
                      <td>
                        {record.present ? (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={record.overtimeHours}
                            onChange={(e) => handleOvertimeChange(index, e.target.value)}
                            disabled={!canEdit || !record.present}
                            className="p-1 border rounded-md w-20"
                          />
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No employees found for attendance tracking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="bg-accent text-accent-foreground p-4 rounded-lg text-sm">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Toggle the switch to mark an employee as present or absent</li>
          <li>Enter start and end times for present employees</li>
          <li>Add overtime hours if applicable</li>
          <li>Click 'Save Attendance' to save all records</li>
        </ul>
      </div>

      <BulkUpdateDialog 
        open={showBulkUpdate}
        onClose={() => setShowBulkUpdate(false)}
        onConfirm={handleBulkUpdate}
      />
    </div>
  );
};

export default Attendance;
