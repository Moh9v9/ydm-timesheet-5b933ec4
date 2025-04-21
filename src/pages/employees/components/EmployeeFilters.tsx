
import { EmployeeFilters } from "@/lib/types";
import { StyledSelect } from "@/components/ui/styled-select";

interface EmployeeFiltersProps {
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string) => void;
  projects: string[];
  locations: string[];
  paymentTypes: string[];
  sponsorshipTypes: string[];
}

export const EmployeeFiltersSection = ({
  filters,
  onFilterChange,
  projects,
  locations,
  paymentTypes,
  sponsorshipTypes
}: EmployeeFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Project</label>
        <StyledSelect
          value={filters.project || "All"}
          onValueChange={(value) => onFilterChange("project", value)}
          placeholder="Select Project"
          options={[
            { value: "All", label: "All Projects" },
            ...projects.map(project => ({ value: project, label: project }))
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <StyledSelect
          value={filters.location || "All"}
          onValueChange={(value) => onFilterChange("location", value)}
          placeholder="Select Location"
          options={[
            { value: "All", label: "All Locations" },
            ...locations.map(location => ({ value: location, label: location }))
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Payment Type</label>
        <StyledSelect
          value={filters.paymentType || "All"}
          onValueChange={(value) => onFilterChange("paymentType", value)}
          placeholder="Select Payment Type"
          options={[
            { value: "All", label: "All Types" },
            ...paymentTypes.map(type => ({ value: type, label: type }))
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Sponsorship</label>
        <StyledSelect
          value={filters.sponsorship || "All"}
          onValueChange={(value) => onFilterChange("sponsorship", value)}
          placeholder="Select Sponsorship"
          options={[
            { value: "All", label: "All Sponsorships" },
            ...sponsorshipTypes.map(type => ({ value: type, label: type }))
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <StyledSelect
          value={filters.status || "All"}
          onValueChange={(value) => onFilterChange("status", value)}
          placeholder="Select Status"
          options={[
            { value: "All", label: "All Statuses" },
            { value: "Active", label: "Active Only" },
            { value: "Archived", label: "Archived Only" }
          ]}
        />
      </div>
    </div>
  );
};
