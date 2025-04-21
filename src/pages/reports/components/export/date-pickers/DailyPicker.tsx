import React from 'react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
const DailyPicker = ({
  selectedDate,
  setSelectedDate,
  open,
  setOpen,
  showCalendarView = true
}: DailyPickerProps) => {
  const {
    theme
  } = useTheme();
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setOpen(false);
    }
  };
  return <div className={datePickerStyles.container}>
      <label className={datePickerStyles.label}>
        Select Date
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={cn(datePickerStyles.trigger, "flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg")}>
            <span>{format(selectedDate, showCalendarView ? "PPP" : "MMMM yyyy")}</span>
            <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="">
          {!showCalendarView && <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold dark:text-gray-100">
                  {format(selectedDate, "MMMM yyyy")}
                </h3>
                <div className="flex space-x-2">
                  <button onClick={() => {
                const prevMonth = new Date(selectedDate);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setSelectedDate(prevMonth);
              }} className={cn(datePickerStyles.navigation.button, "p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700")}>
                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                  <button onClick={() => {
                const nextMonth = new Date(selectedDate);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setSelectedDate(nextMonth);
              }} className={cn(datePickerStyles.navigation.button, "p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700")}>
                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <select value={selectedDate.getFullYear()} onChange={e => {
              const newDate = new Date(selectedDate);
              newDate.setFullYear(parseInt(e.target.value));
              setSelectedDate(newDate);
            }} className={cn(datePickerStyles.select, "w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100")}>
                  {Array.from({
                length: 11
              }, (_, i) => 2020 + i).map(year => <option key={year} value={year} className="dark:bg-gray-800">
                      {year}
                    </option>)}
                </select>
                
                <select value={selectedDate.getMonth()} onChange={e => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(parseInt(e.target.value));
              setSelectedDate(newDate);
            }} className={cn(datePickerStyles.select, "w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100")}>
                  {Array.from({
                length: 12
              }, (_, i) => i).map(month => <option key={month} value={month} className="dark:bg-gray-800">
                      {format(new Date(2000, month, 1), "MMMM")}
                    </option>)}
                </select>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button onClick={() => setOpen(false)} className={cn(datePickerStyles.actions.button, "px-4 py-2 rounded-lg text-sm font-medium")}>
                  Select
                </button>
              </div>
            </div>}

          {showCalendarView && <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} initialFocus captionLayout="dropdown-buttons" fromYear={2020} toYear={2030} classNames={{
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
          day_hidden: "invisible"
        }} />}
        </PopoverContent>
      </Popover>
    </div>;
};
export default DailyPicker;