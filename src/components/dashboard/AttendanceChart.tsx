
import { useAttendance } from "@/contexts/AttendanceContext";
import { format } from "date-fns";

interface AttendanceChartProps {
  presentToday: number;
  absentToday: number;
  activeEmployees: number;
}

export const AttendanceChart = ({
  presentToday,
  absentToday,
  activeEmployees,
}: AttendanceChartProps) => {
  const { currentDate } = useAttendance();
  const isToday = currentDate === new Date().toISOString().split('T')[0];
  const formattedDate = isToday 
    ? "Today" 
    : format(new Date(currentDate), "MMMM d, yyyy");

  return (
    <div className="bg-card shadow-sm rounded-lg p-6 border">
      <h2 className="text-lg font-medium mb-4">
        {formattedDate}'s Attendance Summary
      </h2>
      <div className="flex items-center justify-center h-32">
        <div className="flex items-end space-x-4">
          <div className="flex flex-col items-center">
            <div className="relative w-20">
              <div
                className="bg-green-500 rounded-t-md w-full"
                style={{
                  height: `${Math.max(
                    20,
                    (presentToday / Math.max(activeEmployees, 1)) * 100
                  )}px`,
                }}
              ></div>
            </div>
            <span className="mt-2 text-sm">Present</span>
            <span className="font-bold">{presentToday}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-20">
              <div
                className="bg-red-500 rounded-t-md w-full"
                style={{
                  height: `${Math.max(
                    20,
                    (absentToday / Math.max(activeEmployees, 1)) * 100
                  )}px`,
                }}
              ></div>
            </div>
            <span className="mt-2 text-sm">Absent</span>
            <span className="font-bold">{absentToday}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative w-20">
              <div
                className="bg-blue-500 rounded-t-md w-full"
                style={{ height: "100px" }}
              ></div>
            </div>
            <span className="mt-2 text-sm">Total</span>
            <span className="font-bold">{activeEmployees}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
