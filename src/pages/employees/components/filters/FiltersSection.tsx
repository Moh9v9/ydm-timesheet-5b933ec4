
import { EmployeeFilters } from "@/lib/types";
import { SearchBar } from "../SearchBar";
import { EmployeeFiltersSection } from "../EmployeeFilters";

interface FiltersSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string) => void;
  projects: string[];
  locations: string[];
  paymentTypes: string[];
  sponsorshipTypes: string[];
}

export const FiltersSection = ({
  searchTerm,
  onSearchChange,
  showFilters,
  setShowFilters,
  filters,
  onFilterChange,
  projects,
  locations,
  paymentTypes,
  sponsorshipTypes,
}: FiltersSectionProps) => {
  return (
    <div className="p-4 border-b dark:border-gray-800">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        <EmployeeFiltersSection
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          onFilterChange={onFilterChange}
          projects={projects}
          locations={locations}
          paymentTypes={paymentTypes}
          sponsorshipTypes={sponsorshipTypes}
        />
      </div>
    </div>
  );
};
