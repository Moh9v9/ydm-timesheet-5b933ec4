
import { useAuth } from "@/contexts/AuthContext";
import { Employee } from "@/lib/types";
import { Edit, Trash2 } from "lucide-react";

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
  const { user } = useAuth();
  const canEdit = user?.permissions.edit;
  const canDelete = user?.permissions.delete;

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>ID</th>
            <th>Project</th>
            <th>Location</th>
            <th>Job Title</th>
            <th>Payment Type</th>
            <th>Rate</th>
            <th>Sponsorship</th>
            <th>Status</th>
            {(canEdit || canDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
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
