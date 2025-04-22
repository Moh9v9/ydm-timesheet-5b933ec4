
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useModernNotification } from "@/hooks/useModernNotification";
import { useEffect, useRef, useState } from "react";
import DateNavigation from "./components/DateNavigation";
import AttendanceTable from "./components/table/AttendanceTable";
import AttendanceHeader from "./components/AttendanceHeader";
import { useAttendanceData } from "./hooks/useAttendanceData";
import AttendanceStatusMark from "./components/AttendanceStatusMark";
import AttendanceLoadingSkeleton from "./components/AttendanceLoadingSkeleton";
import AttendanceDialogsContainer from "./components/AttendanceDialogsContainer";
import { useAttendanceLoading } from "./hooks/useAttendanceLoading";
import { useAttendanceEmployees } from "./hooks/useAttendanceEmployees";
import { AttendanceFilters } from "./components/AttendanceFilters";

const Attendance = () => {
  const { user } = useAuth();
  const { currentDate, setCurrentDate } = useAttendance();
  const {
    NotificationContainer,
    success,
  } = useModernNotification();
  const hasRefreshedRef = useRef(false);
  const lastDateRef = useRef(currentDate);
  
  // Add state for controlling dialogs
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add state for filters
  const [filters, setFilters] = useState({
    project: "All Projects",
    location: "All Locations",
    paymentType: "All Types",
    sponsorship: "All Sponsorships",
    status: "All Status"
  });

  // Use our hook with filters passed in
  const { attendanceEmployees, loading: employeesLoading } = useAttendanceEmployees(currentDate, filters);

  const canEdit = user?.permissions.attendees.edit;
  const canViewAttendance = user?.permissions.attendees.view;

  // Custom hook for count/loading/trigger logic - updated to use attendanceEmployees
  const {
    actualRecordCount,
    recordsLoading,
    dataRefreshTrigger,
    initialCheckDone,
    handleRefresh,
    setDataRefreshTrigger
  } = useAttendanceLoading(currentDate, attendanceEmployees.length, employeesLoading, true, user);

  // We don't need to refresh employee data here anymore since useAttendanceEmployees
  // handles its own data fetching
  useEffect(() => {
    if (lastDateRef.current !== currentDate) {
      console.log(`🔄 Date changed from ${lastDateRef.current} to ${currentDate} - refreshing data`);
      lastDateRef.current = currentDate;
      // Just refresh attendance data when date changes
      handleRefresh();
    }
  }, [currentDate, handleRefresh]);

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

  // Modified refresh function - no need to refresh employees separately
  const handleFullRefresh = () => {
    console.log("🔍 Performing full refresh");
    // Just refresh attendance data
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
    success("Attendance saved successfully");
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log(`Filter changed: ${key} = ${value}`);
    setFilters(prev => ({ ...prev, [key]: value }));
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
        <>
          <AttendanceFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <AttendanceTable
            attendanceData={attendanceData}
            filteredEmployees={attendanceEmployees}
            canEdit={canEdit}
            onToggleAttendance={toggleAttendance}
            onTimeChange={handleTimeChange}
            onOvertimeChange={handleOvertimeChange}
            onNoteChange={handleNoteChange}
            isLoading={combinedLoading}
            employeesLoaded={employeesLoaded}
          />
        </>
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
