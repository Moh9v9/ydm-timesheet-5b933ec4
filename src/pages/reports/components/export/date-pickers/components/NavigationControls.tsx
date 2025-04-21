
import React from 'react';
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { datePickerStyles } from '../DatePickerStyles';

interface NavigationControlsProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const NavigationControls = ({
  selectedDate,
  setSelectedDate
}: NavigationControlsProps) => {
  return (
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
  );
};
