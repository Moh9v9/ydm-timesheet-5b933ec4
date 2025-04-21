import { useAuth } from "@/contexts/AuthContext";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useNotification } from "@/components/ui/notification";
import DateNavigation from "./components/DateNavigation";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceHeader from "./components/AttendanceHeader";
import { useAttendanceData } from "./hooks/useAttendanceData";
import { useAttendanceOperations } from "./hooks/useAttendanceOperations";
import AttendanceStatusMark from "./components/AttendanceStatusMark";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

import AttendanceLoadingSkeleton from "./components/AttendanceLoadingSkeleton";
import AttendanceDialogs from "./components/AttendanceDialogs";

const Attendance = () => {
  const { user } = useAuth();
  const { filteredEmployees, loading: employeesLoading, dataFetched } = useEmployees();
  const { currentDate, setCurrentDate } = useAttendance();
  const { NotificationContainer } = useNotification();
  const [actualRecordCount, setActualRecordCount] = useState(0);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [dataRefreshTrigger, setDataRefreshTrigger] = useState(0);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const hasInitializedRef = useRef(false);
  
  const canEdit = user?.permissions.attendees.edit;
  const canViewAttendance = user?.permissions.attendees.view;

  console.log("Attendance component - Employees loading:", employeesLoading, 
    "Data fetched:", dataFetched, 
    "Employee count:", filteredEmployees.length);

  const {
    attendanceData,
    isLoading,
    employeesLoaded,
    toggleAttendance,
    handleTimeChange,
    handleOvertimeChange,
    handleNoteChange
  } = useAttendanceData(canEdit, dataRefreshTrigger);

  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const {
    isSubmitting,
    handleSave,
    confirmSave,
    handleUpdateAll,
    handleBulkUpdate,
    refreshData
  } = useAttendanceOperations(canEdit);

  const handleSuccessfulSave = () => {
    setDataRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!initialCheckDone && user && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
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
          
          // Only trigger a refresh if we actually have records or employees
          if ((count && count > 0) || (filteredEmployees.length > 0 && !employeesLoading)) {
            setDataRefreshTrigger(prev => prev + 1);
          }
        } catch (err) {
          console.error('Failed to fetch attendance count:', err);
        } finally {
          setRecordsLoading(false);
          setInitialCheckDone(true);
        }
      };

      fetchActualRecordCount();
    }
  }, [currentDate, filteredEmployees.length, user, initialCheckDone, employeesLoading, dataFetched]);

  // Update record count when date changes (without triggering a data refresh)
  useEffect(() => {
    if (initialCheckDone && user) {
      const updateRecordCount = async () => {
        try {
          const { count, error } = await supabase
            .from('attendance_records')
            .select('*', { count: 'exact', head: true })
            .eq('date', currentDate);
          
          if (!error) {
            setActualRecordCount(count || 0);
          }
        } catch (err) {
          console.error('Failed to update attendance count:', err);
        }
      };
      
      updateRecordCount();
    }
  }, [currentDate, initialCheckDone, user]);

  const handleRefresh = () => {
    setRecordsLoading(true);
    setDataRefreshTrigger(prev => prev + 1);
    
    // Update the record count when refreshing
    const updateRecordCount = async () => {
      try {
        const { count, error } = await supabase
          .from('attendance_records')
          .select('*', { count: 'exact', head: true })
          .eq('date', currentDate);
        
        if (!error) {
          setActualRecordCount(count || 0);
        }
      } catch (err) {
        console.error('Failed to update attendance count:', err);
      } finally {
        setRecordsLoading(false);
      }
    };
    
    updateRecordCount();
  };

  const combinedLoading = isLoading || recordsLoading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in pb-20">
      <NotificationContainer />

      <AttendanceHeader
        canEdit={canEdit}
        canViewAttendance={canViewAttendance}
        isSubmitting={isSubmitting}
        onUpdateAll={handleUpdateAll}
        onSave={handleSave}
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

      <AttendanceDialogs
        showBulkUpdate={showBulkUpdate}
        setShowBulkUpdate={setShowBulkUpdate}
        showSaveConfirm={showSaveConfirm}
        setShowSaveConfirm={setShowSaveConfirm}
        onBulkUpdateConfirm={handleBulkUpdate}
        onConfirmSave={() => {
          confirmSave(attendanceData);
          handleSuccessfulSave();
        }}
        attendanceData={attendanceData}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Attendance;
