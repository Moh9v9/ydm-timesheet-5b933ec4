
import { AttendanceRecord } from "@/lib/types";
import { Employee } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Archive } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

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
  // Common input tailwind classes for better visibility in dark mode
  const inputClass =
    "p-1 border rounded-md w-28 bg-background text-foreground placeholder:text-muted-foreground " +
    "dark:bg-gray-800 dark:border-gray-500 dark:text-white dark:placeholder-gray-400 dark:focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const numberInputClass =
    "p-1 border rounded-md w-20 bg-background text-foreground placeholder:text-muted-foreground " +
    "dark:bg-gray-800 dark:border-gray-500 dark:text-white dark:placeholder-gray-400 dark:focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const isArchived = employee.status === "Archived";

  // Add debugging for archived employees
  if (isArchived) {
    console.log(`Rendering archived employee row: ${employee.fullName} (${employee.id})`);
  }

  return (
    <TooltipProvider>
      <tr
        className={`
          border-b border-border/30 last:border-0 transition-colors
          ${isArchived ? "bg-gray-50 dark:bg-gray-800/30 border-l-4 border-l-gray-400" : ""}
        `}
      >
        <td className="p-3 flex items-center gap-2">
          {isArchived && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Archive
                  size={18}
                  className="text-gray-500 shrink-0 mr-1"
                  aria-label="Archived employee"
                />
              </TooltipTrigger>
              <TooltipContent>
                <span>This is an archived employee.</span>
              </TooltipContent>
            </Tooltip>
          )}
          <div>
            <div className={`font-medium ${isArchived ? "text-gray-500" : ""}`}>{employee.fullName}</div>
            <div className="text-xs text-muted-foreground">{employee.iqamaNo || "No Iqama"}</div>
          </div>
        </td>

        <td className="p-3">
          <div className="flex items-center">
            <div 
              className={`relative w-12 h-6 rounded-full ${!canEdit ? "opacity-60" : "cursor-pointer"} transition-colors ${
                record.present 
                  ? "bg-present" 
                  : "bg-absent"
              }`}
              onClick={canEdit ? onToggleAttendance : undefined}
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
              className={inputClass}
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
              className={inputClass}
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
              className={numberInputClass}
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
            className="min-h-[80px] w-full max-w-[400px] resize-both dark:bg-gray-800 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
            disabled={!canEdit}
          />
        </td>
      </tr>
    </TooltipProvider>
  );
};

export default AttendanceTableRow;
