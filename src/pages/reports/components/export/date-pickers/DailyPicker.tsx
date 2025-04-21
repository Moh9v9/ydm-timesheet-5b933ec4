
import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
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
            <div className={datePickerStyles.dropdownWrapper}>
              <div className={datePickerStyles.dropdownHeader}>
                <h3 className={datePickerStyles.dropdownTitle}>
                  {format(selectedDate, "MMMM yyyy")}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const prevMonth = new Date(selectedDate);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      setSelectedDate(prevMonth);
                    }}
                    className={datePickerStyles.navigation.button}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const nextMonth = new Date(selectedDate);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setSelectedDate(nextMonth);
                    }}
                    className={datePickerStyles.navigation.button}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={datePickerStyles.dropdownGrid}>
                <StyledSelect
                  value={String(selectedDate.getFullYear())}
                  onValueChange={(value) => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(parseInt(value));
                    setSelectedDate(newDate);
                  }}
                  options={years}
                  placeholder="Select Year"
                  className="min-w-[120px]"
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
                  className="min-w-[120px]"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className={datePickerStyles.actions.button}
                >
                  Apply
                </button>
              </div>
            </div>
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
