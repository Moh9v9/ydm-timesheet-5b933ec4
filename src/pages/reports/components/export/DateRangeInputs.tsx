
import React from 'react';
import { ReportType } from "@/lib/types";

interface DateRangeInputsProps {
  reportType: ReportType;
  currentDate: string;
}

const DateRangeInputs = ({ reportType, currentDate }: DateRangeInputsProps) => {
  if (reportType === "daily") {
    return (
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={currentDate}
          className="w-full p-2 border border-input rounded-md 
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-primary 
            dark:focus:ring-offset-2 
            dark:focus:ring-primary/70"
        />
      </div>
    );
  }

  if (reportType === "weekly") {
    return (
      <div>
        <label htmlFor="week" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Week
        </label>
        <input
          type="week"
          id="week"
          className="w-full p-2 border border-input rounded-md 
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-primary 
            dark:focus:ring-offset-2 
            dark:focus:ring-primary/70"
        />
      </div>
    );
  }

  if (reportType === "monthly") {
    return (
      <div>
        <label htmlFor="month" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Month
        </label>
        <input
          type="month"
          id="month"
          className="w-full p-2 border border-input rounded-md 
            bg-white dark:bg-gray-800 
            border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-primary 
            dark:focus:ring-offset-2 
            dark:focus:ring-primary/70"
        />
      </div>
    );
  }

  return null;
};

export default DateRangeInputs;

