
import { Check, Minus } from "lucide-react";

interface AttendanceStatusMarkProps {
  attendanceCount: number;
}

const AttendanceStatusMark = ({ attendanceCount }: AttendanceStatusMarkProps) => {
  const hasAttendance = attendanceCount > 0;

  return (
    <div className="flex items-center gap-2 ml-2">
      {hasAttendance ? (
        <>
          <Check color="#22c55e" size={18} aria-label="Attendance exists" />
          <span className="text-green-500 dark:text-green-400 text-xs font-medium">
            Records exist for this date
          </span>
        </>
      ) : (
        <>
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-sm font-bold">
            <Minus size={12} />
          </span>
          <span className="text-gray-400 dark:text-gray-300 text-xs select-none">
            No records for this date
          </span>
        </>
      )}
    </div>
  );
};

export default AttendanceStatusMark;

