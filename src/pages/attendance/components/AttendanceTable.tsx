
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import AttendanceTableRow from "./AttendanceTableRow";
import AttendanceTableEmptyState from "./AttendanceTableEmptyState";
import { useAttendanceTableSort, SortField } from "./useAttendanceTableSort";
import SortIcon from "./SortIcon";
import React, { useEffect } from "react";

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
  const {
    sortField,
    sortDirection,
    handleSort,
    getSortedData,
  } = useAttendanceTableSort({ attendanceData, filteredEmployees });

  const hasData = attendanceData.length > 0 && filteredEmployees.length > 0;
  const sortedData = getSortedData();

  // Log employee IDs to help debug which employees are available
  useEffect(() => {
    // Debug log to trace employee IDs and check if archived employees are included
    const employeeIds = filteredEmployees.map(e => e.id);
    console.log("Filtered employees IDs:", employeeIds);
    console.log("Looking for archived employees with IDs: 1fdd63f7-a399-4341-8c16-d72b0ab3ca8f and 07ea4c39-8033-439c-89e9-2361833e906d");
    
    // Check if specific archived employees are in the filtered list
    const hasFirstArchivedEmployee = employeeIds.includes("1fdd63f7-a399-4341-8c16-d72b0ab3ca8f");
    const hasSecondArchivedEmployee = employeeIds.includes("07ea4c39-8033-439c-89e9-2361833e906d");
    
    console.log("First archived employee in list:", hasFirstArchivedEmployee);
    console.log("Second archived employee in list:", hasSecondArchivedEmployee);
    
    // Log attendance records for these employees
    const firstEmployeeAttendance = attendanceData.filter(record => record.employeeId === "1fdd63f7-a399-4341-8c16-d72b0ab3ca8f");
    const secondEmployeeAttendance = attendanceData.filter(record => record.employeeId === "07ea4c39-8033-439c-89e9-2361833e906d");
    
    console.log("First archived employee attendance records:", firstEmployeeAttendance);
    console.log("Second archived employee attendance records:", secondEmployeeAttendance);
  }, [filteredEmployees, attendanceData]);

  // Debug log just in case
  console.log("🔍 AttendanceTable render - Loading:", isLoading, 
    "Employees Loaded:", employeesLoaded, 
    "Filtered Employees:", filteredEmployees.length,
    "Attendance Data:", attendanceData.length);

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
            {hasData && sortedData.some(({ record }) => filteredEmployees.find(emp => emp.id === record.employeeId)) ? (
              sortedData.map(({ record, originalIndex }) => {
                const employee = filteredEmployees.find(
                  emp => emp.id === record.employeeId
                );

                if (!employee) {
                  console.log(`No employee found for record with employeeId: ${record.employeeId}`);
                  return null;
                }

                return (
                  <AttendanceTableRow
                    key={record.id}
                    record={record}
                    employee={employee}
                    onToggleAttendance={() => onToggleAttendance(originalIndex)}
                    onTimeChange={(field, value) => onTimeChange(originalIndex, field, value)}
                    onOvertimeChange={(value) => onOvertimeChange(originalIndex, value)}
                    onNoteChange={(value) => onNoteChange(originalIndex, value)}
                    canEdit={canEdit}
                  />
                );
              })
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
