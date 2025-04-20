import { useAuth } from "@/contexts/AuthContext";
import { Employee } from "@/lib/types";
import { Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

interface EmployeesTableProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

type SortField = keyof Omit<Employee, "id">;
type SortOrder = "asc" | "desc";

export const EmployeesTable = ({ 
  employees, 
  loading,
  onEdit,
  onDelete 
}: EmployeesTableProps) => {
  const { user } = useAuth();
  const canEdit = user?.permissions.employees.edit;
  const canDelete = user?.permissions.employees.delete;

  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If the same column is clicked, toggle the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If a new column is clicked, set the sort field and default to descending
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getSortedEmployees = () => {
    return [...employees].sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === "number" && typeof valueB === "number") {
        return multiplier * (valueA - valueB);
      }
      
      return multiplier * String(valueA).localeCompare(String(valueB));
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? 
      <ArrowUp className="inline-block ml-1 w-4 h-4" /> : 
      <ArrowDown className="inline-block ml-1 w-4 h-4" />;
  };

  const renderSortableHeader = (field: SortField, label: string) => (
    <th 
      onClick={() => handleSort(field)}
      className="px-4 py-2 text-left font-medium cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <span className="flex items-center gap-1">
        {label}
        {renderSortIcon(field)}
      </span>
    </th>
  );

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {renderSortableHeader("fullName", "Full Name")}
            {renderSortableHeader("employeeId", "ID")}
            {renderSortableHeader("project", "Project")}
            {renderSortableHeader("location", "Location")}
            {renderSortableHeader("jobTitle", "Job Title")}
            {renderSortableHeader("paymentType", "Payment Type")}
            {renderSortableHeader("rateOfPayment", "Rate")}
            {renderSortableHeader("sponsorship", "Sponsorship")}
            {renderSortableHeader("status", "Status")}
            {(canEdit || canDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            getSortedEmployees().map((employee) => (
              <tr key={employee.id}>
                <td>{employee.fullName}</td>
                <td>{employee.employeeId}</td>
                <td>{employee.project}</td>
                <td>{employee.location}</td>
                <td>{employee.jobTitle}</td>
                <td>{employee.paymentType}</td>
                <td>{employee.rateOfPayment}</td>
                <td>{employee.sponsorship}</td>
                <td>
                  <span className={employee.status === "Active" ? "status-active" : "status-archived"}>
                    {employee.status}
                  </span>
                </td>
                {(canEdit || canDelete) && (
                  <td className="flex items-center space-x-2">
                    {canEdit && (
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(employee.id)}
                        className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={canEdit || canDelete ? 10 : 9} className="text-center py-4">
                {loading ? "Loading..." : "No employees found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
