
import React from 'react';
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDropdownProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export const CalendarDropdown = ({ value, onChange, children }: CalendarDropdownProps) => {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "appearance-none pl-2 pr-6 py-1.5 rounded-md",
          "text-sm font-medium transition-colors duration-200",
          // Light mode styles
          "bg-background border border-input",
          "text-foreground hover:bg-accent",
          // Dark mode styles
          "dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100",
          "dark:hover:bg-gray-800/90", 
          "dark:focus:ring-2 dark:focus:ring-primary/40 dark:focus:ring-offset-1 dark:focus:ring-offset-gray-900",
          "cursor-pointer z-10 min-w-[110px]",
          "shadow-sm dark:shadow-md",
          "dark:hover:shadow-lg"
        )}
      >
        {children}
      </select>
      <ChevronDown 
        className={cn(
          "w-4 h-4 absolute right-1.5",
          "text-muted-foreground/70 dark:text-gray-300",
          "pointer-events-none"
        )}
      />
    </div>
  );
};

