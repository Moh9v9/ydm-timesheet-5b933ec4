
import DateNavigationControls from "./date-navigation/DateNavigationControls";
import DatePicker from "./date-navigation/DatePicker";

interface DateNavigationProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const DateNavigation = ({ currentDate, setCurrentDate }: DateNavigationProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center bg-card rounded-lg border p-2 sm:p-3">
        <DateNavigationControls currentDate={currentDate} setCurrentDate={setCurrentDate} />
        <DatePicker currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
    </div>
  );
};

export default DateNavigation;
