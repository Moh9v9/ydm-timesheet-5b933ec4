
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface DateNavigationProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DateNavigation = ({ currentDate, setCurrentDate }: DateNavigationProps) => {
  const date = new Date(currentDate);
  
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(format(today, "yyyy-MM-dd"));
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(date);
    previousDay.setDate(date.getDate() - 1);
    setCurrentDate(format(previousDay, "yyyy-MM-dd"));
  };

  const goToNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setCurrentDate(format(nextDay, "yyyy-MM-dd"));
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center bg-card rounded-lg border p-2 sm:p-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToToday}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Today
        </Button>
        
        <div className="flex items-center">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-l-md hover:bg-accent transition-colors"
            aria-label="Previous day"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
          
          <div className="px-4 py-2 flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>{format(date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          
          <button
            onClick={goToNextDay}
            className="p-2 rounded-r-md hover:bg-accent transition-colors"
            aria-label="Next day"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateNavigation;
