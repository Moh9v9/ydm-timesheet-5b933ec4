
import React from "react";
import SortIcon from "../SortIcon";
import { SortField, SortDirection } from "../useAttendanceTableSort";

interface AttendanceTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
}

const headerFields: { label: string; field: SortField }[] = [
  { label: "Employee", field: "employee" },
  { label: "Status", field: "status" },
  { label: "Start Time", field: "startTime" },
  { label: "End Time", field: "endTime" },
  { label: "Overtime Hours", field: "overtimeHours" },
  { label: "Notes", field: "notes" }
];

const AttendanceTableHeader: React.FC<AttendanceTableHeaderProps> = ({
  sortField,
  sortDirection,
  handleSort
}) => (
  <thead className="bg-muted/20">
    <tr>
      {headerFields.map(h => (
        <th
          key={h.field}
          className="text-left p-3 font-medium cursor-pointer hover:bg-muted/30"
          onClick={() => handleSort(h.field)}
        >
          {h.label}
          <SortIcon field={h.field} currentField={sortField} direction={sortDirection} />
        </th>
      ))}
    </tr>
  </thead>
);

export default AttendanceTableHeader;
