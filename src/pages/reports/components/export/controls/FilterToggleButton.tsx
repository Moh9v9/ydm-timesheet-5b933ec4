
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface FilterToggleButtonProps {
  showFilters: boolean;
  onToggle: () => void;
}

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({
  showFilters,
  onToggle
}) => {
  return (
    <Button 
      variant="outline" 
      className="mt-8 ml-4 flex items-center gap-2 self-start"
      onClick={onToggle}
    >
      <Filter size={16} />
      {showFilters ? "Hide Filters" : "Show Filters"}
    </Button>
  );
};

export default FilterToggleButton;
