
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { datePickerStyles } from './DatePickerStyles';
import { useTheme } from "@/contexts/ThemeContext";

interface DailyPickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  yearMonthCaptionLayout: any;
}

const DailyPicker = ({ selectedDate, setSelectedDate, open, setOpen }: DailyPickerProps) => {
  const { theme } = useTheme();
  
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setOpen(false);
    }
  };

  // Custom navigation components
  const captionLayout = {
    components: {
      Dropdown: ({ value, onChange, children, ...props }: any) => {
        return (
          <div className="relative inline-flex items-center">
            <select
              value={value}
              onChange={onChange}
              className={datePickerStyles.select}
              {...props}
            >
              {children}
            </select>
            <ChevronRight className={cn(
              "w-4 h-4 absolute right-2",
              "text-muted-foreground/70 dark:text-gray-400",
              "pointer-events-none rotate-90"
            )} />
          </div>
        );
      },
      IconLeft: ({ ...props }) => (
        <button {...props} className={datePickerStyles.navigation.button}>
          <ChevronLeft className="h-4 w-4" />
        </button>
      ),
      IconRight: ({ ...props }) => (
        <button {...props} className={datePickerStyles.navigation.button}>
          <ChevronRight className="h-4 w-4" />
        </button>
      ),
    },
  };

  return (
    <div className={datePickerStyles.container}>
      <label className={datePickerStyles.label}>
        Select Date
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={datePickerStyles.trigger}>
            {format(selectedDate, "PPP")}
          </button>
        </PopoverTrigger>
        <PopoverContent className={datePickerStyles.popoverContent} align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
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
              nav_button: datePickerStyles.calendar.nav_button,
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell: datePickerStyles.calendar.head_cell,
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
              day: datePickerStyles.calendar.day,
              day_selected: datePickerStyles.calendar.day_selected,
              day_today: "bg-accent/50 text-accent-foreground dark:bg-accent/30 dark:text-white",
              day_outside: "text-muted-foreground/50 dark:text-muted-foreground/30",
              day_disabled: "text-muted-foreground/50 dark:text-muted-foreground/30",
              day_hidden: "invisible",
            }}
            components={captionLayout.components}
            className={datePickerStyles.calendar.wrapper}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DailyPicker;
