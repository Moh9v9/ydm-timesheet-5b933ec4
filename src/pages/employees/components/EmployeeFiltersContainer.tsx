
import { EmployeeFilters } from "@/lib/types";
import { SearchBar } from "./SearchBar";
import { EmployeeFiltersSection } from "./EmployeeFilters";

interface EmployeeFiltersContainerProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
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
  searchTerm,
  onSearchChange,
  showFilters,
  setShowFilters,
  filters,
  onFilterChange,
  filterOptions
}: EmployeeFiltersContainerProps) => {
  return (
    <div className="p-4 border-b dark:border-gray-800">
      <div className="flex flex-col gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        <EmployeeFiltersSection
          showFilters={showFilters}
          setShowFilters={setShowFilters}
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

