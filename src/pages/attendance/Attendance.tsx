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

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees } = useEmployees();
  const { currentDate, setCurrentDate } = useAttendance();
  const { NotificationContainer } = useNotification();
  
  const canEdit = user?.permissions.attendees.edit;
  
  const {
    attendanceData,
    isLoading,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  } = useAttendanceData(canEdit);

  const {
    isSubmitting,
    showBulkUpdate,
    setShowBulkUpdate,
    showSaveConfirm,
    setShowSaveConfirm,
    handleSave,
    confirmSave,
    handleUpdateAll,
    handleBulkUpdate
  } = useAttendanceOperations(canEdit);

  // We're using attendanceData and currentDate from useAttendanceData,
  // but let's check how many records exist for currentDate.
  const recordsForDate = attendanceData.filter(record => record.date === currentDate);
  const attendanceCount = recordsForDate.length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20">
      <NotificationContainer />

      <AttendanceHeader
        canEdit={canEdit}
        isSubmitting={isSubmitting}
        onUpdateAll={handleUpdateAll}
        onSave={handleSave}
      />

      <div className="flex items-center mb-2">
        <DateNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <AttendanceStatusMark attendanceCount={attendanceCount} />
      </div>

      <AttendanceTable
        attendanceData={attendanceData}
        filteredEmployees={filteredEmployees}
        canEdit={canEdit}
        onToggleAttendance={toggleAttendance}
        onTimeChange={handleTimeChange}
        onOvertimeChange={handleOvertimeChange}
        onNoteChange={handleNoteChange}
        isLoading={isLoading}
      />

      <BulkUpdateDialog 
        open={showBulkUpdate}
        onClose={() => setShowBulkUpdate(false)}
        onConfirm={(data) => handleBulkUpdate(attendanceData, data)}
      />
      
      <ConfirmDialog
        open={showSaveConfirm}
        onOpenChange={setShowSaveConfirm}
        onConfirm={() => confirmSave(attendanceData)}
        title="Save Attendance Records"
        description="Are you sure you want to save these attendance records? This action cannot be undone."
        confirmText={isSubmitting ? "Saving..." : "Save Records"}
      />
    </div>
  );
};

export default Attendance;
