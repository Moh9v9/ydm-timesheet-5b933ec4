
import React from 'react';
import { ReportType } from "@/lib/types";
import MonthlyPicker from './date-pickers/MonthlyPicker';
import DailyPicker from './date-pickers/DailyPicker';

interface DateRangeInputsProps {
  reportType: ReportType;
  currentDate: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DateRangeInputs = ({ reportType, currentDate, selectedDate, setSelectedDate }: DateRangeInputsProps) => {
  const [open, setOpen] = React.useState(false);

  if (reportType === "monthly") {
    return (
      <MonthlyPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        open={open}
        setOpen={setOpen}
      />
    );
  }

  if (reportType === "daily") {
    return (
      <DailyPicker
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        open={open}
        setOpen={setOpen}
        showCalendarView={true}
      />
    );
  }

  return null;
};

export default DateRangeInputs;
