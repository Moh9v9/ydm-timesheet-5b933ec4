
import { cn } from "@/lib/utils";

export const datePickerStyles = {
  container: "block",
  label: "block text-sm font-medium mb-1.5 dark:text-gray-200",
  trigger: cn(
    "w-full flex items-center px-4 py-2.5 text-left",
    "border rounded-lg dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-100",
    "text-sm font-medium transition-all duration-200",
    "hover:border-primary/50 dark:hover:border-primary/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20",
    "active:scale-[0.98]"
  ),
  popoverContent: cn(
    "w-auto p-0",
    "border dark:border-gray-700",
    "rounded-lg overflow-hidden",
    "shadow-lg dark:shadow-black/10",
    "bg-white dark:bg-gray-800/95 backdrop-blur-sm"
  ),
  select: cn(
    "appearance-none pl-2 pr-6 py-1.5 rounded-md",
    "text-sm font-medium transition-colors duration-200",
    "bg-background border border-input",
    "text-foreground hover:bg-accent",
    "dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
    "dark:hover:bg-gray-700/80",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
    "dark:focus:ring-primary/40",
    "cursor-pointer relative"
  ),
  navigation: {
    button: cn(
      "p-1.5 rounded-md",
      "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
      "transition-colors duration-200"
    )
  },
  calendar: {
    wrapper: cn("p-4 pointer-events-auto select-none"),
    nav_button: cn(
      "inline-flex items-center justify-center rounded-md p-1.5",
      "text-muted-foreground hover:text-primary hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
      "transition-colors duration-200"
    ),
    head_cell: cn(
      "text-muted-foreground rounded-md w-9 font-normal text-xs",
      "uppercase tracking-wide"
    ),
    day: cn(
      "h-9 w-9 p-0 font-normal",
      "rounded-md transition-colors duration-200",
      "hover:bg-primary/10 dark:hover:bg-primary/20",
      "focus:outline-none focus:ring-2 focus:ring-primary/20"
    ),
    day_selected: cn(
      "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground",
      "hover:bg-primary hover:text-primary-foreground",
      "focus:bg-primary focus:text-primary-foreground"
    )
  },
  actions: {
    button: cn(
      "px-3 py-1 text-xs font-medium rounded-md",
      "bg-primary text-primary-foreground",
      "hover:bg-primary/90 transition-colors duration-200"
    )
  }
};

