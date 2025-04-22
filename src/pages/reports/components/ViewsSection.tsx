
import { useState } from "react";
import { Calendar, FileSpreadsheet, CalendarDays } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import AttendanceSummaryTable from "./AttendanceSummaryTable";
import { useAttendance } from "@/contexts/AttendanceContext";

const ViewsSection = () => {
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");
  const { currentDate } = useAttendance();
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h2 className="text-lg font-medium dark:text-gray-200">{t('attendanceReports')}</h2>
          <p className="text-muted-foreground text-sm dark:text-gray-400">
            {t('viewAttendanceRecords')}
          </p>
        </div>
        
        <div className="self-start bg-muted/50 dark:bg-gray-800 rounded-md p-1">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger 
              value="daily" 
              onClick={() => setViewMode("daily")}
              className={`px-3 py-1.5 text-xs rounded ${viewMode === "daily" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
            >
              <Calendar size={14} className="mr-1" />
              {t('daily')}
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 text-xs rounded ${viewMode === "weekly" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
            >
              <FileSpreadsheet size={14} className="mr-1" />
              {t('weekly')}
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              onClick={() => setViewMode("monthly")}
              className={`px-3 py-1.5 text-xs rounded ${viewMode === "monthly" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
            >
              <CalendarDays size={14} className="mr-1" />
              {t('monthly')}
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800/50 rounded-lg border dark:border-gray-700 overflow-hidden">
        <AttendanceSummaryTable view={viewMode} currentDate={currentDate} />
      </div>
    </div>
  );
};

export default ViewsSection;
