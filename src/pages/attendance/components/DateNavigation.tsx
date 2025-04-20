
import { format, parse, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateNavigationProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DateNavigation = ({ currentDate, setCurrentDate }: DateNavigationProps) => {
  const goToPreviousDay = () => {
    const date = parse(currentDate, "yyyy-MM-dd", new Date());
    const prevDate = subDays(date, 1);
    setCurrentDate(format(prevDate, "yyyy-MM-dd"));
  };

  const goToNextDay = () => {
    const date = parse(currentDate, "yyyy-MM-dd", new Date());
    const nextDate = addDays(date, 1);
    setCurrentDate(format(nextDate, "yyyy-MM-dd"));
  };

  const goToToday = () => {
    setCurrentDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <div className="flex items-center justify-center p-4 bg-card rounded-lg border space-x-4">
      <button
        onClick={goToPreviousDay}
        className="w-10 h-10 rounded-full flex items-center justify-center 
                  transition-all duration-300 
                  bg-secondary text-secondary-foreground 
                  hover:bg-secondary/80 
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  shadow-sm hover:shadow-md"
        aria-label="Previous day"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center space-x-4">
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium
                    hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
        >
          Today
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center space-x-2 px-6 py-3 border rounded-lg hover:bg-accent/50 
                        transition-all duration-300 min-w-[280px] justify-center
                        shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <CalendarIcon size={18} />
              <span className="font-medium">
                {format(parse(currentDate, "yyyy-MM-dd", new Date()), "EEEE, MMMM d, yyyy")}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={parse(currentDate, "yyyy-MM-dd", new Date())}
              onSelect={(date) => {
                if (date) {
                  setCurrentDate(format(date, "yyyy-MM-dd"));
                }
              }}
              initialFocus
              className="rounded-md border shadow-md p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <button
        onClick={goToNextDay}
        className="w-10 h-10 rounded-full flex items-center justify-center 
                  transition-all duration-300 
                  bg-secondary text-secondary-foreground 
                  hover:bg-secondary/80 
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  shadow-sm hover:shadow-md"
        aria-label="Next day"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default DateNavigation;
