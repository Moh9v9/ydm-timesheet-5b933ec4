
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
        <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
    </div>
  );
};

export default DateNavigation;
