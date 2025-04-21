
import React from 'react';
import { StyledSelect } from "@/components/ui/styled-select";
import { datePickerStyles } from '../DatePickerStyles';

interface SelectorGridProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  years: Array<{ value: string; label: string }>;
  months: Array<{ value: string; label: string }>;
}

export const SelectorGrid = ({
  selectedDate,
  setSelectedDate,
  years,
  months
}: SelectorGridProps) => {
  return (
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
  );
};
