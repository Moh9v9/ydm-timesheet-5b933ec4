
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { check, x } from "lucide-react";

interface AttendanceTableRowProps {
  record: AttendanceRecord;
  employee: Employee;
  onToggleAttendance: () => void;
  onTimeChange: (field: "startTime" | "endTime", value: string) => void;
  onOvertimeChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  canEdit: boolean;
  attendanceExists?: boolean;
}

const AttendanceTableRow = ({
  record,
  employee,
  onToggleAttendance,
  onTimeChange,
  onOvertimeChange,
  onNoteChange,
  canEdit,
  attendanceExists,
}: AttendanceTableRowProps) => {
  // For the icon, present green check if attendance exists, red x if not
  const Icon = attendanceExists ? check : x;
  const iconColor = attendanceExists ? "#16a34a" : "#ea384c"; // green or red

  return (
    <tr className="border-b border-border/30 last:border-0">
      <td className="p-3">
        <div className="flex items-center gap-2">
          {/* Attendance indicator */}
          <Icon size={18} color={iconColor} aria-label={attendanceExists ? "Attendance Recorded" : "No Attendance"} />
          <div>
            <div className="font-medium">{employee.fullName}</div>
            <div className="text-xs text-muted-foreground">{employee.iqamaNo || "No Iqama"}</div>
          </div>
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

      <td className="p-3 min-w-[300px]">
        <Textarea
          value={record.note || ""}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a note..."
          className="min-h-[80px] w-full max-w-[400px] resize-both"
          disabled={!canEdit}
        />
      </td>
    </tr>
  );
};

export default AttendanceTableRow;

