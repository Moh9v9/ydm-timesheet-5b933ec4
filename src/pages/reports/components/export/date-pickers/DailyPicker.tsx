
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StyledSelect } from "@/components/ui/styled-select";
import { cn } from "@/lib/utils";
import { datePickerStyles } from './DatePickerStyles';
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const years = Array.from({ length: 11 }, (_, i) => ({
    value: String(2020 + i),
    label: String(2020 + i)
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i),
    label: format(new Date(2000, i, 1), "MMMM")
  }));

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
          <button className={cn(
            datePickerStyles.trigger,
            "flex items-center justify-between gap-4"
          )}>
            <span>{format(selectedDate, showCalendarView ? "PPP" : "MMMM yyyy")}</span>
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="p-0 w-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
          {!showCalendarView && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium dark:text-gray-100">
                  {format(selectedDate, "MMMM yyyy")}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const prevMonth = new Date(selectedDate);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      setSelectedDate(prevMonth);
                    }}
                    className={datePickerStyles.calendar.nav_button}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const nextMonth = new Date(selectedDate);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setSelectedDate(nextMonth);
                    }}
                    className={datePickerStyles.calendar.nav_button}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StyledSelect
                  value={String(selectedDate.getFullYear())}
                  onValueChange={(value) => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(parseInt(value));
                    setSelectedDate(newDate);
                  }}
                  options={years}
                  placeholder="Select Year"
                />
                <StyledSelect
                  value={String(selectedDate.getMonth())}
                  onValueChange={(value) => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(parseInt(value));
                    setSelectedDate(newDate);
                  }}
                  options={months}
                  placeholder="Select Month"
                />
              </div>
            </div>
          )}

          {showCalendarView && (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              initialFocus
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
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DailyPicker;
