
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { datePickerStyles } from './DatePickerStyles';

interface DailyPickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  yearMonthCaptionLayout: any;
}

const DailyPicker = ({ selectedDate, setSelectedDate, open, setOpen, yearMonthCaptionLayout }: DailyPickerProps) => {
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setOpen(false);
    }
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
            ISOWeek
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
            components={yearMonthCaptionLayout.components}
            className={datePickerStyles.calendar.wrapper}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DailyPicker;

