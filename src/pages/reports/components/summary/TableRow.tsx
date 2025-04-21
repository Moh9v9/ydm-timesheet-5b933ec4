
import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { AttendanceRecord } from "@/lib/types";

interface SummaryTableRowProps {
  record: AttendanceRecord;
  getEmployeeName: (employeeId: string) => string;
}

const SummaryTableRow = ({ record, getEmployeeName }: SummaryTableRowProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <TableRow className="dark:hover:bg-gray-750/50">
      <TableCell className="font-medium">{getEmployeeName(record.employeeId)}</TableCell>
      <TableCell>{formatDate(record.date)}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            record.present
              ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-300"
          }`}
        >
          {record.present ? "Present" : "Absent"}
        </span>
      </TableCell>
      <TableCell>
        {record.present ? `${record.startTime} - ${record.endTime}` : "N/A"}
      </TableCell>
      <TableCell>{record.present ? `${record.overtimeHours}h` : "N/A"}</TableCell>
    </TableRow>
  );
};

export default SummaryTableRow;
