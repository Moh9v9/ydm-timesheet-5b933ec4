
import { ArrowUp, ArrowDown } from "lucide-react";
import { SortField } from "../../types/table-types";

interface SortIconProps {
  currentField: SortField;
  field: SortField;
  direction: "asc" | "desc";
}

export const SortIcon = ({ currentField, field, direction }: SortIconProps) => {
  if (currentField !== field) return null;
  return direction === "asc" ? (
    <ArrowDown className="inline-block ml-1 h-4 w-4" />
  ) : (
    <ArrowUp className="inline-block ml-1 h-4 w-4" />
  );
};
