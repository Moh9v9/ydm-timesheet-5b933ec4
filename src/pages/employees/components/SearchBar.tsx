
import { Search } from "lucide-react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { StyledSelect } from "@/components/ui/styled-select";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search employees...",
  className = ""
}: SearchBarProps) => {
  const { employees } = useEmployees();
  
  // Create employee options for the select
  const employeeOptions = [
    { value: "", label: "All Employees" },
    ...employees.map(emp => ({
      value: emp.fullName,
      label: emp.fullName
    }))
  ];

  return (
    <div className={`relative flex-1 ${className}`}>
      <StyledSelect
        value={searchTerm}
        onValueChange={onSearchChange}
        placeholder={placeholder}
        options={employeeOptions}
      />
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
      />
    </div>
  );
};
