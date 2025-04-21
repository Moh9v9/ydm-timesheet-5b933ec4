
import React from 'react';
import { format } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReportType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DateRangeInputsProps {
  reportType: ReportType;
  currentDate: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DateRangeInputs = ({ reportType, currentDate, selectedDate, setSelectedDate }: DateRangeInputsProps) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setOpen(false);
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

  // Month picker for monthly reports
  if (reportType === "monthly") {
    return (
      <div>
        <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">
          Select Month
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center px-4 py-2.5 text-left",
                "border rounded-lg dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100",
                "text-sm font-medium transition-all duration-200",
                "hover:border-primary/50 dark:hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20",
                "active:scale-[0.98]"
              )}
            >
              {format(selectedDate, "MMMM yyyy")}
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
                    className={cn(
                      "p-1.5 rounded-md",
                      "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
                      "transition-colors duration-200"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      const nextMonth = new Date(selectedDate);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setSelectedDate(nextMonth);
                    }}
                    className={cn(
                      "p-1.5 rounded-md",
                      "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
                      "transition-colors duration-200"
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select 
                  value={selectedDate.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(selectedDate);
                    newDate.setFullYear(parseInt(e.target.value));
                    setSelectedDate(newDate);
                  }}
                  className={cn(
                    "appearance-none pl-2 pr-6 py-1.5 rounded-md",
                    "text-sm font-medium transition-colors duration-200",
                    "bg-background border border-input",
                    "text-foreground hover:bg-accent",
                    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
                    "dark:hover:bg-gray-700/80",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "dark:focus:ring-primary/40",
                    "cursor-pointer relative"
                  )}
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
                  className={cn(
                    "appearance-none pl-2 pr-6 py-1.5 rounded-md",
                    "text-sm font-medium transition-colors duration-200",
                    "bg-background border border-input",
                    "text-foreground hover:bg-accent",
                    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
                    "dark:hover:bg-gray-700/80",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "dark:focus:ring-primary/40",
                    "cursor-pointer relative"
                  )}
                >
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <option key={month} value={month}>
                      {format(new Date(2000, month, 1), "MMMM")}
                    </option>
                  ))}
                </select>
              </div>
              
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelect}
                month={selectedDate}
                className="pointer-events-auto"
                classNames={{
                  month: "space-y-4",
                  caption: "hidden", // Hide the default caption
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
                  day_hidden: "invisible",
                }}
              />
              
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 transition-colors duration-200"
                  )}
                >
                  Select
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Daily report date picker
  if (reportType === "daily") {
    return (
      <div>
        <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">
          Select Date
        </label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center px-4 py-2.5 text-left",
                "border rounded-lg dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100",
                "text-sm font-medium transition-all duration-200",
                "hover:border-primary/50 dark:hover:border-primary/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20",
                "active:scale-[0.98]"
              )}
            >
              {format(selectedDate, "PPP")}
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
                day_hidden: "invisible",
              }}
              components={yearMonthCaptionLayout.components}
              className={cn("p-4 pointer-events-auto select-none")}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return null;
};

export default DateRangeInputs;
