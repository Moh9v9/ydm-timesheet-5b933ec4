
import { cn } from "@/lib/utils";

export const datePickerStyles = {
  container: "block",
  label: "block text-sm font-medium mb-1.5 dark:text-gray-200",
  trigger: cn(
    "w-full flex items-center justify-between px-4 py-2.5 text-left",
    "border rounded-lg dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100",
    "text-sm font-medium transition-all duration-200",
    "hover:border-primary/50 dark:hover:border-primary/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20",
    "active:scale-[0.98]"
  ),
  select: cn(
    "appearance-none pl-3 pr-8 py-1.5 rounded-md",
    "text-sm font-medium transition-colors duration-200",
    "bg-transparent border border-gray-200",
    "text-gray-900 hover:bg-gray-50",
    "dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
    "dark:focus:ring-primary/40",
    "cursor-pointer relative min-w-[100px]"
  ),
  calendar: {
    wrapper: "p-3",
    nav_button: cn(
      "inline-flex items-center justify-center rounded-md p-1.5",
      "text-gray-500 hover:bg-gray-100",
      "dark:text-gray-400 dark:hover:bg-gray-800",
      "transition-colors duration-200"
    ),
    head_cell: cn(
      "text-xs font-medium text-gray-500 dark:text-gray-400",
      "w-9 py-2"
    ),
    day: cn(
      "h-9 w-9 p-0 font-normal",
      "text-sm text-gray-900 dark:text-gray-300",
      "rounded-lg transition-colors duration-200",
      "hover:bg-gray-100 dark:hover:bg-gray-700/50",
      "focus:outline-none focus:ring-2 focus:ring-primary/20"
    ),
    day_selected: cn(
      "bg-primary text-white",
      "hover:bg-primary/90 hover:text-white",
      "focus:bg-primary focus:text-white",
      "dark:bg-primary dark:text-white",
      "dark:hover:bg-primary/90 dark:hover:text-white"
    ),
    day_today: cn(
      "bg-gray-100/50 text-gray-900",
      "dark:bg-gray-800 dark:text-gray-100"
    ),
    day_outside: "text-gray-400 dark:text-gray-600 opacity-50",
    day_disabled: "text-gray-400 dark:text-gray-600 opacity-50",
    day_range_middle: "rounded-none",
    day_hidden: "invisible",
    row: "flex justify-center my-0.5",
    table: "space-y-1",
    months: "space-y-4",
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-medium dark:text-gray-100",
    nav: "flex items-center space-x-1"
  }
};
