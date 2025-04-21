
import React from "react";
import AttendanceTableRow from "../AttendanceTableRow";
import AttendanceTableEmptyState from "../AttendanceTableEmptyState";
import { AttendanceRecord, Employee } from "@/lib/types";

interface AttendanceTableBodyProps {
  sortedData: {
    record: AttendanceRecord;
    originalIndex: number;
    employee: Employee;
  }[];
  onToggleAttendance: (index: number) => void;
  onTimeChange: (index: number, field: "startTime" | "endTime", value: string) => void;
  onOvertimeChange: (index: number, value: string) => void;
  onNoteChange: (index: number, value: string) => void;
  canEdit: boolean;
  isLoading: boolean;
  employeesLoaded: boolean;
  filteredEmployees: Employee[];
  attendanceData: AttendanceRecord[];
}

const AttendanceTableBody: React.FC<AttendanceTableBodyProps> = ({
  sortedData,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
  canEdit,
  isLoading,
  employeesLoaded,
  filteredEmployees,
  attendanceData,
}) => {
  if (sortedData.length > 0) {
    return (
      <>
        {sortedData.map(({ record, originalIndex, employee }) => (
          <AttendanceTableRow
            key={record.id}
            record={record}
            employee={employee}
            onToggleAttendance={() => {
              if (originalIndex >= 0) onToggleAttendance(originalIndex);
            }}
            onTimeChange={(field, value) => {
              if (originalIndex >= 0) onTimeChange(originalIndex, field, value);
            }}
            onOvertimeChange={value => {
              if (originalIndex >= 0) onOvertimeChange(originalIndex, value);
            }}
            onNoteChange={value => {
              if (originalIndex >= 0) onNoteChange(originalIndex, value);
            }}
            canEdit={canEdit && originalIndex >= 0}
          />
        ))}
      </>
    );
  }
  return (
    <AttendanceTableEmptyState
      isLoading={isLoading}
      employeesLoaded={employeesLoaded}
      filteredEmployeesLength={filteredEmployees.length}
      attendanceDataLength={attendanceData.length}
    />
  );
};

export default AttendanceTableBody;
