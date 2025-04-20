
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReportType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DateRangeInputsProps {
  reportType: ReportType;
  currentDate: string;
}

const DateRangeInputs = ({ reportType, currentDate }: DateRangeInputsProps) => {
  const [date, setDate] = React.useState<Date>(new Date(currentDate));
  const [open, setOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setOpen(false); // Close the popover after selection
    }
  };

  if (reportType === "daily") {
    return (
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Select Date
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center px-3 py-2 text-left border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
            >
              {format(date, "PPP")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2025}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (reportType === "weekly") {
    return (
      <div>
        <label htmlFor="week" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Select Week
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center px-3 py-2 text-left border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
            >
              {format(date, "'Week of' MMM d, yyyy")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2025}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  if (reportType === "monthly") {
    return (
      <div>
        <label htmlFor="month" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Select Month
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-full flex items-center px-3 py-2 text-left border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
            >
              {format(date, "MMMM yyyy")}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2025}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return null;
};

export default DateRangeInputs;

