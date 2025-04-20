
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="flex items-center gap-2">
      <Button 
        variant="default"
        size="sm"
        onClick={goToToday}
        className="font-medium"
      >
        Today
      </Button>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousDay}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous day</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextDay}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next day</span>
        </Button>
      </div>
    </div>
  );
};

export default DateNavigationControls;
