
import React from 'react';
import { ReportType } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface DateRangeInputsProps {
  reportType: ReportType;
  currentDate: string;
}

const DateRangeInputs = ({ reportType, currentDate }: DateRangeInputsProps) => {
  if (reportType === "daily") {
    return (
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Select Date
        </label>
        <Input
          type="date"
          id="date"
          defaultValue={currentDate}
          className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
        />
      </div>
    );
  }

  if (reportType === "weekly") {
    return (
      <div>
        <label htmlFor="week" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Select Week
        </label>
        <Input
          type="week"
          id="week"
          className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
        />
      </div>
    );
  }

  if (reportType === "monthly") {
    return (
      <div>
        <label htmlFor="month" className="block text-sm font-medium mb-1 dark:text-gray-200">
          Select Month
        </label>
        <Input
          type="month"
          id="month"
          className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm"
        />
      </div>
    );
  }

  return null;
};

export default DateRangeInputs;
