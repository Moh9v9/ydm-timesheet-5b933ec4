
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DateNavigationControlsProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DateNavigationControls = ({
  currentDate,
  setCurrentDate,
}: DateNavigationControlsProps) => {
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
    <>
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
      </div>
    </>
  );
};

export default DateNavigationControls;
