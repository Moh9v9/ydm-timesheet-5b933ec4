
import React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DatePicker = ({ currentDate, setCurrentDate }: DatePickerProps) => {
  const date = new Date(currentDate);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentDate(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  // Custom dropdown components for the calendar
  const yearMonthCaptionLayout = {
    components: {
      Dropdown: ({ value, onChange, children, ...props }: any) => {
        return (
          <div className="relative inline-flex items-center">
            <select
              value={value}
              onChange={onChange}
              className="appearance-none bg-transparent pl-2 pr-6 py-1 outline-none cursor-pointer z-10 text-sm font-medium text-foreground dark:text-white"
              {...props}
            >
              {children}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-0.5 text-muted-foreground/70 pointer-events-none" />
          </div>
        );
      },
    },
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-4 py-2 flex items-center hover:bg-accent/50 rounded-md transition-colors">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
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
          toYear={2030}
          components={yearMonthCaptionLayout.components}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
