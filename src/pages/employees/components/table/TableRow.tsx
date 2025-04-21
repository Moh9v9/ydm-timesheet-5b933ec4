
import { Employee } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { Edit, Trash2 } from "lucide-react";

interface TableRowProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

export const TableRow = ({ employee, onEdit, onDelete }: TableRowProps) => {
  const { user } = useAuth();
  const canEdit = user?.permissions.employees.edit;
  const canDelete = user?.permissions.employees.delete;

  return (
    <tr>
      <td>{employee.fullName}</td>
      <td>{employee.iqamaNo || "-"}</td>
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
  );
};
