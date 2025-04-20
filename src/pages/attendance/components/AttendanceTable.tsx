
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import AttendanceTableRow from "./AttendanceTableRow";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { useState } from "react";

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  filteredEmployees: Employee[];
  canEdit: boolean;
  onToggleAttendance: (index: number) => void;
  onTimeChange: (index: number, field: "startTime" | "endTime", value: string) => void;
  onOvertimeChange: (index: number, value: string) => void;
  onNoteChange: (index: number, value: string) => void;
  isLoading?: boolean;
}

type SortField = "name" | "status" | "startTime" | "endTime" | "overtime" | "notes";
type SortOrder = "asc" | "desc";

const AttendanceTable = ({
  attendanceData,
  filteredEmployees,
  canEdit,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
  isLoading = false,
}: AttendanceTableProps) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    return [...attendanceData].sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      
      switch (sortField) {
        case "name":
          const employeeA = filteredEmployees.find(emp => emp.id === a.employeeId);
          const employeeB = filteredEmployees.find(emp => emp.id === b.employeeId);
          return multiplier * (employeeA?.fullName.localeCompare(employeeB?.fullName || "") || 0);
        case "status":
          return multiplier * (Number(a.present) - Number(b.present));
        case "startTime":
          return multiplier * (a.startTime.localeCompare(b.startTime));
        case "endTime":
          return multiplier * (a.endTime.localeCompare(b.endTime));
        case "overtime":
          return multiplier * (a.overtimeHours - b.overtimeHours);
        case "notes":
          return multiplier * ((a.note || "").localeCompare(b.note || ""));
        default:
          return 0;
      }
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    // Show the opposite icon of the current sort direction
    return sortOrder === "asc" ? 
      <ArrowDownAZ className="inline-block ml-1 w-4 h-4" /> : 
      <ArrowUpAZ className="inline-block ml-1 w-4 h-4" />;
  };

  return (
    <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("name")}
              >
                Employee {renderSortIcon("name")}
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("status")}
              >
                Status {renderSortIcon("status")}
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("startTime")}
              >
                Start Time {renderSortIcon("startTime")}
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("endTime")}
              >
                End Time {renderSortIcon("endTime")}
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("overtime")}
              >
                Overtime Hours {renderSortIcon("overtime")}
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
                onClick={() => handleSort("notes")}
              >
                Notes {renderSortIcon("notes")}
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
            ) : getSortedData().length > 0 ? (
              getSortedData().map((record, index) => {
                const employee = filteredEmployees.find(
                  emp => emp.id === record.employeeId
                );

                if (!employee) return null;

                return (
                  <AttendanceTableRow
                    key={record.id}
                    record={record}
                    employee={employee}
                    onToggleAttendance={() => onToggleAttendance(index)}
                    onTimeChange={(field, value) => onTimeChange(index, field, value)}
                    onOvertimeChange={(value) => onOvertimeChange(index, value)}
                    onNoteChange={(value) => onNoteChange(index, value)}
                    canEdit={canEdit}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No employees found for attendance tracking
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
