
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { datePickerStyles } from './DatePickerStyles';
import { CalendarDropdown } from './components/CalendarDropdown';
import { MonthYearSelector } from './components/MonthYearSelector';

interface DailyPickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  showCalendarView?: boolean;
}

const DailyPicker = ({
  selectedDate,
  setSelectedDate,
  open,
  setOpen,
  showCalendarView = true
}: DailyPickerProps) => {
  const years = Array.from({ length: 11 }, (_, i) => ({
    value: String(2020 + i),
    label: String(2020 + i)
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i),
    label: format(new Date(2000, i, 1), "MMMM")
  }));

  const yearMonthCaptionLayout = {
    components: {
      Dropdown: ({ value, onChange, children, ...props }: any) => (
        <CalendarDropdown value={value} onChange={onChange} {...props}>
          {children}
        </CalendarDropdown>
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
            <span>{format(selectedDate, showCalendarView ? "PPP" : "MMMM yyyy")}</span>
            <ChevronRight className="h-4 w-4 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent className={datePickerStyles.popoverContent} align="start">
          {!showCalendarView ? (
            <MonthYearSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setOpen={setOpen}
              years={years}
              months={months}
            />
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setOpen(false);
                }
              }}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2030}
              className={cn(datePickerStyles.calendar.wrapper, "pointer-events-auto")}
              classNames={{
                months: datePickerStyles.calendar.months,
                month: datePickerStyles.calendar.months,
                caption: datePickerStyles.calendar.caption,
                caption_label: datePickerStyles.calendar.caption_label,
                nav: datePickerStyles.calendar.nav,
                nav_button: datePickerStyles.calendar.nav_button,
                table: datePickerStyles.calendar.table,
                head_cell: datePickerStyles.calendar.head_cell,
                row: datePickerStyles.calendar.row,
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day: datePickerStyles.calendar.day,
                day_selected: datePickerStyles.calendar.day_selected,
                day_today: datePickerStyles.calendar.day_today,
                day_outside: datePickerStyles.calendar.day_outside,
                day_disabled: datePickerStyles.calendar.day_disabled,
                day_hidden: datePickerStyles.calendar.day_hidden,
              }}
              components={yearMonthCaptionLayout.components}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DailyPicker;
