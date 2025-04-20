
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
import { Calendar, FileSpreadsheet, FileText } from "lucide-react";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import { format } from "date-fns";

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
        return <Calendar size={16} />;
      case "weekly":
        return <FileSpreadsheet size={16} />;
      case "monthly":
        return <FileText size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {getReportTypeIcon()}
        <h3 className="text-lg font-medium capitalize">{view} Attendance Summary</h3>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Overtime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.present
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
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
                <TableCell colSpan={5} className="text-center py-4">
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default AttendanceSummaryTable;
