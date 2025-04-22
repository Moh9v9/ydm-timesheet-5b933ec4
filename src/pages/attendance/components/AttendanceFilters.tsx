
import { StyledSelect } from "@/components/ui/styled-select";
import { useEmployees } from "@/contexts/EmployeeContext";

interface AttendanceFiltersProps {
  filters: {
    project: string;
    location: string;
    paymentType: string;
    sponsorship: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const AttendanceFilters = ({
  filters,
  onFilterChange,
}: AttendanceFiltersProps) => {
  const { getUniqueValues } = useEmployees();

  const projects = ["All Projects", ...getUniqueValues("project")];
  const locations = ["All Locations", ...getUniqueValues("location")];
  const paymentTypes = ["All Types", "Monthly", "Daily"];
  const sponsorshipTypes = ["All Sponsorships", "YDM co", "YDM est", "Outside"];

  return (
    <div className="p-4 border-b dark:border-gray-800 bg-card dark:bg-gray-900/50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StyledSelect
          value={filters.project}
          onValueChange={(value) => onFilterChange("project", value)}
          placeholder="Select Project"
          options={projects.map(p => ({ value: p, label: p }))}
          label="Project"
        />
        
        <StyledSelect
          value={filters.location}
          onValueChange={(value) => onFilterChange("location", value)}
          placeholder="Select Location"
          options={locations.map(l => ({ value: l, label: l }))}
          label="Location"
        />
        
        <StyledSelect
          value={filters.paymentType}
          onValueChange={(value) => onFilterChange("paymentType", value)}
          placeholder="Select Payment Type"
          options={paymentTypes.map(t => ({ value: t, label: t }))}
          label="Payment Type"
        />
        
        <StyledSelect
          value={filters.sponsorship}
          onValueChange={(value) => onFilterChange("sponsorship", value)}
          placeholder="Select Sponsorship"
          options={sponsorshipTypes.map(s => ({ value: s, label: s }))}
          label="Sponsorship"
        />
      </div>
    </div>
  );
};
