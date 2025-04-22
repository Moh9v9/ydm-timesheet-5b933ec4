
import { Search } from "lucide-react";
import { useEmployees } from "@/contexts/EmployeeContext";
import { StyledSelect } from "@/components/ui/styled-select";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder,
  className = ""
}: SearchBarProps) => {
  const { employees } = useEmployees();
  const { t } = useLanguage();
  
  const defaultPlaceholder = t('search');
  
  // Create employee options for the select
  const employeeOptions = [
    { value: "all", label: t('employees') }, // Changed from empty string to "all"
    ...employees.map(emp => ({
      value: emp.fullName,
      label: emp.fullName
    }))
  ];

  return (
    <div className={`relative flex-1 ${className}`}>
      <StyledSelect
        value={searchTerm}
        onValueChange={(value) => {
          // Convert "all" back to empty string for compatibility with existing logic
          onSearchChange(value === "all" ? "" : value);
        }}
        placeholder={placeholder || defaultPlaceholder}
        options={employeeOptions}
      />
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
      />
    </div>
  );
};
