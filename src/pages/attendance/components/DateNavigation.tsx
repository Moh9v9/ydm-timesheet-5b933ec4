
import DateNavigationControls from "./date-navigation/DateNavigationControls";
import DatePicker from "./date-navigation/DatePicker";

interface DateNavigationProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DateNavigation = ({ currentDate, setCurrentDate }: DateNavigationProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-card/50 backdrop-blur-sm border shadow-sm p-4">
        <DateNavigationControls currentDate={currentDate} setCurrentDate={setCurrentDate} />
        {/* Location Display */}
        <div className="hidden sm:flex items-center justify-center flex-1">
          <span className="text-muted-foreground text-sm px-4 py-2 bg-background rounded-md border">
            Location: <span className="font-medium">Main Office</span>
          </span>
        </div>
        <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
    </div>
  );
};

export default DateNavigation;
