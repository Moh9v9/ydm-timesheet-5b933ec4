
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DatePicker = ({ currentDate, setCurrentDate }: DatePickerProps) => {
  const date = new Date(currentDate);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentDate(format(selectedDate, "yyyy-MM-dd"));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-4 py-2 flex items-center hover:bg-accent/50 rounded-md transition-colors">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
