
import React from 'react';
import { CalendarDays } from 'lucide-react';
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
        <div className="relative">
          <input
            type="date"
            id="date"
            value={currentDate}
            className="w-full p-2 pl-10 border border-input rounded-md 
              bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 
              text-gray-900 dark:text-gray-100 
              focus:ring-2 focus:ring-primary 
              dark:focus:ring-offset-2 
              dark:focus:ring-primary/70"
          />
          <CalendarDays 
            className="absolute left-3 top-1/2 -translate-y-1/2 
              text-gray-500 dark:text-gray-400 
              pointer-events-none" 
            size={20} 
          />
        </div>
      </div>
    );
  }

  if (reportType === "weekly") {
    return (
      <div>
        <label htmlFor="week" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Week
        </label>
        <div className="relative">
          <input
            type="week"
            id="week"
            className="w-full p-2 pl-10 border border-input rounded-md 
              bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 
              text-gray-900 dark:text-gray-100 
              focus:ring-2 focus:ring-primary 
              dark:focus:ring-offset-2 
              dark:focus:ring-primary/70"
          />
          <CalendarDays 
            className="absolute left-3 top-1/2 -translate-y-1/2 
              text-gray-500 dark:text-gray-400 
              pointer-events-none" 
            size={20} 
          />
        </div>
      </div>
    );
  }

  if (reportType === "monthly") {
    return (
      <div>
        <label htmlFor="month" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Month
        </label>
        <div className="relative">
          <input
            type="month"
            id="month"
            className="w-full p-2 pl-10 border border-input rounded-md 
              bg-white dark:bg-gray-800 
              border-gray-300 dark:border-gray-600 
              text-gray-900 dark:text-gray-100 
              focus:ring-2 focus:ring-primary 
              dark:focus:ring-offset-2 
              dark:focus:ring-primary/70"
          />
          <CalendarDays 
            className="absolute left-3 top-1/2 -translate-y-1/2 
              text-gray-500 dark:text-gray-400 
              pointer-events-none" 
            size={20} 
          />
        </div>
      </div>
    );
  }

  return null;
};

export default DateRangeInputs;
