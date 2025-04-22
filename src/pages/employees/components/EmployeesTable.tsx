
import { Employee } from "@/lib/types";
import { useTableSort } from "../hooks/useTableSort";
import { TableHeader } from "./table/TableHeader";
import { TableRow } from "./table/TableRow";

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
      <table className="data-table">
        <TableHeader 
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        <tbody>
          {employees.length > 0 ? (
            getSortedData(employees).map(({ employee, index }) => (
              <TableRow
                key={employee.id}
                employee={employee}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-4">
                {loading ? "Loading..." : "No employees found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
