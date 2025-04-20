
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import AttendanceTableRow from "./AttendanceTableRow";

interface AttendanceTableProps {
  attendanceData: AttendanceRecord[];
  filteredEmployees: Employee[];
  canEdit: boolean;
  onToggleAttendance: (index: number) => void;
  onTimeChange: (index: number, field: "startTime" | "endTime", value: string) => void;
  onOvertimeChange: (index: number, value: string) => void;
  onNoteChange: (index: number, value: string) => void;
}

const AttendanceTable = ({
  attendanceData,
  filteredEmployees,
  canEdit,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
}: AttendanceTableProps) => {
  return (
    <div className="bg-card shadow-sm rounded-lg border overflow-hidden">
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Status</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Overtime Hours</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((record, index) => {
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
