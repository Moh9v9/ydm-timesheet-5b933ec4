
import React from 'react';
import { ChevronDown } from "lucide-react";
import { ReportType } from "@/lib/types";
import { cn } from "@/lib/utils";
import MonthlyPicker from './date-pickers/MonthlyPicker';
import DailyPicker from './date-pickers/DailyPicker';

interface DateRangeInputsProps {
  reportType: ReportType;
  currentDate: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DateRangeInputs = ({ reportType, currentDate, selectedDate, setSelectedDate }: DateRangeInputsProps) => {
  const [open, setOpen] = React.useState(false);

  // Custom dropdown components for the calendar
  const yearMonthCaptionLayout = {
    components: {
      Dropdown: ({ value, onChange, children, ...props }: any) => {
        return (
          <div className="relative inline-flex items-center">
            <select
              value={value}
              onChange={onChange}
              className={cn(
                "appearance-none pl-2 pr-6 py-1.5 rounded-md",
                "text-sm font-medium transition-colors duration-200",
                "bg-background border border-input",
                "text-foreground hover:bg-accent",
                "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
                "dark:hover:bg-gray-700/80",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "dark:focus:ring-primary/40 dark:focus:ring-offset-1 dark:focus:ring-offset-gray-900",
                "cursor-pointer z-10 min-w-[110px]"
              )}
              {...props}
            >
              {children}
            </select>
            <ChevronDown 
              className={cn(
                "w-4 h-4 absolute right-1.5",
                "text-muted-foreground/70 dark:text-gray-400",
                "pointer-events-none"
              )}
            />
          </div>
        );
      },
    },
  };

  if (reportType === "monthly") {
    return (
      <MonthlyPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        open={open}
        setOpen={setOpen}
      />
    );
  }

  if (reportType === "daily") {
    return (
      <DailyPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        open={open}
        setOpen={setOpen}
        yearMonthCaptionLayout={yearMonthCaptionLayout}
      />
    );
  }

  return null;
};

export default DateRangeInputs;

