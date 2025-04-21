
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";
import { SortField, SortDirection } from "./useAttendanceTableSort";

interface SortIconProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}

const SortIcon = ({
  field,
  currentField,
  direction,
}: SortIconProps) => {
  if (currentField !== field) return null;
  return direction === "asc" ? (
    <ArrowDown className="inline-block ml-1 h-4 w-4" />
  ) : (
    <ArrowUp className="inline-block ml-1 h-4 w-4" />
  );
};

export default SortIcon;
