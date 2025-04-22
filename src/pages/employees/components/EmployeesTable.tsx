
import { Employee } from "@/lib/types";
import { useTableSort } from "../hooks/useTableSort";
import { TableHeader } from "./table/TableHeader";
import { TableRow } from "./table/TableRow";
import {
  Table,
  TableBody,
} from "@/components/ui/table";

interface EmployeesTableProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const EmployeesTable = ({ 
  employees, 
  loading,
  onEdit,
  onDelete 
}: EmployeesTableProps) => {
  const { sortField, sortDirection, handleSort, getSortedData } = useTableSort();

  return (
    <div className="data-table-container">
      <Table className="data-table">
        <TableHeader 
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        <TableBody>
          {!loading && employees.length > 0 ? (
            getSortedData(employees).map(({ employee, originalIndex }) => (
              <TableRow
                key={`${employee.id}-${originalIndex}`}
                employee={employee}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr className="border-b dark:border-gray-700">
              <td colSpan={10} className="text-center py-6">
                {loading ? (
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">Loading employees...</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    <p>No employees found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or adding new employees</p>
                  </div>
                )}
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
