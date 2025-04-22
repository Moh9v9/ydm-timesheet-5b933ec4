
import { Download, Calendar, Users } from "lucide-react";
import { useModernNotification } from "@/hooks/useModernNotification";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import ExportSection from "./components/ExportSection";
import EmployeeExportSection from "./components/EmployeeExportSection";

const Reports = () => {
  const { NotificationContainer } = useModernNotification();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <NotificationContainer />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold dark:text-gray-100">{t('reportsAndExports')}</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            {t('generateInsights')}
          </p>
        </div>
      </div>
      
      <div className="bg-card dark:bg-gray-800/50 border dark:border-gray-700 rounded-xl shadow-sm">
        <Tabs defaultValue="attendance" className="w-full">
          <div className="border-b dark:border-gray-700 px-6 pt-4">
            <TabsList className="bg-transparent mb-0 gap-6">
              <TabsTrigger 
                value="attendance" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2"
              >
                <Calendar size={16} />
                <span>{t('attendanceReports')}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="employees" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 py-3 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2"
              >
                <Users size={16} />
                <span>{t('employeeReports')}</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="attendance" className="mt-0">
              <ExportSection />
            </TabsContent>
            
            <TabsContent value="employees" className="mt-0">
              <EmployeeExportSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
