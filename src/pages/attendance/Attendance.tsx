
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import DateNavigation from "./components/DateNavigation";
import AttendanceTable from "./components/AttendanceTable";
import BulkUpdateDialog from "./components/BulkUpdateDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import AttendanceHeader from "./components/AttendanceHeader";
import { useAttendanceData } from "./hooks/useAttendanceData";
import { useAttendanceOperations } from "./hooks/useAttendanceOperations";
import AttendanceStatusMark from "./components/AttendanceStatusMark";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees, loading: employeesLoading } = useEmployees();
  const { currentDate, setCurrentDate } = useAttendance();
  const { NotificationContainer } = useNotification();
  const [actualRecordCount, setActualRecordCount] = useState(0);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
  
  const canEdit = user?.permissions.attendees.edit;
  const canViewAttendance = user?.permissions.attendees.view;

  const {
    attendanceData,
    isLoading,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  } = useAttendanceData(canEdit, dataRefreshTrigger);

  const {
    isSubmitting,
    showBulkUpdate,
    setShowBulkUpdate,
    showSaveConfirm,
    setShowSaveConfirm,
    handleSave,
    confirmSave,
    handleUpdateAll,
    handleBulkUpdate,
    refreshData
  } = useAttendanceOperations(canEdit);

  useEffect(() => {
    const fetchActualRecordCount = async () => {
      setRecordsLoading(true);
      try {
        console.log("Attendance - Fetching record count for date:", currentDate);
        const { count, error } = await supabase
          .from('attendance_records')
          .select('*', { count: 'exact', head: true })
          .eq('date', currentDate);
        
        if (error) {
          console.error('Error fetching attendance count:', error);
          return;
        }
        
        console.log(`Attendance - Found ${count || 0} records for date ${currentDate}`);
        setActualRecordCount(count || 0);
        
        if ((count && count > 0) || filteredEmployees.length > 0) {
          setDataRefreshTrigger(prev => prev + 1);
        }
      } catch (err) {
        console.error('Failed to fetch attendance count:', err);
      } finally {
        setRecordsLoading(false);
      }
    };

    fetchActualRecordCount();
    
  }, [currentDate, filteredEmployees.length]);

  const handleSuccessfulSave = () => {
    setDataRefreshTrigger(prev => prev + 1);
  };

  const combinedLoading = isLoading || recordsLoading || employeesLoading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20">
      <NotificationContainer />

      <AttendanceHeader
        canEdit={canEdit}
        canViewAttendance={canViewAttendance}
        isSubmitting={isSubmitting}
        onUpdateAll={handleUpdateAll}
        onSave={handleSave}
        onRefresh={() => setDataRefreshTrigger(prev => prev + 1)}
      />

      <div className="flex items-center mb-2">
        <DateNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <AttendanceStatusMark attendanceCount={actualRecordCount} />
      </div>

      <AttendanceTable
        attendanceData={attendanceData}
        filteredEmployees={filteredEmployees}
        canEdit={canEdit}
        onToggleAttendance={toggleAttendance}
        onTimeChange={handleTimeChange}
        onOvertimeChange={handleOvertimeChange}
        onNoteChange={handleNoteChange}
        isLoading={combinedLoading}
      />

      <BulkUpdateDialog 
        open={showBulkUpdate}
        onClose={() => setShowBulkUpdate(false)}
        onConfirm={(data) => handleBulkUpdate(attendanceData, data)}
      />
      
      <ConfirmDialog
        open={showSaveConfirm}
        onOpenChange={setShowSaveConfirm}
        onConfirm={() => {
          confirmSave(attendanceData);
          handleSuccessfulSave();
        }}
        title="Save Attendance Records"
        description="Are you sure you want to save these attendance records? This action cannot be undone."
        confirmText={isSubmitting ? "Saving..." : "Save Records"}
      />
    </div>
  );
};

export default Attendance;

