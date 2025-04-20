
import { useState } from "react";
import { Calendar, FileSpreadsheet, CalendarDays } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceSummaryTable from "./AttendanceSummaryTable";
import { useAttendance } from "@/contexts/AttendanceContext";

const ViewsSection = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");
  const { currentDate } = useAttendance();

  return (
    <div className="bg-card shadow-sm rounded-lg border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium">Attendance Summaries</h2>
        <p className="text-muted-foreground">
          View and export attendance records by different time periods
        </p>
      </div>
      
      <div className="mb-6">
        <TabsList>
          <TabsTrigger 
            value="daily" 
            onClick={() => setViewMode("daily")}
            className={viewMode === "daily" ? "bg-primary text-primary-foreground" : ""}
          >
            <Calendar size={16} className="mr-2" />
            Daily
          </TabsTrigger>
          <TabsTrigger 
            value="weekly" 
            onClick={() => setViewMode("weekly")}
            className={viewMode === "weekly" ? "bg-primary text-primary-foreground" : ""}
          >
            <FileSpreadsheet size={16} className="mr-2" />
            Weekly
          </TabsTrigger>
          <TabsTrigger 
            value="monthly" 
            onClick={() => setViewMode("monthly")}
            className={viewMode === "monthly" ? "bg-primary text-primary-foreground" : ""}
          >
            <CalendarDays size={16} className="mr-2" />
            Monthly
          </TabsTrigger>
        </TabsList>
      </div>
      
      <AttendanceSummaryTable view={viewMode} currentDate={currentDate} />
    </div>
  );
};

export default ViewsSection;
