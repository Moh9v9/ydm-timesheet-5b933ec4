
import React from 'react';
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StyledSelect } from "@/components/ui/styled-select";
import { datePickerStyles } from '../DatePickerStyles';

interface MonthYearSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setOpen: (open: boolean) => void;
  years: Array<{ value: string; label: string }>;
  months: Array<{ value: string; label: string }>;
}

export const MonthYearSelector = ({
  selectedDate,
  setSelectedDate,
  setOpen,
  years,
  months
}: MonthYearSelectorProps) => {
  return (
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
  );
};
