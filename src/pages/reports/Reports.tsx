
import { Download, Table } from "lucide-react";
import { useNotification } from "@/components/ui/notification";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ExportSection from "./components/ExportSection";
import ViewsSection from "./components/ViewsSection";

const Reports = () => {
  const { NotificationContainer } = useNotification();

  return (
    <div className="space-y-6 animate-fade-in">
      <NotificationContainer />
      
      <div>
        <h1 className="text-2xl font-bold">Reports & Exports</h1>
        <p className="text-muted-foreground">
          Generate and download attendance and employee reports
        </p>
      </div>
      
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="export" className="gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export Reports</span>
          </TabsTrigger>
          <TabsTrigger value="view" className="gap-2">
            <Table size={16} />
            <span className="hidden sm:inline">Views & Summaries</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="mt-0">
          <ExportSection />
        </TabsContent>
        
        <TabsContent value="view" className="mt-0">
          <ViewsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
