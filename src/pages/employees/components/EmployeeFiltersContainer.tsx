
import { EmployeeFilters } from "@/lib/types";
import { EmployeeFiltersSection } from "./EmployeeFilters";

interface EmployeeFiltersContainerProps {
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string) => void;
  filterOptions: {
    projects: string[];
    locations: string[];
    paymentTypes: string[];
    sponsorshipTypes: string[];
  };
}

export const EmployeeFiltersContainer = ({
  filters,
  onFilterChange,
  filterOptions
}: EmployeeFiltersContainerProps) => {
  return (
    <div className="p-4 border-b dark:border-gray-800">
      <div className="flex flex-col gap-4">
        <EmployeeFiltersSection
          filters={filters}
          onFilterChange={onFilterChange}
          projects={filterOptions.projects}
          locations={filterOptions.locations}
          paymentTypes={filterOptions.paymentTypes}
          sponsorshipTypes={filterOptions.sponsorshipTypes}
        />
      </div>
    </div>
  );
};
