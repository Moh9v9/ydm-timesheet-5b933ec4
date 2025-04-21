import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import DateNavigation from "./components/DateNavigation";
import AttendanceTable from "./components/table/AttendanceTable";
import AttendanceHeader from "./components/AttendanceHeader";
import { useAttendanceData } from "./hooks/useAttendanceData";
import AttendanceStatusMark from "./components/AttendanceStatusMark";
import AttendanceLoadingSkeleton from "./components/AttendanceLoadingSkeleton";
import AttendanceDialogsContainer from "./components/AttendanceDialogsContainer";
import { useAttendanceLoading } from "./hooks/useAttendanceLoading";
import { useEffect, useRef, useState } from "react";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees, loading: employeesLoading, dataFetched, refreshEmployees } = useEmployees();
  const { currentDate, setCurrentDate } = useAttendance();
  const { NotificationContainer, success } = useNotification();
  const hasRefreshedRef = useRef(false);
  const lastDateRef = useRef(currentDate);
  
  // Add state for controlling dialogs
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Only refresh employee data once when component mounts
  useEffect(() => {
    if (!hasRefreshedRef.current && user) {
      console.log("🔄 Attendance component mounted - refreshing employee data once");
      hasRefreshedRef.current = true;
      refreshEmployees();
    }
  }, [refreshEmployees, user]);
  
  // Also refresh employees when date changes
  useEffect(() => {
    if (lastDateRef.current !== currentDate) {
      console.log(`🔄 Date changed from ${lastDateRef.current} to ${currentDate} - refreshing employee data`);
      lastDateRef.current = currentDate;
      refreshEmployees();
      handleRefresh();
    }
  }, [currentDate, refreshEmployees, handleRefresh]);

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

  const handleUpdateAll = () => {
    if (!canEdit) return;
    setShowBulkUpdate(true);
  };

  const handleSave = () => {
    if (!canEdit) return;
    setShowSaveConfirm(true);
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
        isSubmitting={isSubmitting}
        onUpdateAll={handleUpdateAll}
        onSave={handleSave}
        onRefresh={handleFullRefresh}
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
        showBulkUpdate={showBulkUpdate}
        setShowBulkUpdate={setShowBulkUpdate}
        showSaveConfirm={showSaveConfirm}
        setShowSaveConfirm={setShowSaveConfirm}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </div>
  );
};

export default Attendance;
