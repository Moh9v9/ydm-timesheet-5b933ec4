
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
  
  // Process the sorted employees data
  const sortedEmployees = loading ? [] : getSortedData(employees);

  return (
    <div className="data-table-container">
      <table className="data-table">
        <TableHeader 
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={10} className="text-center py-6">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span>Loading employees...</span>
                </div>
              </td>
            </tr>
          ) : employees.length > 0 ? (
            sortedEmployees.map(item => (
              <TableRow
                key={item.employee.id}
                employee={item.employee}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-4">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
