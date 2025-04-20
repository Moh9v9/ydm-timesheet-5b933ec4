
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  employee: Employee;
  onToggleAttendance: () => void;
  onTimeChange: (field: "startTime" | "endTime", value: string) => void;
  onOvertimeChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  canEdit: boolean;
}

const AttendanceTableRow = ({
  record,
  employee,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
  canEdit,
}: AttendanceTableRowProps) => {
  return (
    <tr className="border-b border-border/30 last:border-0">
      <td className="p-3">
        <div>
          <div className="font-medium">{employee.fullName}</div>
          <div className="text-xs text-muted-foreground">{employee.employeeId}</div>
        </div>
      </td>

      <td className="p-3">
        <div className="flex items-center">
          <div 
            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
              record.present 
                ? "bg-present" 
                : "bg-absent"
            }`}
            onClick={onToggleAttendance}
          >
            <div 
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                record.present ? "translate-x-6" : ""
              }`} 
            />
          </div>
          <span className="ml-2">
            {record.present ? "Present" : "Absent"}
          </span>
        </div>
      </td>

      <td className="p-3">
        {record.present ? (
          <input
            type="time"
            value={record.startTime}
            onChange={(e) => onTimeChange("startTime", e.target.value)}
            disabled={!canEdit || !record.present}
            className="p-1 border rounded-md w-28"
          />
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </td>

      <td className="p-3">
        {record.present ? (
          <input
            type="time"
            value={record.endTime}
            onChange={(e) => onTimeChange("endTime", e.target.value)}
            disabled={!canEdit || !record.present}
            className="p-1 border rounded-md w-28"
          />
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </td>

      <td className="p-3">
        {record.present ? (
          <input
            type="number"
            min="0"
            step="0.5"
            value={record.overtimeHours}
            onChange={(e) => onOvertimeChange(e.target.value)}
            disabled={!canEdit || !record.present}
            className="p-1 border rounded-md w-20"
          />
        ) : (
          <span className="text-muted-foreground">0</span>
        )}
      </td>

      <td className="p-3">
        <Textarea
          value={record.note || ""}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a note..."
          className="min-h-[60px] resize-none w-full"
          disabled={!canEdit}
        />
      </td>
    </tr>
  );
};

export default AttendanceTableRow;
