
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
import { useState } from "react";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees, loading: employeesLoading, dataFetched } = useEmployees();
  const { currentDate, setCurrentDate } = useAttendance();
  const { NotificationContainer } = useNotification();

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

  const handleSuccessfulSave = () => {
    setDataRefreshTrigger((prev: number) => prev + 1);
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
        onRefresh={handleRefresh}
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
