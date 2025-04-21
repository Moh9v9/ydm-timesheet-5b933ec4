
import { AlertCircle } from "lucide-react";
import React from "react";

interface AttendanceTableEmptyStateProps {
  isLoading: boolean;
  employeesLoaded: boolean;
  filteredEmployeesLength: number;
  attendanceDataLength: number;
}

const AttendanceTableEmptyState = ({
  isLoading,
  employeesLoaded,
  filteredEmployeesLength,
  attendanceDataLength,
}: AttendanceTableEmptyStateProps) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-6">
          <div className="flex justify-center items-center">
            <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary rounded-full"></div>
            Loading attendance records...
          </div>
        </td>
      </tr>
    );
  }

  if (!employeesLoaded) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-6">
          <div className="flex justify-center items-center">
            <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary rounded-full"></div>
            Loading employee data...
          </div>
        </td>
      </tr>
    );
  }

  if (filteredEmployeesLength === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <AlertCircle size={24} className="text-amber-500" />
            <div className="text-muted-foreground font-medium">No employees found</div>
            <div className="text-sm text-center max-w-md">
              You need to add employees first before you can manage attendance. 
              Please navigate to the Employees section and add some employees.
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (attendanceDataLength === 0) {
    return (
      <tr>
        <td colSpan={6} className="text-center py-4">
          <div className="text-muted-foreground">
            No attendance records found for this date
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={6} className="text-center py-4">
        No matching employees found with current filters
      </td>
    </tr>
  );
};

export default AttendanceTableEmptyState;
