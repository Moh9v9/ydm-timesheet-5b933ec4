
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { useAttendance } from "@/contexts/AttendanceContext";
import { useEmployees } from "@/contexts/EmployeeContext";
import SummaryTableHeader from "./summary/TableHeader";
import SummaryTableRow from "./summary/TableRow";
import TablePagination from "./summary/TablePagination";
import HeaderSection from "./summary/TableHeader/HeaderSection";

interface AttendanceSummaryTableProps {
  view: "daily" | "weekly" | "monthly";
  currentDate: string;
}

const AttendanceSummaryTable = ({ view, currentDate }: AttendanceSummaryTableProps) => {
  const { filteredEmployees } = useEmployees();
  const { attendanceRecords } = useAttendance();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
  
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getEmployeeName = (employeeId: string) => {
    const employee = filteredEmployees.find((emp) => emp.id === employeeId);
    return employee ? employee.fullName : "Unknown Employee";
  };

  return (
    <div>
      <HeaderSection view={view} />
      
      <div>
        <Table>
          <SummaryTableHeader />
          <TableBody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <SummaryTableRow
                  key={record.id}
                  record={record}
                  getEmployeeName={getEmployeeName}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No attendance records found for this period
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AttendanceSummaryTable;
