
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

        <PopoverContent align="start" className="p-0 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg">
          {!showCalendarView && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
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

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={selectedDate.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(parseInt(e.target.value));
                    setSelectedDate(newDate);
                  }}
                  className={datePickerStyles.select}
                >
                  {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
                    <option key={year} value={year} className="dark:bg-gray-800">
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
                  className={datePickerStyles.select}
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <option key={month} value={month} className="dark:bg-gray-800">
                      {format(new Date(2000, month, 1), "MMMM")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {showCalendarView && (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              initialFocus
              captionLayout="dropdown-buttons"
              fromYear={2020}
              toYear={2030}
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
