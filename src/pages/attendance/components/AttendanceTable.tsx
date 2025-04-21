import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import AttendanceTableRow from "./AttendanceTableRow";
import AttendanceTableEmptyState from "./AttendanceTableEmptyState";
import { useAttendanceTableSort, SortField } from "./useAttendanceTableSort";
import SortIcon from "./SortIcon";
import React, { useEffect, useMemo } from "react";
import { useAttendance } from "@/contexts/AttendanceContext";

interface AttendanceTableProps {
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

const AttendanceTable = ({
  attendanceData,
  filteredEmployees,
  canEdit,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
  isLoading = false,
  employeesLoaded = false,
}: AttendanceTableProps) => {
  const { currentDate } = useAttendance();

  // Create a map of existing attendance records by employee ID
  const attendanceByEmployeeId = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    attendanceData.forEach(record => {
      map.set(record.employeeId, record);
    });
    return map;
  }, [attendanceData]);

  // Generate combined data with records for every employee
  const combinedData = useMemo(() => {
    // For debugging
    const archivedEmployees = filteredEmployees.filter(emp => emp.status === "Archived");
    if (archivedEmployees.length > 0) {
      console.log(`Found ${archivedEmployees.length} archived employees to display:`, 
        archivedEmployees.map(e => ({id: e.id, name: e.fullName})));
    }

    // Map each employee to their attendance record
    return filteredEmployees.map((employee) => {
      // Check if we already have a record for this employee
      const existingRecord = attendanceByEmployeeId.get(employee.id);
      
      if (existingRecord) {
        return {
          record: existingRecord,
          originalIndex: attendanceData.findIndex(r => r.id === existingRecord.id),
          employee
        };
      } else {
        // If an archived employee has made it this far, it means they SHOULD have a record
        // (they were filtered in employeeMatchesFilters)
        // But if they don't, create a placeholder
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
          originalIndex: -1, // Indicates this is a placeholder
          employee
        };
      }
    });
  }, [filteredEmployees, attendanceData, attendanceByEmployeeId, currentDate]);

  const {
    sortField,
    sortDirection,
    handleSort,
    getSortedData,
  } = useAttendanceTableSort({ 
    // Pass the combined data to the sorting hook
    attendanceData: combinedData.map(item => item.record), 
    filteredEmployees
  });

  // Sort the combined data
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
    // Log the final sorted data that will be displayed
    console.log(`AttendanceTable will display ${sortedData.length} rows (${
      sortedData.filter(item => item.employee.status === "Archived").length
    } archived)`);
  }, [sortedData]);

  return (
    <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("employee")}
              >
                Employee <SortIcon field="employee" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon field="status" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("startTime")}
              >
                Start Time <SortIcon field="startTime" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("endTime")}
              >
                End Time <SortIcon field="endTime" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("overtimeHours")}
              >
                Overtime Hours <SortIcon field="overtimeHours" currentField={sortField} direction={sortDirection} />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("notes")}
              >
                Notes <SortIcon field="notes" currentField={sortField} direction={sortDirection} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map(({ record, originalIndex, employee }) => (
                <AttendanceTableRow
                  key={record.id}
                  record={record}
                  employee={employee}
                  onToggleAttendance={() => {
                    // Only toggle if this is an existing record
                    if (originalIndex >= 0) {
                      onToggleAttendance(originalIndex);
                    }
                  }}
                  onTimeChange={(field, value) => {
                    if (originalIndex >= 0) {
                      onTimeChange(originalIndex, field, value);
                    }
                  }}
                  onOvertimeChange={(value) => {
                    if (originalIndex >= 0) {
                      onOvertimeChange(originalIndex, value);
                    }
                  }}
                  onNoteChange={(value) => {
                    if (originalIndex >= 0) {
                      onNoteChange(originalIndex, value);
                    }
                  }}
                  canEdit={canEdit && originalIndex >= 0}
                />
              ))
            ) : (
              <AttendanceTableEmptyState
                isLoading={isLoading}
                employeesLoaded={employeesLoaded}
                filteredEmployeesLength={filteredEmployees.length}
                attendanceDataLength={attendanceData.length}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
