
import { useAuth } from "@/contexts/AuthContext";
import { SortField, SortDirection } from "../types/table-types";
import { SortIcon } from "./SortIcon";

interface TableHeaderProps {
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const TableHeader = ({ onSort, sortField, sortDirection }: TableHeaderProps) => {
  const { user } = useAuth();
  const canEdit = user?.permissions.employees.edit;
  const canDelete = user?.permissions.employees.delete;

  return (
    <thead>
      <tr>
        <th onClick={() => onSort("fullName")} className="cursor-pointer hover:bg-muted/30">
          Full Name <SortIcon field="fullName" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("iqamaNo")} className="cursor-pointer hover:bg-muted/30">
          Iqama No <SortIcon field="iqamaNo" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("project")} className="cursor-pointer hover:bg-muted/30">
          Project <SortIcon field="project" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("location")} className="cursor-pointer hover:bg-muted/30">
          Location <SortIcon field="location" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("jobTitle")} className="cursor-pointer hover:bg-muted/30">
          Job Title <SortIcon field="jobTitle" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("paymentType")} className="cursor-pointer hover:bg-muted/30">
          Payment Type <SortIcon field="paymentType" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("rateOfPayment")} className="cursor-pointer hover:bg-muted/30">
          Rate <SortIcon field="rateOfPayment" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("sponsorship")} className="cursor-pointer hover:bg-muted/30">
          Sponsorship <SortIcon field="sponsorship" currentField={sortField} direction={sortDirection} />
        </th>
        <th onClick={() => onSort("status")} className="cursor-pointer hover:bg-muted/30">
          Status <SortIcon field="status" currentField={sortField} direction={sortDirection} />
        </th>
        {(canEdit || canDelete) && <th>Actions</th>}
      </tr>
    </thead>
  );
};
