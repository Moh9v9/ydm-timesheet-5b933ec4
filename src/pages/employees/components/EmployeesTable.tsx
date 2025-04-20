
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

type SortField = "fullName" | "iqamaNo" | "project" | "location" | "jobTitle" | "paymentType" | "rateOfPayment" | "sponsorship" | "status";
type SortDirection = "asc" | "desc";

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
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedData = () => {
    // Create a new array with original indices to track position
    const indexedData = employees.map((employee, index) => ({
      employee,
      originalIndex: index
    }));
    
    indexedData.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      
      switch (sortField) {
        case "fullName":
          return direction * (a.employee.fullName || "").localeCompare(b.employee.fullName || "");
        case "iqamaNo":
          return direction * ((a.employee.iqamaNo || 0) - (b.employee.iqamaNo || 0));
        case "project":
          return direction * (a.employee.project || "").localeCompare(b.employee.project || "");
        case "location":
          return direction * (a.employee.location || "").localeCompare(b.employee.location || "");
        case "jobTitle":
          return direction * (a.employee.jobTitle || "").localeCompare(b.employee.jobTitle || "");
        case "paymentType":
          return direction * (a.employee.paymentType || "").localeCompare(b.employee.paymentType || "");
        case "rateOfPayment":
          return direction * (Number(a.employee.rateOfPayment || 0) - Number(b.employee.rateOfPayment || 0));
        case "sponsorship":
          return direction * (a.employee.sponsorship || "").localeCompare(b.employee.sponsorship || "");
        case "status":
          return direction * (a.employee.status || "").localeCompare(b.employee.status || "");
        default:
          return 0;
      }
    });

    return indexedData;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowDown className="inline-block ml-1 h-4 w-4" />
    ) : (
      <ArrowUp className="inline-block ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("fullName")} className="cursor-pointer hover:bg-muted/30">
              Full Name <SortIcon field="fullName" />
            </th>
            <th onClick={() => handleSort("iqamaNo")} className="cursor-pointer hover:bg-muted/30">
              Iqama No <SortIcon field="iqamaNo" />
            </th>
            <th onClick={() => handleSort("project")} className="cursor-pointer hover:bg-muted/30">
              Project <SortIcon field="project" />
            </th>
            <th onClick={() => handleSort("location")} className="cursor-pointer hover:bg-muted/30">
              Location <SortIcon field="location" />
            </th>
            <th onClick={() => handleSort("jobTitle")} className="cursor-pointer hover:bg-muted/30">
              Job Title <SortIcon field="jobTitle" />
            </th>
            <th onClick={() => handleSort("paymentType")} className="cursor-pointer hover:bg-muted/30">
              Payment Type <SortIcon field="paymentType" />
            </th>
            <th onClick={() => handleSort("rateOfPayment")} className="cursor-pointer hover:bg-muted/30">
              Rate <SortIcon field="rateOfPayment" />
            </th>
            <th onClick={() => handleSort("sponsorship")} className="cursor-pointer hover:bg-muted/30">
              Sponsorship <SortIcon field="sponsorship" />
            </th>
            <th onClick={() => handleSort("status")} className="cursor-pointer hover:bg-muted/30">
              Status <SortIcon field="status" />
            </th>
            {(canEdit || canDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            getSortedData().map(({ employee }) => (
              <tr key={employee.id}>
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
