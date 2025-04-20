
import { StyledSelect } from "@/components/ui/styled-select";
import { EmployeeFilters, PaymentType, SponsorshipType } from "@/lib/types";

interface EmployeeExportFiltersProps {
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string | undefined) => void;
  filteredEmployeesCount: number;
  projects: string[];
  locations: string[];
  paymentTypes: string[];
  sponsorships: string[];
  show: boolean;
}

const EmployeeExportFilters = ({
  filters,
  onFilterChange,
  filteredEmployeesCount,
  projects,
  locations,
  paymentTypes,
  sponsorships,
  show,
}: EmployeeExportFiltersProps) => {
  if (!show) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 border rounded-lg bg-muted/20 dark:bg-gray-800/30">
      <StyledSelect
        label="Project"
        value={filters.project || "all"}
        onValueChange={value => onFilterChange("project", value === "all" ? undefined : value)}
        placeholder="All Projects"
        options={projects.map(p => ({ value: p, label: p === "all" ? "All Projects" : p }))}
      />
      <StyledSelect
        label="Location"
        value={filters.location || "all"}
        onValueChange={value => onFilterChange("location", value === "all" ? undefined : value)}
        placeholder="All Locations"
        options={locations.map(l => ({ value: l, label: l === "all" ? "All Locations" : l }))}
      />
      <StyledSelect
        label="Payment Type"
        value={filters.paymentType || "all"}
        onValueChange={value => onFilterChange("paymentType", value === "all" ? undefined : value as PaymentType)}
        placeholder="All Payment Types"
        options={paymentTypes.map(p => ({ value: p, label: p === "all" ? "All Payment Types" : p }))}
      />
      <StyledSelect
        label="Sponsorship"
        value={filters.sponsorship || "all"}
        onValueChange={value => onFilterChange("sponsorship", value === "all" ? undefined : value as SponsorshipType)}
        placeholder="All Sponsorships"
        options={sponsorships.map(s => ({ value: s, label: s === "all" ? "All Sponsorships" : s }))}
      />
      <div className="col-span-1 sm:col-span-2">
        <small className="text-muted-foreground">
          {filteredEmployeesCount} employees match the selected filters
        </small>
      </div>
    </div>
  );
};

export default EmployeeExportFilters;

