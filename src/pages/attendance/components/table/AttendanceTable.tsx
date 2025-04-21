
import React, { useEffect, useMemo } from "react";
import { AttendanceRecord, Employee } from "@/lib/types";
import { useAttendanceTableSort } from "../useAttendanceTableSort";
import { useAttendance } from "@/contexts/AttendanceContext";
import AttendanceTableHeader from "./AttendanceTableHeader";
import AttendanceTableBody from "./AttendanceTableBody";

interface Props {
  attendanceData: AttendanceRecord[];
  filteredEmployees: Employee[];
  canEdit: boolean;
  onToggleAttendance: (index: number) => void;
  onTimeChange: (index: number, field: "startTime" | "endTime", value: string) => void;
  onOvertimeChange: (index: number, value: string) => void;
  onNoteChange: (index: number, value: string) => void;
  isLoading?: boolean;
  employeesLoaded?: boolean;
}

const AttendanceTable: React.FC<Props> = ({
  attendanceData,
  filteredEmployees,
  canEdit,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
  isLoading = false,
  employeesLoaded = false,
}) => {
  const { currentDate } = useAttendance();

  const attendanceByEmployeeId = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceData.forEach(record => {
      map.set(record.employeeId, record);
    });
    return map;
  }, [attendanceData]);

  const combinedData = useMemo(() => {
    const archivedEmployees = filteredEmployees.filter(emp => emp.status === "Archived");
    if (archivedEmployees.length > 0) {
      console.log(`Found ${archivedEmployees.length} archived employees to display:`, 
        archivedEmployees.map(e => ({id: e.id, name: e.fullName})));
    }

    return filteredEmployees.map((employee) => {
      const existingRecord = attendanceByEmployeeId.get(employee.id);
      if (existingRecord) {
        return {
          record: existingRecord,
          originalIndex: attendanceData.findIndex(r => r.id === existingRecord.id),
          employee
        };
      } else {
        console.log(`Creating placeholder record for ${employee.fullName} (${employee.id}), status: ${employee.status}`);
        return {
          record: {
            id: `temp-${employee.id}`,
            employeeId: employee.id,
            employeeName: employee.fullName,
            date: currentDate,
            present: false,
            startTime: "",
            endTime: "",
            overtimeHours: 0,
            note: ""
          },
          originalIndex: -1,
          employee
        };
      }
    });
  }, [filteredEmployees, attendanceData, attendanceByEmployeeId, currentDate]);

  const {
    sortField,
    sortDirection,
    handleSort,
  } = useAttendanceTableSort({ 
    attendanceData: combinedData.map(item => item.record), 
    filteredEmployees
  });

  const sortedData = useMemo(() => {
    return [...combinedData].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      switch (sortField) {
        case "employee":
          return direction * (a.employee.fullName.localeCompare(b.employee.fullName));
        case "status":
          return direction * (a.record.present === b.record.present ? 0 : a.record.present ? 1 : -1);
        case "startTime":
          return direction * (a.record.startTime.localeCompare(b.record.startTime));
        case "endTime":
          return direction * (a.record.endTime.localeCompare(b.record.endTime));
        case "overtimeHours":
          return direction * (a.record.overtimeHours - b.record.overtimeHours);
        case "notes":
          return direction * ((a.record.note || "").localeCompare(b.record.note || ""));
        default:
          return 0;
      }
    });
  }, [combinedData, sortField, sortDirection]);

  useEffect(() => {
    console.log(`AttendanceTable will display ${sortedData.length} rows (${
      sortedData.filter(item => item.employee.status === "Archived").length
    } archived)`);
  }, [sortedData]);

  return (
    <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <AttendanceTableHeader
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
          <tbody>
            <AttendanceTableBody
              sortedData={sortedData}
              onToggleAttendance={onToggleAttendance}
              onTimeChange={onTimeChange}
              onOvertimeChange={onOvertimeChange}
              onNoteChange={onNoteChange}
              canEdit={canEdit}
              isLoading={isLoading}
              employeesLoaded={employeesLoaded}
              filteredEmployees={filteredEmployees}
              attendanceData={attendanceData}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
