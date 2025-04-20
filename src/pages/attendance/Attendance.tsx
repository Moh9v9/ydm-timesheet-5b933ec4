
import { useState, useEffect } from "react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/components/ui/notification";
import { Save } from "lucide-react";
import { AttendanceRecord } from "@/lib/types";
import DateNavigation from "./components/DateNavigation";
import AttendanceTable from "./components/AttendanceTable";
import BulkUpdateDialog from "./components/BulkUpdateDialog";
import ConfirmDialog from "@/components/ConfirmDialog";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees } = useEmployees();
  const { 
    currentDate, 
    setCurrentDate, 
    bulkSaveAttendance, 
    getRecordsByEmployeeAndDate 
  } = useAttendance();
  const { success, error, NotificationContainer } = useNotification();
  
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  
  const canEdit = user?.permissions.edit;

  useEffect(() => {
    const activeEmployees = filteredEmployees.filter(emp => emp.status === "Active");
    
    const initialAttendanceData = activeEmployees.map(employee => {
      const existingRecord = getRecordsByEmployeeAndDate(employee.id, currentDate);
      
      if (existingRecord) {
        return existingRecord;
      } else {
        return {
          id: `temp_${employee.id}_${currentDate}`,
          employeeId: employee.id,
          date: currentDate,
          present: true,
          startTime: "07:00",
          endTime: "17:00",
          overtimeHours: 0
        };
      }
    });
    
    setAttendanceData(initialAttendanceData);
  }, [filteredEmployees, currentDate, getRecordsByEmployeeAndDate]);

  const toggleAttendance = (index: number) => {
    if (!canEdit) return;
    
    const newData = [...attendanceData];
    newData[index].present = !newData[index].present;
    
    if (!newData[index].present) {
      newData[index].startTime = "";
      newData[index].endTime = "";
      newData[index].overtimeHours = 0;
    } else {
      newData[index].startTime = "07:00";
      newData[index].endTime = "17:00";
    }
    
    setAttendanceData(newData);
  };

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

  const handleOvertimeChange = (index: number, value: string) => {
    if (!canEdit) return;
    
    const newData = [...attendanceData];
    newData[index].overtimeHours = parseFloat(value) || 0;
    setAttendanceData(newData);
  };

  const handleNoteChange = (index: number, value: string) => {
    if (!canEdit) return;
    
    const newData = [...attendanceData];
    newData[index].note = value;
    setAttendanceData(newData);
  };

  const handleSave = () => {
    if (!canEdit) {
      error("You don't have permission to edit attendance records");
      return;
    }
    setShowSaveConfirm(true);
  };

  const confirmSave = async () => {
    setIsSubmitting(true);
    
    try {
      await bulkSaveAttendance(attendanceData);
      success("Attendance data saved successfully");
      setShowSaveConfirm(false);
    } catch (err) {
      error("Failed to save attendance data");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAll = () => {
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
    note: string;
  }) => {
    setIsSubmitting(true);
    
    try {
      const updatedRecords = attendanceData.map(record => ({
        ...record,
        present: data.present,
        startTime: data.startTime,
        endTime: data.endTime,
        overtimeHours: data.overtimeHours,
        note: data.note
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

      <DateNavigation
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />

      <AttendanceTable
        attendanceData={attendanceData}
        filteredEmployees={filteredEmployees}
        canEdit={canEdit}
        onToggleAttendance={toggleAttendance}
        onTimeChange={handleTimeChange}
        onOvertimeChange={handleOvertimeChange}
        onNoteChange={handleNoteChange}
      />

      <BulkUpdateDialog 
        open={showBulkUpdate}
        onClose={() => setShowBulkUpdate(false)}
        onConfirm={handleBulkUpdate}
      />
      
      <ConfirmDialog
        open={showSaveConfirm}
        onOpenChange={setShowSaveConfirm}
        onConfirm={confirmSave}
        title="Save Attendance Records"
        description="Are you sure you want to save these attendance records? This action cannot be undone."
        confirmText={isSubmitting ? "Saving..." : "Save Records"}
      />
    </div>
  );
};

export default Attendance;
