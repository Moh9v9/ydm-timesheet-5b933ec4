
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
  yearMonthCaptionLayout?: any;
  showCalendarView?: boolean;
}

const DailyPicker = ({ selectedDate, setSelectedDate, open, setOpen, showCalendarView = true }: DailyPickerProps) => {
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
          <button className={datePickerStyles.trigger}>
            {format(selectedDate, showCalendarView ? "PPP" : "MMMM yyyy")}
          </button>
        </PopoverTrigger>
        <PopoverContent className={datePickerStyles.popoverContent} align="start">
          {showCalendarView ? (
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
                caption: "relative flex items-center justify-center pt-3 pb-2",
                caption_label: "flex items-center gap-2 text-sm font-medium text-gray-200",
                nav: "flex items-center gap-1",
                nav_button: datePickerStyles.calendar.nav_button,
                table: "w-full border-collapse",
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
              components={{
                Dropdown: ({ value, onChange, children, ...props }: any) => {
                  return (
                    <div className="relative inline-flex items-center mx-1">
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
                        "text-gray-400",
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
              }}
              className={datePickerStyles.calendar.wrapper}
            />
          ) : (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium dark:text-gray-200">
                  {format(selectedDate, "MMMM yyyy")}
                </h3>
                <div className="flex space-x-1">
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
              
              <div className="grid grid-cols-2 gap-2">
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
                    <option key={year} value={year}>
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
                    <option key={month} value={month}>
                      {format(new Date(2000, month, 1), "MMMM")}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className={datePickerStyles.actions.button}
                >
                  Select
                </button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DailyPicker;
