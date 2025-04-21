
import React from 'react';
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { datePickerStyles } from './DatePickerStyles';
import { StyledSelect } from '@/components/ui/styled-select';
import { cn } from '@/lib/utils';

interface MonthlyPickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const MonthlyPicker = ({ selectedDate, setSelectedDate, open, setOpen }: MonthlyPickerProps) => {
  const years = Array.from({ length: 11 }, (_, i) => ({
    value: String(2020 + i),
    label: String(2020 + i)
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i),
    label: format(new Date(2000, i, 1), "MMMM")
  }));

  return (
    <div className={datePickerStyles.container}>
      <label className={datePickerStyles.label}>
        Select Month
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className={cn(
            datePickerStyles.trigger,
            "flex items-center justify-between gap-4"
          )}>
            <span>{format(selectedDate, "MMMM yyyy")}</span>
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className={datePickerStyles.popoverContent} align="start">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-medium dark:text-gray-100">
                {format(selectedDate, "MMMM yyyy")}
              </h3>
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

            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className={datePickerStyles.actions.button}
              >
                Apply
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthlyPicker;
