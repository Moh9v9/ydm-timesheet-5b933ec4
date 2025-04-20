
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Download, Calendar, FileSpreadsheet, FileText, check, x as XIcon } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { format } from "date-fns";

// Import lucide icons as components
import { Check, X } from "lucide-react";

interface AttendanceSummaryTableProps {
  view: "daily" | "weekly" | "monthly";
  currentDate: string;
}

const AttendanceSummaryTable = ({ view, currentDate }: AttendanceSummaryTableProps) => {
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter attendance records based on the view and current date
  const getFilteredRecords = () => {
    return attendanceRecords.filter((record) => {
      if (view === "daily") {
        return record.date === currentDate;
      }
      // For weekly and monthly views, additional filtering would be added here
      return true;
    });
  };

  const filteredRecords = getFilteredRecords();
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  // Get the records for the current page
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getEmployeeName = (employeeId: string) => {
    const employee = filteredEmployees.find((emp) => emp.id === employeeId);
    return employee ? employee.fullName : "Unknown Employee";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getReportTypeIcon = () => {
    switch (view) {
      case "daily":
        return <Calendar size={16} className="text-blue-500" />;
      case "weekly":
        return <FileSpreadsheet size={16} className="text-green-500" />;
      case "monthly":
        return <FileText size={16} className="text-purple-500" />;
      default:
        return <Calendar size={16} className="text-blue-500" />;
    }
  };

  // Determine if there is an attendance record for the selected date (for daily view only)
  const hasAttendanceForDate = view === "daily" && attendanceRecords.some(record => record.date === currentDate);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          {getReportTypeIcon()}
          <h3 className="text-sm font-medium capitalize flex items-center">
            {view} Summary
            {view === "daily" && (
              <span className="ml-3 flex items-center gap-1">
                {hasAttendanceForDate 
                  ? <Check size={16} className="text-green-600" title="Attendance exists" /> 
                  : <X size={16} className="text-red-500" title="No attendance record" />
                }
                <span className="text-xs text-muted-foreground">
                  {formatDate(currentDate)}
                </span>
              </span>
            )}
          </h3>
        </div>
        <button className="text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Download size={16} />
        </button>
      </div>
      
      <div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
              <TableHead className="font-medium">Employee</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Hours</TableHead>
              <TableHead className="font-medium">Overtime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <TableRow key={record.id} className="dark:hover:bg-gray-750/50">
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
                    {record.present
                      ? `${record.startTime} - ${record.endTime}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {record.present ? `${record.overtimeHours}h` : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No attendance records found for this period
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="py-4 border-t dark:border-gray-700">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AttendanceSummaryTable;
