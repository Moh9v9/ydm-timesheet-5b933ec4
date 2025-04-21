
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import DateNavigation from "./components/DateNavigation";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceHeader from "./components/AttendanceHeader";
import { useAttendanceData } from "./hooks/useAttendanceData";
import AttendanceStatusMark from "./components/AttendanceStatusMark";
import AttendanceLoadingSkeleton from "./components/AttendanceLoadingSkeleton";
import AttendanceDialogsContainer from "./components/AttendanceDialogsContainer";
import { useAttendanceLoading } from "./hooks/useAttendanceLoading";
import { useEffect } from "react";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees, loading: employeesLoading, dataFetched, refreshEmployees } = useEmployees();
  const { currentDate, setCurrentDate } = useAttendance();
  const { NotificationContainer, success } = useNotification();

  const canEdit = user?.permissions.attendees.edit;
  const canViewAttendance = user?.permissions.attendees.view;

  // Custom hook for count/loading/trigger logic
  const {
    actualRecordCount,
    recordsLoading,
    dataRefreshTrigger,
    initialCheckDone,
    handleRefresh,
    setDataRefreshTrigger
  } = useAttendanceLoading(currentDate, filteredEmployees.length, employeesLoading, dataFetched, user);

  // Force employee data refresh when component mounts
  useEffect(() => {
    console.log("🔄 Attendance component mounted - refreshing employee data");
    refreshEmployees();
  }, [refreshEmployees]);

  const {
    attendanceData,
    isLoading,
    employeesLoaded,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  } = useAttendanceData(canEdit, dataRefreshTrigger);

  const combinedLoading = isLoading || recordsLoading;

  // Enhanced refresh function that also refreshes employee data
  const handleFullRefresh = () => {
    console.log("🔍 Performing full refresh");
    // First refresh employees
    refreshEmployees();
    // Then refresh attendance data
    handleRefresh();
    success("Data refreshed");
  };

  const handleSuccessfulSave = () => {
    setDataRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20">
      <NotificationContainer />

      <AttendanceHeader
        canEdit={canEdit}
        canViewAttendance={canViewAttendance}
        isSubmitting={false}
        onUpdateAll={() => {}}
        onSave={() => {}}
        onRefresh={handleFullRefresh} // Use the enhanced refresh function
      />

      <div className="flex items-center mb-2">
        <DateNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <AttendanceStatusMark attendanceCount={actualRecordCount} />
      </div>

      {!user ? (
        <AttendanceLoadingSkeleton />
      ) : (
        <AttendanceTable
          attendanceData={attendanceData}
          filteredEmployees={filteredEmployees}
          canEdit={canEdit}
          onToggleAttendance={toggleAttendance}
          onTimeChange={handleTimeChange}
          onOvertimeChange={handleOvertimeChange}
          onNoteChange={handleNoteChange}
          isLoading={combinedLoading}
          employeesLoaded={employeesLoaded}
        />
      )}

      <AttendanceDialogsContainer
        attendanceData={attendanceData}
        canEdit={canEdit}
        onSuccessfulSave={handleSuccessfulSave}
      />
    </div>
  );
};

export default Attendance;
