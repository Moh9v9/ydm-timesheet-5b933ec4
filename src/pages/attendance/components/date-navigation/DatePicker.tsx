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
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={2020}
          toYear={2030}
          classNames={{
            months: "space-y-4",
            month: "space-y-4",
            caption: "relative flex items-center justify-center pt-1 pb-2",
            caption_label: "flex items-center gap-1 text-sm font-medium",
            nav: "flex items-center gap-1",
            nav_button: cn(
              "inline-flex items-center justify-center rounded-md p-1.5",
              "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
              "transition-colors duration-200"
            ),
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: cn(
              "text-muted-foreground rounded-md w-9 font-normal text-xs",
              "uppercase tracking-wide"
            ),
            row: "flex w-full mt-2",
            cell: cn(
              "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
              "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            ),
            day: cn(
              "h-9 w-9 p-0 font-normal",
              "rounded-md transition-colors duration-200",
              "hover:bg-primary/10 dark:hover:bg-primary/20",
              "focus:outline-none focus:ring-2 focus:ring-primary/20"
            ),
            day_selected: cn(
              "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground",
              "hover:bg-primary hover:text-primary-foreground",
              "focus:bg-primary focus:text-primary-foreground"
            ),
            day_today: "bg-accent/50 text-accent-foreground dark:bg-accent/30 dark:text-white",
            day_outside: "text-muted-foreground/50 dark:text-muted-foreground/30",
            day_disabled: "text-muted-foreground/50 dark:text-muted-foreground/30",
            day_hidden: "invisible"
          }}
          components={yearMonthCaptionLayout.components}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
