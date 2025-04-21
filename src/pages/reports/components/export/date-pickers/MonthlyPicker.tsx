
import React from 'react';
import { format } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthlyPickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MonthlyPicker = ({ selectedDate, setSelectedDate, open, setOpen }: MonthlyPickerProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">
        Select Month
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center px-4 py-2.5 text-left",
              "border rounded-lg dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100",
              "text-sm font-medium transition-all duration-200",
              "hover:border-primary/50 dark:hover:border-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20",
              "active:scale-[0.98]"
            )}
          >
            {format(selectedDate, "MMMM yyyy")}
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn(
            "w-auto p-0",
            "border dark:border-gray-700",
            "rounded-lg overflow-hidden",
            "shadow-lg dark:shadow-black/10",
            "bg-white dark:bg-gray-800/95 backdrop-blur-sm"
          )} 
          align="start"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium dark:text-gray-200">
                {format(selectedDate, "MMMM yyyy")}
              </h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    const prevMonth = new Date(selectedDate);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setSelectedDate(prevMonth);
                  }}
                  className={cn(
                    "p-1.5 rounded-md",
                    "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
                    "transition-colors duration-200"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const nextMonth = new Date(selectedDate);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setSelectedDate(nextMonth);
                  }}
                  className={cn(
                    "p-1.5 rounded-md",
                    "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
                    "transition-colors duration-200"
                  )}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={selectedDate.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(selectedDate);
                  newDate.setFullYear(parseInt(e.target.value));
                  setSelectedDate(newDate);
                }}
                className={cn(
                  "appearance-none pl-2 pr-6 py-1.5 rounded-md",
                  "text-sm font-medium transition-colors duration-200",
                  "bg-background border border-input",
                  "text-foreground hover:bg-accent",
                  "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
                  "dark:hover:bg-gray-700/80",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:focus:ring-primary/40",
                  "cursor-pointer relative"
                )}
              >
                {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              
              <select 
                value={selectedDate.getMonth()}
                onChange={(e) => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(parseInt(e.target.value));
                  setSelectedDate(newDate);
                }}
                className={cn(
                  "appearance-none pl-2 pr-6 py-1.5 rounded-md",
                  "text-sm font-medium transition-colors duration-200",
                  "bg-background border border-input",
                  "text-foreground hover:bg-accent",
                  "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
                  "dark:hover:bg-gray-700/80",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "dark:focus:ring-primary/40",
                  "cursor-pointer relative"
                )}
              >
                {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                  <option key={month} value={month}>
                    {format(new Date(2000, month, 1), "MMMM")}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md",
                  "bg-primary text-primary-foreground",
                  "hover:bg-primary/90 transition-colors duration-200"
                )}
              >
                Select
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthlyPicker;
