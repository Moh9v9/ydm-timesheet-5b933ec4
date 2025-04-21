
import { EmployeeFilters } from "@/lib/types";
import { Filter } from "lucide-react";

interface EmployeeFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: EmployeeFilters;
  onFilterChange: (key: keyof EmployeeFilters, value: string) => void;
  projects: string[];
  locations: string[];
  paymentTypes: string[];
  sponsorshipTypes: string[];
}

export const EmployeeFiltersSection = ({
  showFilters,
  setShowFilters,
  filters,
  onFilterChange,
  projects,
  locations,
  paymentTypes,
  sponsorshipTypes
}: EmployeeFiltersProps) => {
  return (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md flex items-center hover:bg-secondary/90 transition-colors"
      >
        <Filter size={16} className="mr-2" />
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project</label>
            <select
              value={filters.project || "All"}
              onChange={(e) => onFilterChange("project", e.target.value)}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
            >
              <option value="All">All Projects</option>
              {projects.map((project) => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select
              value={filters.location || "All"}
              onChange={(e) => onFilterChange("location", e.target.value)}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
            >
              <option value="All">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Payment Type</label>
            <select
              value={filters.paymentType || "All"}
              onChange={(e) => onFilterChange("paymentType", e.target.value)}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
            >
              <option value="All">All Types</option>
              {paymentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sponsorship</label>
            <select
              value={filters.sponsorship || "All"}
              onChange={(e) => onFilterChange("sponsorship", e.target.value)}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
            >
              <option value="All">All Sponsorships</option>
              {sponsorshipTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filters.status || "All"}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full border border-input rounded-md p-2 bg-background dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-primary"
            >
              <option value="All">All Status</option>
              <option value="Active">Active Only</option>
              <option value="Archived">Archived Only</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
};
