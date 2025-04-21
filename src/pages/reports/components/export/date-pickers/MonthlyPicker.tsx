
import React from 'react';
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { datePickerStyles } from './DatePickerStyles';

interface MonthlyPickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MonthlyPicker = ({ selectedDate, setSelectedDate, open, setOpen }: MonthlyPickerProps) => {
  return (
    <div className={datePickerStyles.container}>
      <label className={datePickerStyles.label}>
        Select Month
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={datePickerStyles.trigger}>
            {format(selectedDate, "MMMM yyyy")}
          </button>
        </PopoverTrigger>
        <PopoverContent className={datePickerStyles.popoverContent} align="start">
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthlyPicker;

