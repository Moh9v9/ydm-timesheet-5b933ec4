
import React from 'react';
import { datePickerStyles } from '../DatePickerStyles';
import { NavigationControls } from './NavigationControls';
import { SelectorGrid } from './SelectorGrid';

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
      <NavigationControls 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      
      <SelectorGrid
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        years={years}
        months={months}
      />

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
