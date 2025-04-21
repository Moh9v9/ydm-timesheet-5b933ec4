
import { useState } from "react";
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import AttendanceTableRow from "./AttendanceTableRow";
import { ArrowDown, ArrowUp } from "lucide-react";

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

type SortField = "employee" | "status" | "startTime" | "endTime" | "overtimeHours" | "notes";
type SortDirection = "asc" | "desc";

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
  const [sortField, setSortField] = useState<SortField>("employee");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    // Create a new array with original indices to track position
    const indexedData = attendanceData.map((record, index) => ({
      record,
      originalIndex: index
    }));
    
    indexedData.sort((a, b) => {
      const employeeA = filteredEmployees.find(emp => emp.id === a.record.employeeId);
      const employeeB = filteredEmployees.find(emp => emp.id === b.record.employeeId);
      
      if (!employeeA || !employeeB) return 0;

      const direction = sortDirection === "asc" ? 1 : -1;
      
      switch (sortField) {
        case "employee":
          return direction * employeeA.fullName.localeCompare(employeeB.fullName);
        case "status":
          return direction * (Number(a.record.present) - Number(b.record.present));
        case "startTime":
          return direction * (a.record.startTime || "").localeCompare(b.record.startTime || "");
        case "endTime":
          return direction * (a.record.endTime || "").localeCompare(b.record.endTime || "");
        case "overtimeHours":
          return direction * ((a.record.overtimeHours || 0) - (b.record.overtimeHours || 0));
        case "notes":
          return direction * (a.record.note || "").localeCompare(b.record.note || "");
        default:
          return 0;
      }
    });

    return indexedData;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowDown className="inline-block ml-1 h-4 w-4" />
    ) : (
      <ArrowUp className="inline-block ml-1 h-4 w-4" />
    );
  };

  // Check if we have both attendance data AND employee data
  const hasData = attendanceData.length > 0 && filteredEmployees.length > 0;

  console.log("AttendanceTable render - Loading:", isLoading, "Employees Loaded:", employeesLoaded, "Filtered Employees:", filteredEmployees.length);

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
                Employee <SortIcon field="employee" />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon field="status" />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("startTime")}
              >
                Start Time <SortIcon field="startTime" />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("endTime")}
              >
                End Time <SortIcon field="endTime" />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("overtimeHours")}
              >
                Overtime Hours <SortIcon field="overtimeHours" />
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("notes")}
              >
                Notes <SortIcon field="notes" />
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary rounded-full"></div>
                    Loading attendance records...
                  </div>
                </td>
              </tr>
            ) : !employeesLoaded ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-primary rounded-full"></div>
                    Loading employee data...
                  </div>
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="text-muted-foreground">
                    No employees found. Please add employees in the Employees section.
                  </div>
                </td>
              </tr>
            ) : hasData && getSortedData().some(({ record }) => filteredEmployees.find(emp => emp.id === record.employeeId)) ? (
              getSortedData().map(({ record, originalIndex }) => {
                const employee = filteredEmployees.find(
                  emp => emp.id === record.employeeId
                );

                if (!employee) return null;

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
            ) : attendanceData.length > 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No matching employees found with current filters
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No attendance records found for this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
